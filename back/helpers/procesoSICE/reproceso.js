const fs = require("fs");
const path = require("path");
const os = require("os");
const cron = require("node-cron");
const moment = require("moment");
const client = require("ssh2-sftp-client");
const colors = require("colors");

const config = require("./config");
const ruta = path.resolve(os.homedir(), "SICE/reemplazarSFTP");

const mariadb = require("mariadb");
const pool = mariadb.createPool({
    host: config.host,
    user: config.username,
    password: config.passwd,
    database: config.db,
});

const configSFTP = {
    host: config.hostSFTP,
    user: config.usernameSFTP,
    password: config.pwdSFTP,
};

const pathSFTP = "/HD4/repository7/documentos/digitalizacion/";

const reproceso = async () => {
    console.log("Iniciando...\t\t\t\tFolio\tTomo\tImgs".blue);
    var Id;
    const conn = await pool.getConnection((err, connection) => {
        if (err) console.log(err);
    });
    var archs = fs.readdirSync(ruta);
    archs = archs.filter((el) => path.parse(path.join(ruta, el)).ext == ".pdf");
    let sftp = new client();

    try {
        console.log("Conectando...".yellow);
        await sftp.connect(configSFTP);
        console.log("¡Conectado!".green);
        for (file of archs) {
            var folio = null,
                tomo = null,
                nh = null,
                sep = null;
            sep = path.parse(path.join(ruta, file)).name.split("_");
            folio = sep[0];
            // if (sep.length === 2) {
            //     tomo = sep[1];
            // }
            if (sep.length === 3) {
                tomo = sep[1];
                nh = sep[2];
            } else {
                nh = sep[1];
            }
            let a = await conn.query(
                `SELECT Id FROM T15 WHERE C22 = ${folio} AND C25 ${tomo ? "= " + tomo : "IS NULL"
                } AND C11242 = ${nh}`
            );
            conn.release();
            Id = a[0] ? a[0].Id : null;
            if (!Id) {
                console.log(
                    `${file}: \t\t\t${folio} ${tomo ? "Tomo " + tomo : ""
                        }\t${nh} no está en SICE. ----> Error\t${++index} de ${archs.length
                        }`.red
                );
                fs.appendFileSync(
                    path.join(ruta, "NoSubido", "reporte.csv"),
                    `${file},,${folio},${tomo ? tomo : ""},${nh}\n`,
                    "utf8"
                );
                fs.renameSync(
                    path.join(ruta, file),
                    path.join(ruta, "NoSubido", file)
                );
            } else if (!nh) {
                console.log(
                    `${file}: \t\t${folio} ${tomo ? "Tomo " + tomo : ""
                        }\t${nh} sin número de imágenes. ----> Error\t${++index} de ${archs.length
                        }`.red
                );
                fs.appendFileSync(
                    path.join(ruta, "Hecho", "reporte.csv"),
                    `${file},,${folio},${tomo ? tomo : ""},${nh},SIN HOJAS\n`,
                    "utf8"
                );
                fs.renameSync(path.join(ruta, file), path.join(ruta, "Error", file));
            } else {
                console.log(
                    `Subiendo ${file}: \t\t${folio} ${tomo ? "Tomo " + tomo : ""
                        }\t${nh}\t${++index} de ${archs.length}\t[ ${moment().format(
                            "L HH:mm:ss"
                        )} ]`.cyan
                );
                // await sftp.delete(pathSFTP + Id.toString() + '.pdf', true);
                // await sftp.delete(pathSFTP + Id.toString() + '.safe', true);
                await sftp.exists(pathSFTP + Id.toString() + '.pdf');
                await sftp.exists(pathSFTP + Id.toString() + '.safe');
                // await sftp.put(
                //     path.join(ruta, file),
                //     pathSFTP + Id.toString() + '.pdf'
                // )
                fs.renameSync(
                    path.join(ruta, file),
                    path.join(ruta, "Hecho", file)
                );
                fs.appendFileSync(
                    path.join(ruta, "Hecho", "reporte.csv"),
                    `${file},${Id},${folio},${tomo ? tomo : ""
                    },${nh},reemplazado\n`,
                    "utf8"
                );
                console.log(
                    `${Id.toString()}.pdf subido.\t[ ${moment().format(
                        "L HH:mm:ss"
                    )} ]`.green
                );
            }
        }
        sftp.end();
    }
    catch(err) {
        sftp.end();
        fs.renameSync(path.join(ruta, file), path.join(ruta, "Error", file));
        console.log("Error al conectar SFTP.".red);
        console.log(`${err}`);
    };
    console.log("\n\nFin...".blue);
};

reproceso();
