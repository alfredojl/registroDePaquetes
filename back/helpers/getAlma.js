const mongoose = require("mongoose");
const xlsx = require("xlsx");
const moment = require("moment");
const Folio = require("../server/models/Folios");
const mariadb = require("mariadb");
const fs = require("fs");

const list = require("./almaTodo.json");

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
    let notYet = 0,
      readies = 0,
      duplicated = 0;

    // * Consulta en lista
    let consult = await res.query(
      'SELECT C24 Paquete, C22 Folio, C25 Tomo, C23 Expediente, C29 Toca, C11242 "# Imágenes" FROM T15 WHERE Usuario = "DEVELOPMENT S&H" AND C22 IN (?) ORDER BY C22, C25;',
      [list]
    );
    consult.forEach((el) => {
      el.Paquete = el.Paquete ? el.Paquete : "N/A";
    });

    let doc, libro;
    doc = xlsx.utils.json_to_sheet(consult);
    libro = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(libro, doc, "Hoja 1");
    xlsx.writeFile(libro, `./foliosAlmaMarzo-Abril.xlsx`);
    console.log(`[ foliosAlmaMarzo-Abril.xlsx ] created.`);
    // * Hasta aquí
    // * Consulta si está o no
    // try {
    //   fs.statSync("./reporteFoliosAlmaMarzo-Abril.csv");
    // } catch (e) {
    //   fs.appendFileSync(
    //     "./reporteFoliosAlmaMarzo-Abril.csv",
    //     `folio,Usuario,Status\n`,
    //     "utf-8"
    //   );
    // }
    // for (el of list) {
    //   console.log(el);
    //   let folioConsult = await res.query(
    //     `SELECT C24 Paquete, C22 Folio, C25 Tomo, C23 Expediente, C29 Toca, C11242 "# Imágenes", Usuario FROM T15 WHERE C22 = ${el} ORDER BY C22, C25;`
    //   );

    //   if (folioConsult.length > 0) {
    //     let probe = null;
    //     folioConsult.forEach((el) => {
    //       // console.log(el.Usuario);
    //       if (el.Usuario == "DEVELOPMENT S&H") probe = true;
    //     });
    //     if (!probe) {
    //       fs.appendFileSync(
    //         "./reporteFoliosAlmaMarzo-Abril.csv",
    //         `${el},Registro existente en SICE.\n`,
    //         "utf-8"
    //       );
    //       duplicated++;
    //     } else {
    //       fs.appendFileSync(
    //         "./reporteFoliosAlmaMarzo-Abril.csv",
    //         `${el},Listo\n`,
    //         "utf-8"
    //       );
    //       readies++;
    //     }
    //   } else {
    //     fs.appendFileSync(
    //       "./reporteFoliosAlmaMarzo-Abril.csv",
    //       `${el},Aún no se sube.\n`,
    //       "utf-8"
    //     );
    //     notYet++;
    //   }
    //   // if (folioConsut.length == 0)
    //   // else fs.appendFileSync("./estaONo.csv", `${el},'YES'\n`, "utf-8");
    // }
    // console.log("Lista:\t", list.length, "Duplicados:\t", duplicated);
    // console.log("Arriba:\t", readies, "Not yet:\t", notYet);
    // * Hasta aquí
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

getAlma();
