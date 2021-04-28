const mongoose = require("mongoose");
const xlsx = require("xlsx");
const moment = require("moment");
const Folio = require("../server/models/Folios");
const mariadb = require("mariadb");
const fs = require("fs");

const list = require("./alma.json");

const getAlma = async () => {
  try {
    let res = await mariadb.createConnection({
      host: "10.17.5.40",
      user: "proveedor",
      password: "$354m0.1",
      database: "documentos",
    });
    console.log("Conectado...");
    let lunes = moment("2021-04-12").format("DD-MM");
    let martes = moment("2021-04-16").format("DD-MM");

    // * Consulta en lista
    // let consult = await res.query(
    //   'SELECT C24 Paquete, C22 Folio, C25 Tomo, C23 Expediente, C29 Toca, C11242 "# Imágenes" FROM T15 WHERE Usuario = "Development S&H" AND C22 IN (?) ORDER BY C22, C25;',
    //   [list]
    // );
    // * Consulta si está o no
    for (el of list) {
      console.log(el);
      let folioConsult = await res.query(
        `SELECT C24 Paquete, C22 Folio, C25 Tomo, C23 Expediente, C29 Toca, C11242 "# Imágenes", Usuario FROM T15 WHERE C22 = ${el} ORDER BY C22, C25;`
      );

      if (folioConsult.length > 0) {
        console.log(folioConsult[0].Usuario);
        fs.appendFileSync(
          "./otrosUsuarios.csv",
          `${el},${folioConsult[0].Usuario}\n`,
          "utf-8"
        );
      }
      // if (folioConsut.length == 0)
      // else fs.appendFileSync("./estaONo.csv", `${el},'YES'\n`, "utf-8");
    }
    // * Hasta aquí
    consult.forEach((el) => {
      el.Paquete = el.Paquete ? el.Paquete : "N/A";
    });
    // console.log(consult);
    // let doc, libro;
    // doc = xlsx.utils.json_to_sheet(consult);
    // libro = xlsx.utils.book_new();
    // xlsx.utils.book_append_sheet(libro, doc, "Hoja 1");
    // xlsx.writeFile(libro, `./foliosAlma.xlsx`);
    // console.log(`[ foliosAlma${lunes}_${martes}.xlsx ] created.`);
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

getAlma();
