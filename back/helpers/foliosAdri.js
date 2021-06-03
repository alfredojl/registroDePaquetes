const mariadb = require("mariadb");
const fs = require("fs");
const colors = require("colors");
const util = require("util");

const checkFolios = async () => {
  let res = await mariadb.createConnection({
    host: "10.17.5.40",
    user: "proveedor",
    password: "$354m0.1",
    database: "documentos",
  });

  let lista = require("./foliosAdri.json");
  //   lista = lista.slice(0, 20);
  try {
    try {
      fs.unlinkSync("./reporteFoliosAdri.csv");
      fs.appendFileSync(
        "./reporteFoliosAdri.csv",
        "Paquete,Folio,Tomo,Status\n",
        "utf-8"
      );
    } catch (error) {
      console.log("Creando archivo por primera vez...");
      fs.appendFileSync(
        "./reporteFoliosAdri.csv",
        "Paquete,Folio,Tomo,Status\n",
        "utf-8"
      );
    }
    let total = lista.length;
    let index = 0;
    for (el of lista) {
      let partes = el.split(" ");
      let folio = parseInt(partes[0]);
      let tomo = partes[1] ? "= " + partes[1] : "IS NULL";
      process.stdout.write(`${folio}\t\t${tomo}\t\t${++index} de ${total}`);
      let consult = await res.query(
        `SELECT C24 Paquete, C22 Folio, C25 Tomo, C11242 "# Imágenes" FROM T15 WHERE Usuario = "DEVELOPMENT S&H" AND C22 = ${folio} AND C25 ${tomo};`
      );
      if (!!consult && consult.length > 0) {
        process.stdout.write(" ¡Sí!\n".green);
        fs.appendFileSync(
          "./reporteFoliosAdri.csv",
          `${consult[0].Paquete || null},${consult[0].Folio},${
            consult[0].Tomo
          },'TRUE'\n`,
          "utf-8"
        );
      } else {
        process.stdout.write(' ¡No!\n'.red);
        fs.appendFileSync(
          "./reporteFoliosAdri.csv",
          `,${folio},${tomo},'FALSE'\n`,
          "utf-8"
        );
      }
    }
    process.exit();
  } catch (error) {}
};

checkFolios();
