const Client = require("ssh2-sftp-client");
const xlsx = require("xlsx");
const mariadb = require("mariadb");
const path = require("path");
const os = require("os");
const colors = require("colors");

const getSFTP = async () => {
  try {
    const pool = mariadb.createPool({
      host: "10.17.5.40",
      user: "proveedor",
      password: "$354m0.1",
      database: "documentos",
    });

    let conn = await pool.getConnection();
    let sftp = new Client();
    await sftp.connect({
      host: "10.17.5.40",
      username: "proveedor",
      password: "Pr0v33d0r.$!C3",
    });

    let archivosATraer = xlsx.readFile("./traerSFTP.xlsx");
    let heads = archivosATraer.SheetNames;
    let temp = xlsx.utils.sheet_to_json(archivosATraer.Sheets[heads[0]], {
      skipHeader: true,
    });
    let index = 0;
    let tam = temp.length;
    for (el of temp) {
      let Id = await conn.query(
        `SELECT Id, C11242 imgs FROM T15 WHERE C22 = ${el.Folio} AND C25 ${
          el.Tomo ? "= " + el.Tomo : "IS NULL"
        };`
      );
      conn.release();
      process.stdout.write(`${Id[0].Id}\t${++index} de ${tam}\t`.yellow);
      await sftp.get(
        `/HD4/repository7/documentos/digitalizacion/${Id[0].Id}.pdf`,
        path.join(
          os.homedir(),
          "Documents",
          "PruebaGetSFTP",
          `${el.Tomo ? el.Folio + "_" + el.Tomo : el.Folio}_${Id[0].imgs}.pdf`
        )
      );
      process.stdout.write('\tDownloaded\n'.green)
    }
    sftp.end();
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

getSFTP();
