const mongoose = require("mongoose");
const xlsx = require("xlsx");
const moment = require("moment");
const Folio = require("../server/models/Folios");
const mariadb = require("mariadb");
const fs = require("fs");
const colors = require("colors");

moment.locale('es-mx');
// const list = require("./gerardo.json");

const getAlma = async () => {
  try {
    let res = await mariadb.createConnection({
      host: "10.17.5.40",
      user: "proveedor",
      password: "$354m0.1",
      database: "documentos",
    });
    console.log("Conectado...");
    // let lunes = moment("2021-04-12").format("DD-MM");
    // let martes = moment("2021-04-16").format("DD-MM");
    // let notYet = 0,
    //   readies = 0,
    //   duplicated = 0;

    // * Agrega mes de carga a lista.
    
    const reporte = xlsx.readFile('./reporteOctubre.xlsx');
    const heads = reporte.SheetNames;
    let temp = xlsx.utils.sheet_to_json(reporte.Sheets[heads[0]], {
      skipHeader: false
    });

    const tam = temp.length;
    
    for ( [ index, exp ] of temp.slice(0, temp.length - 1).entries() ) {
      const consult = await res.query(`SELECT Fecha FROM T15 WHERE C22 = ${ exp.Folio }`);
      temp[index].Mes = moment(consult[0].Fecha).format('MMMM').toUpperCase();
      console.log(`${ index + 1 }`.green, ` de `.yellow, `${ tam }`.cyan);
    }

    let doc, libro;
    doc = xlsx.utils.json_to_sheet( temp );
    libro = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(libro, doc, "Hoja 1");
    xlsx.writeFile(libro, `./reporteOctubreWMonth.xlsx`);
    console.log(`[ reporteOctubreWMonth ] created.`);
    
    // * Agrega mes de carga a lista.
    // * Consulta masiva en SICE (subido en mayo).
    // let consult = await res.query(
    //   `SELECT C24 Paquete, C22 Folio, C25 Tomo, C11242 "Imágenes" FROM T15 WHERE Usuario = "DEVELOPMENT S&H" AND Fecha >= '2021-03-01';`
    // );
    // let doc, libro;
    // doc = xlsx.utils.json_to_sheet(consult);
    // libro = xlsx.utils.book_new();
    // xlsx.utils.book_append_sheet(libro, doc, "Hoja 1");
    // xlsx.writeFile(libro, `./todoSICE.xlsx`);
    // console.log(`[ todoSICE ] created.`);
    // * Aquí
    // * Consulta masiva SICE normal
    // let consult = await res.query(
    //   `SELECT C24 Paquete, C22 Folio, C25 Tomo, C23 Expediente, C29 Toca, C11242 "Imágenes" FROM T15 WHERE Usuario = "DEVELOPMENT S&H" AND Fecha >= '2021-03-01' ORDER BY C22, C25;`
    // );
    // ! Para duplicados
    // let consult = await res.query(
    //   `SELECT Id, C24 Paquete, C22 Folio, C25 Tomo, C11242 "Imágenes" FROM (SELECT Id, C24, C22, C25, C11242, COUNT(*) rep FROM T15 WHERE Usuario = "DEVELOPMENT S&H" GROUP BY C22, C25 HAVING rep > 1) ch`
    // );
    // let lista = consult.map(el => {
    //   return el.Folio;
    // });
    // let consulta2 = await res.query(
    //   `SELECT Id, C24 Paquete, C22 Folio, C25 Tomo, C11242 "Imágenes" FROM T15 WHERE Usuario = "DEVELOPMENT S&H" AND C22 IN (?) ORDER BY C22, C25;`,
    //   [lista]
    // );
    // consulta2.forEach((el, index) => {
    //   el["Número"] = index + 1;
    // });
    // console.log(consulta2.length);
    // ! Para duplicados
    // let doc, libro;
    // doc = xlsx.utils.json_to_sheet(consult);
    // libro = xlsx.utils.book_new();
    // xlsx.utils.book_append_sheet(libro, doc, "Hoja 1");
    // xlsx.writeFile(libro, `./reporteSICE.xlsx`);
    // console.log(`[ reporteSICE ] created.`);
    // * Aquí
    // * Consulta en SICE (CSV)
    // let consult = await res.query(
    //   `SELECT C24 Paquete, C22 Folio, C25 Tomo, C11242 "# Imágenes" FROM T15 WHERE Usuario = "DEVELOPMENT S&H" AND C22 IN (?) ORDER BY C22, C25;`,
    //   [list]
    // );
    // let suma = await res.query(
    //   'SELECT SUM(C11242) suma FROM T15 WHERE Usuario = "DEVELOPMENT S&H" AND C22 IN (?) ORDER BY C22, C25;',
    //   [list]
    // );
    // // console.log(suma);
    // consult.push({ Paquete: "Total", "# Imágenes": suma[0].suma });
    // consult.forEach((el) => {
    //   el.Paquete = el.Paquete ? el.Paquete : "N/A";
    // });

    // let doc, libro;
    // doc = xlsx.utils.json_to_sheet(consult);
    // libro = xlsx.utils.book_new();
    // xlsx.utils.book_append_sheet(libro, doc, "Hoja 1");
    // xlsx.writeFile(libro, `./${name2}.xlsx`);
    // console.log(`[ ${name2} ] created.`);
    // * Hasta aquí

    // * Consulta si está o no
    // try {
    //   await fs.unlinkSync(`./${name}.csv`);
    //   await fs.appendFileSync(
    //     `./${name}.csv`,
    //     `folio,Status\n`,
    //     "utf-8"
    //   );
    // } catch (e) {
    //   fs.appendFileSync(
    //     `./${name}.csv`,
    //     `folio,Status\n`,
    //     "utf-8"
    //   );
    // }
    // for (el of list) {
    //   process.stdout.write(`${el}`);
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
    //         `./${name}.csv`,
    //         `${el},Registro previo en SICE.\n`,
    //         "utf-8"
    //       );
    //       process.stdout.write(' ¡Duplicado!\n')
    //       duplicated++;
    //     } else {
    //       fs.appendFileSync(
    //         `./${name}.csv`,
    //         `${el},Listo\n`,
    //         "utf-8"
    //         );
    //         process.stdout.write(' ¡Ready!\n')
    //         readies++;
    //       }
    //     } else {
    //       fs.appendFileSync(
    //         `./${name}.csv`,
    //         `${el},Aún no se sube.\n`,
    //         "utf-8"
    //         );
    //       process.stdout.write(' ¡Aún no!\n')
    //     notYet++;
    //   }
    //   // if (folioConsut.length == 0)
    //   // else fs.appendFileSync("./estaONo.csv", `${el},'YES'\n`, "utf-8");
    // }
    // console.log("Lista:\t", list.length, "Duplicados:\t", duplicated);
    // console.log("Arriba:\t", readies, "Not yet:\t", notYet);
    // * Hasta aquí

    //* Consulta en SICE (XSLX) edit: no. imágenes para Camilo.
    // const listaFolios = xlsx.readFile("./pedirARecinto.xlsx");
    // let index = 0;
    // let heads = listaFolios.SheetNames;
    // let temp = xlsx.utils.sheet_to_json(listaFolios.Sheets[heads[0]], {
    //   skipHeader: true,
    // });
    // // temp = temp.map((el) => {
    // //   return {
    // //     folio: el.FOLIO,
    // //     tomo: el.TOMO || null,
    // //   };
    // // });
    // // let resultadoFinal = [];
    // let tam = temp.length;
    //   for ([index, el] of temp.entries()) {
    //     console.log(index, el);
    //     let imgs = await res.query(`SELECT C11242 imgs FROM T15 WHERE Usuario = "DEVELOPMENT S&H" AND C22 = ${el.FOLIO} AND C25 ${el.TOMO ? '= ' + el.TOMO : 'IS NULL'};`)
    //     el.IMGS = imgs[0].imgs;
    //     console.log(imgs[0].imgs, el.IMGS);
    //     // let folioFinded = await res.query(
    //     //   `SELECT Id FROM T15 WHERE Usuario = "DEVELOPMENT S&H" AND C22 = ${
    //     //     el.folio
    //     //   } AND C25 ${el.tomo ? "= " + el.tomo : "IS NULL"};`
    //     // );

    //     // if (folioFinded[0])
    //     //   resultadoFinal.push({
    //     //     folio: el.folio,
    //     //     tomo: el.tomo,
    //     //     encontrado: true
    //     //   })
    //     // else
    //     //   resultadoFinal.push({
    //     //     folio: el.folio,
    //     //     tomo: el.tomo,
    //     //     encontrado: false
    //     //   })
    //     // console.log(resultadoFinal[index], ++index, tam);
    //   }
    //   let doc, libro;
    //   doc = xlsx.utils.json_to_sheet(temp);
    //   libro = xlsx.utils.book_new();
    //   xlsx.utils.book_append_sheet(libro, doc, "Hoja 1");
    //   xlsx.writeFile(libro, `./pedirARecintoWImgs.xlsx`);
    //   console.log(`[ pedirARecintoWImgs ] created.`);
    // * Hasta aquí
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

getAlma();
