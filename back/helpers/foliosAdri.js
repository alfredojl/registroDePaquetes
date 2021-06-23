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
  const lista = xlsx.readFile("./pedirVictorVersionFinalV2.xlsx");
  let heads = lista.SheetNames;
  let temp = xlsx.utils.sheet_to_json(lista.Sheets[heads[0]], {
    skipHeader: true,
  });

  //   lista = lista.slice(0, 20);
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
    for (el of temp) {
      let archivo = el.PDF.split('.')
      let partes = archivo[0].split("_");
      let folio = parseInt(partes[0]);
      let tomo = partes[1] ? "= " + partes[1] : "IS NULL";
      let t = partes[1] ? partes[1] : "";
      process.stdout.write(
        `${folio}\t\t${tomo} ${t}\t\t${++index} de ${total}`
      );
      let consult = await res.query(
        `SELECT C24 Paquete, C22 Folio, C25 Tomo, C11242 "# Imágenes" FROM T15 WHERE Usuario = "DEVELOPMENT S&H" AND C22 = ${folio} AND C25 ${tomo};`
      );
      if (!!consult && consult.length > 0) {
        process.stdout.write(" ¡Sí!\n".green);
        resultado.push({
          folio,
          tomo: t,
          status: "Encontrado",
        });
      } else {
        process.stdout.write(" ¡No!\n".red);
        resultado.push({
          folio,
          tomo: t,
          status: "No encontrado",
        });
      }
    }
    let doc, libro;
    doc = xlsx.utils.json_to_sheet(resultado);
    libro = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(libro, doc, 'reporteVicSICE');
    xlsx.writeFile(libro, `./reporteVicSICE.xlsx`);
    console.log(`[reporteVicSICE.xlsx] created.`);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

checkFolios();
