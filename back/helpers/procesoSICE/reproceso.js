const fs = require('fs');
const path = require('path');
const os = require('os');
const cron = require('node-cron');
const moment = require('moment');
const client = require("ssh2-sftp-client");
const colors = require('colors');

const config = require('./config');
const ruta = path.resolve(os.homedir(), "SICE/reemplazarSFTP");

const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: config.host,
    user: config.username,
    password: config.passwd,
    database: config.db
});

const configSFTP = {
    host: config.hostSFTP,
    user: config.usernameSFTP,
    password: config.pwdSFTP
};

const pathSFTP = '/HD4/repository7/documentos/digitalizacion/'

const reproceso = async() => {
    console.log('Iniciando...'.blue)
    let conn = await pool.getConnection((err, connection) => { if (err) console.log(err) });
    var archs = fs.readdirSync(ruta);
    archs = archs.filter(el => path.parse(path.join(ruta, el)).ext == '.pdf')
    archs = archs.slice(0, 1);
    let sftp = new client;

    await sftp.connect(configSFTP)
        .then(async() => {
            for (file of archs) {
                var folio = null,
                    tomo = null,
                    nh = null,
                    sep = null;
                sep = path.parse(path.join(ruta, file)).name.split('_');
                // console.log(file);
                folio = sep[0];
                // if (sep.length === 2) {
                //     tomo = sep[1];
                // }
                if (sep.length === 3) {
                    tomo = sep[1];
                    nh = sep[2]
                } else {
                    nh = sep[1]
                }
                if (!nh) {
                    console.log(`${file}: \t\t${folio} ${tomo ? 'Tomo ' + tomo : ''}\t${nh} sin número de imágenes. ----> Eror`.red);
                    fs.appendFileSync(path.join(ruta, 'Hecho', 'reporte.csv'), `${file},,${folio},${tomo ? tomo : ''},${nh},SIN HOJAS\n`, 'utf8')
                    fs.renameSync(path.join(ruta, file), path.join(ruta, 'Error', file));
                } else {
                    let a = await conn.query(`SELECT Id FROM T15 WHERE C22 = ${folio} AND C25 ${tomo ? '= ' + tomo : 'IS NULL'}`)
                        // console.log(nh);
                    let id = a[0].Id;
                    console.log(id);
                    conn.release();
                    console.log(`Subiendo ${file}: \t\t${folio} ${tomo ? 'Tomo ' + tomo : ''}\t${nh}`.cyan);
                    await sftp.list(pathSFTP, 'pdf' || 'safe')
                        .then(() => {
                            // fs.renameSync()
                            // console.log(path.join(pathSFTP, id.toString() + '.pdf'));
                            fs.copyFileSync(path.join(ruta, file), path.join(ruta, 'SFTP', id.toString() + '.pdf'))
                            fs.renameSync(path.join(ruta, file), path.join(ruta, 'Hecho', file));
                            fs.appendFileSync(path.join(ruta, 'Hecho', 'reporte.csv'), `${file},${id},${folio},${tomo ? tomo : ''},${nh},reemplazado\n`, 'utf8')
                            console.log('¡Reemplazado!'.green);
                        })
                }
            }
        })
        .then(() => sftp.end())
        .catch(err => {
            // console.log(path.join(ruta, 'Error', file));
            fs.renameSync(path.join(ruta, file), path.join(ruta, 'Error', file));
            console.log('Error al conectar SFTP.'.red);
            // fs.appendFileSync(path.join(ruta, 'Hecho', 'reporte.csv'), `${file},${folio},${tomo ? tomo : ''},${nh},no\n`, 'utf8')
            console.log(`${err}`.red)
        })
    console.log('Fin...'.blue);

    // console.log(archs);
    // console.log(folio, tomo);
    // await sftp
    //     .connect(configSFTP)
    //     .then(async() => {
    //         return await sftp.list(pathSFTP, 'pdf' || 'safe')
    //     })
    //     .then(data => console.log(data.length))
    //     .then(() => sftp.end())
    //     .catch(err => console.log(err))
};

reproceso();