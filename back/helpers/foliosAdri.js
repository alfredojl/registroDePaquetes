const mariadb = require("mariadb");
const xlsx = require("xlsx");
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

  // let lista = require("./foliosAdri.json");
  let resultado = [];
  const lista = xlsx.readFile("./revisarSICE.csv");
  let heads = lista.SheetNames;
  let temp = xlsx.utils.sheet_to_json(lista.Sheets[heads[0]]);
  try {
    //   try {
    //     fs.unlinkSync("./reporteFoliosAdri.csv");
    //     fs.appendFileSync(
    //       "./reporteFoliosAdri.csv",
    //       "Paquete,Folio,Tomo,Status\n",
    //       "utf-8"
    //     );
    //   } catch (error) {
    //     console.log("Creando archivo por primera vez...");
    //     fs.appendFileSync(
    //       "./reporteFoliosAdri.csv",
    //       "Paquete,Folio,Tomo,Status\n",
    //       "utf-8"
    //     );
    //   }
    let total = temp.length;
    let index = 0;
    let status = '';
    // ? Checa en SICE la existencia de los folios
    for (el of temp) {
      process.stdout.write(`${++index}/${total}\t${el.Folio} ${el.Tomo ? el.Tomo : ''}\t`.yellow);
      let consulta = await res.query(`SELECT Id FROM T15 WHERE Usuario = "DEVELOPMENT S&H" AND C22 = ${el.Folio} AND C25 ${el.Tomo ? '= ' + el.Tomo : 'IS NULL'}`);
      if (consulta.length > 0) {
        process.stdout.write(`Sí\n`.green)
        status = true;
      }
      else {
        process.stdout.write(`No\n`.cyan)
        status = false;
      }
      resultado.push({
        ...el,
        status
      });
    }
    // ? Fin del checa.    
    // ! Creo que creaba en la BD.
    //* for (el of temp) {
    //*   let archivo = el.PDF.slice(0, el.PDF.indexOf('.'));
    //*   let partes = archivo.split("_");
    //*   let folio = parseInt(partes[0]);
    //*   let tomo = partes.length == 3 ? "= " + partes[1] : "IS NULL";
    //*   let t = partes.length == 3 ? partes[1] : "";
    //*   process.stdout.write(
    //*     `${folio}\t\t${tomo} ${t}\t\t${++index}/${total}`
    //*   );
    //*   let consult = await res.query(
    //*     `SELECT C24 Paquete, C22 Folio, C25 Tomo, C11242 "# Imágenes" FROM T15 WHERE Usuario = "DEVELOPMENT S&H" AND C22 = ${folio} AND C25 ${tomo};`
    //*   );
    //*   if (!!consult && consult.length > 0) {
    //*     process.stdout.write(" ¡Sí!\n".green);
    //*     resultado.push({
    //*       PDF: el.PDF,
    //*       status: "Encontrado",
    //*     });
    //*   } else {
    //*     process.stdout.write(" ¡No!\n".red);
    //*     resultado.push({
    //*       PDF: el.PDF,
    //*       status: "No encontrado",
    //*     });
    //*   }
    //* }
    // ! Fin del creo.
    let doc, libro;
    doc = xlsx.utils.json_to_sheet(resultado);
    libro = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(libro, doc);
    xlsx.writeFile(libro, `./auditoriaSICEyServidor.xlsx`);
    console.log(`[ auditoriaSICEyServidor.xlsx ] created.`);
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

checkFolios();
