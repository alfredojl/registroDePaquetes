const mongoose = require("mongoose");
const xlsx = require("xlsx");
const moment = require("moment");
const Folio = require("../server/models/Folios");
const Paquete = require("../server/models/Paquetes");
const colors = require("colors");
const axios = require("axios");
const fs = require("fs");

const lote = async () => {
  try {
    let bd = await mongoose.connect(
      //   "mongodb://production:production$@172.26.60.61:27017/registro?authSource=admin",
      "mongodb://localhost:27017/registro",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }
    );
    console.log("Mongo connected...");
    // const lote10 = require("./lote10.json");
    let lote10 = xlsx.readFile('./noProcesados.xlsx');
    let heads = lote10.SheetNames;
    let temp = xlsx.utils.sheet_to_json(lote10.Sheets[heads[0]], {
      skipHeader: false,
    });

    for (el of temp) {
      // console.log(el);
      
    }

    let index = 0;
    let foliosFaltantes = [];
    // for (el of lote10) {
    //   // console.log(el, ++index);
    //   let paquete = await Paquete.findOne({ noPaquete: el });
    //   //   console.log(
    //   //     colors.green(paquete.folioInicio),
    //   //     colors.green(paquete.folioFin)
    //   //   );
    //   process.stdout.write(`${el}\n`.cyan);
    //   for (let i = paquete.folioInicio; i <= paquete.folioFin; i++) {
    //     // console.log(i);
    //     let folio = await Folio.findOne({ folio: i });
    //     // foliosFaltantes.push({
    //     //     Paquete: el,
    //     //     Folio: i,
    //     //     Status: folio ? true : false
    //     // })
    //     // * Busca la info en BDA
    //     // if (!folio) {
    //     //   process.stdout.write(`\t${i}`.magenta);
    //     //   let m = await axios.get(
    //     //     "http://digitalizacion.pjcdmx.gob.mx/consulta_folio.php",
    //     //     {
    //     //       params: {
    //     //         f: i,
    //     //       },
    //     //     }
    //     //   );
    //     //   if (!m.encontrado) {
    //     //     let toCreate = {
    //     //       folio: i,
    //     //       expediente: m.expediente,
    //     //       noPaquete: el,
    //     //       juzgado: m.juzgado,
    //     //       instanciaJ: m.insJuz,
    //     //       instanciaS: m.insSal,
    //     //       dependencia: m.dependencia,
    //     //       toca: m.toca,
    //     //       actor: m.actor,
    //     //       demandado: m.demandado,
    //     //       juicio: m.juicio,
    //     //       sala: m.Sala,
    //     //       observaciones: null,
    //     //       validado: true,
    //     //     };
    //     //     let folioCreated = await Folio.create(toCreate);
    //     //     process.stdout.write(" creado\n".green);
    //     //   } else process.stdout.write(" No se encontró\n".red);
    //     // }
    //     // * Busca la info en BDA
    //   }
    // }
    // * Crea lista de folios que no encontró.
    // let doc, libro;
    // doc = xlsx.utils.json_to_sheet(foliosFaltantes);
    // libro = xlsx.utils.book_new();
    // xlsx.utils.book_append_sheet(libro, doc, "Hoja 1");
    // xlsx.writeFile(libro, `./foliosFaltantes.xlsx`);
    // console.log(`[ foliosFaltantes ] created.`);
    // * Crea lista de folios que no encontró.
  } catch (e) {
    console.log(e);
  }
  process.exit();
};

lote();
