const MongoClient = require("mongodb").MongoClient,
  assert = require("assert");
const xlsx = require("xlsx");
const axios = require("axios");
const colors = require("colors");

// const reporte800 = require("./reporte800.json");
// const name = 'registro30.03';
const nameAdrian = "foliosLote69";

const moment = require("moment");
moment.locale("es-mx");
const yesterday = moment().subtract(1, "days").format("DD/MM/YYYY");
const cron = require("node-cron");
const mongoose = require("mongoose");
const Folio = require("../server/models/Folios");

const lista = require("./lista.json");

const getPaquetes = async () => {
  MongoClient.connect(
    "mongodb://production:production$@172.26.60.61:27017/registro?authSource=admin",
    // { useUnifiedTopology: true },
    // "mongodb://localhost:27017/registro",
    { useUnifiedTopology: true },
    async (err, res) => {
      let regex = "2021-05-11";
      let day = moment(regex).hours(0).minutes(0).seconds(0).format();
      // let lDay = moment("2021-05-03")
      //   .hours(23)
      //   .minutes(59)
      //   .seconds(59)
      //   .format();

      if (err) throw err;
      console.log("BD ONLINE");

      // archivo.find({FechaProcesado: {$gte: fecha}}).toArray((err, cols) => {
      // await archivo.find({ FechaProcesado: { $regex: yesterday  } }).toArray((err, cols) => {
      // await archivo.find({ FechaProcesado: {$regex: regex}, Error: false}).sort({ Folio: 1, Tomo: 1 }).toArray(async(err, cols) => {
      // await archivo.find({ Procesado: true, Error: false, FechaProcesado: {$regex: '29/12/2020'} }).sort({Folio: 1, Tomo: 1}).toArray(async(err, cols) => {
      //======================================================================================================================================
      //***********************************************************************************************************************************+
      // * Para paquetes lista de folios
      // const listaFolios = xlsx.readFile("./600kconPaquete.xlsx");
      // const folios = res.db("registro").collection("folios");
      // let index = 0;
      // let heads = listaFolios.SheetNames;
      // let temp = xlsx.utils.sheet_to_json(listaFolios.Sheets[heads[0]], {
      //   skipHeader: true,
      // });
      // temp = temp.map((el) => {
      //   return {
      //     folio: el.Folio,
      //     tomo: el.Tomo || null,
      //     noPaquete: el.Paquete,
      //     numeroImagenes: el.Imgs,
      //   };
      // });
      // for (el of temp.slice(0, 1)) {
      //   // let con = await folios.findOne({ folio: el.Folio });
      //   // let noPaquete = con ? con.noPaquete : 'N/A';
      //   let m = await axios.get(
      //     "http://digitalizacion.pjcdmx.gob.mx/consulta_folio.php",
      //     {
      //       params: {
      //         f: el.folio,
      //       },
      //     }
      //   );
      //   console.log(m.data.encontrado);
      //   if (m.data.encontrado) {
      //     let toUpdate = {
      //       expediente: m.expediente,
      //       juzgado: m.juzgado,
      //       instanciaJ: m.insJuz,
      //       instanciaS: m.insSal,
      //       dependencia: m.dependencia,
      //       toca: m.toca,
      //       actor: m.actor,
      //       demandado: m.demandado,
      //       juicio: m.juicio,
      //       sala: m.Sala,
      //       observaciones: null,
      //       validado: true,
      //     };
      //     let foliosFinded = await folios.find({ folio: el.folio });
      //     console.log("Before".red, foliosFinded);
      //     // let folioUpdated= await folios.updateMany({ folio: el.folio.toString() }, toUpdate);
      //     // console.log('After'.red, folioUpdated);
      //     // process.stdout.write(`\t${folioUpdated.result.nModified} de ${folioUpdated.result.n} actualizado(s).\n`.yellow);
      //   } else process.stdout.write("\tNo se encontró\n".red);
      //   // el.Paquete = noPaquete;
      //   // console.log(el);
      // }
      // // let doc, libro, newTemp;
      // // newTemp = temp.map(el => {
      // //   return {
      // //     Paquete: el.Paquete,
      // //     Folio: el.Folio,
      // //     Tomo: el.Tomo || null,
      // //     Imgs: el.IMGs
      // //   }
      // // });
      // // console.log(newTemp);
      // process.exit(0);
      // doc = xlsx.utils.json_to_sheet(newTemp);
      // libro = xlsx.utils.book_new();
      // xlsx.utils.book_append_sheet(libro, doc);
      // xlsx.writeFile(libro, `./600kconPaquete.xlsx`);
      // console.log(`[600kconPaquete.xlsx] created.`);
      // process.exit(0);
      // * Get folios faltantes
      const archivo = res.db("registro").collection("folios");
      let faltantes = await archivo
        .find({ estado: "Faltante" })
        .sort({ folio: 1 })
        .toArray();
      // console.log(faltantes);
      faltantes = faltantes.map((el) => {
        let Paquete;
        if (el.bis)
          if (el.cantidad)
            Paquete =
              el.noPaquete + " Bis " + el.identificador + "/" + el.cantidad;
          else Paquete = el.noPaquete + " Bis";
        else Paquete = el.noPaquete;

        return {
          Paquete,
          Folio: el.folio,
          Estado: el.estado,
        };
      });
      let doc, libro;
      doc = xlsx.utils.json_to_sheet(faltantes);
      libro = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(libro, doc, "Camiloooos");
      xlsx.writeFile(libro, `./faltantesSistema.xlsx`);
      console.log(`[faltantesSistema.xlsx] created.`);
      process.exit();
      // * Hasta aquí
      //***********************************************************************************************************************************+
      // * Para conteo de folios... Adrián.

      // const archivo = res.db("registro").collection("folios");
      // let conteo = [];
      // let foliosTotal = 0;
      // for (el of lista) {
      //   var noPaquete = null;
      //   var bis = false;
      //   if (typeof el === "string") {
      //     var noPaquete = parseInt(el.split(" ")[0]);
      //     var bis = true;
      //   } else {
      //     noPaquete = el;
      //   }
      //   let count = await archivo.countDocuments({ noPaquete, bis });
      //   foliosTotal += count;
      //   conteo.push({
      //     Paquete: bis ? noPaquete + " BIS" : noPaquete,
      //     Folios: count,
      //   });
      //   // , async(err, foliosDB) => {
      //   //     console.log(foliosDB);
      //   //     foliosTotal += foliosDB;
      //   // })
      // }
      // conteo.push({
      //   Paquete: "Total =",
      //   Folios: foliosTotal,
      // });
      // console.log(conteo, conteo.length);
      // let doc, libro;
      // doc = xlsx.utils.json_to_sheet(conteo);
      // libro = xlsx.utils.book_new();
      // xlsx.utils.book_append_sheet(libro, doc, nameAdrian);
      // xlsx.writeFile(libro, `./${nameAdrian}.xlsx`);
      // console.log(`[${nameAdrian}.xlsx] created.`);
      // let cols = await archivo.countDocuments({
      //   $and: [{ noPaquete: { $in: lista } }, { bis: false }],
      // });
      // console.log(cols);
      // process.exit();
      //     // await archivo.find({ folio: { $in: reporte800 } }).sort({ folio: 1 }).toArray(async(err, cols) => {
      //     // await archivo.find({ $or: [
      //     //     { FechaProcesado: { $regex: '26/12/2020' }},
      //     //     { FechaProcesado: { $regex: '29/12/2020' }}
      //     // ]}).sort({ Folio: 1, Tomo: 1 }).toArray(async(err, cols) => {
      //     // var folios = cols.map( el => {
      //     //     return { Folio: el.Folio, Tomo: el.Tomo, Toca: el.Toca,
      //     //         Concatenado: el.Tomo ? el.Folio + '-' + el.Tomo : el.Folio
      //     //     }
      //     // **************************************************************************************************************
      //     * ******************************** Para paquetes.
      // const archivo = res.db("registro").collection("paquetes");
      // console.log('Obteniendo archivos de', day);
      // await archivo
      //   .find({ fechaAlta: { $gte: new Date(day) } })
      //   .sort({ noPaquete: 1 })
      //   .toArray(async (err, cols) => {
      //     var paquetes = cols.map((el) => {
      //       console.log(
      //         el.fechaExpediente
      //           ? moment(el.fechaExpediente).format("L")
      //           : null,
      //         el.fechaExpediente
      //           ? moment(el.fechaExpediente.toISOString().slice(0, 10)).format(
      //               "DD/MM/YYYY"
      //             )
      //           : null,
      //         el.fechaExpediente
      //           ? el.fechaExpediente.toISOString().slice(0, 10)
      //           : null,
      //         el.noPaquete
      //       );
      //       return {
      //         Paquete: el.noPaquete,
      //         // Folio: el.folio,
      //         "Folio inicio": el.folioInicio,
      //         "Folio fin": el.folioFin,
      //         "Fecha expediente": el.fechaExpediente
      //           ? moment(el.fechaExpediente.toISOString().slice(0, 10)).format(
      //               "L"
      //             )
      //           : "Fecha inválida",
      //         // Expediente: el.Expediente,
      //         // Toca: el.Toca,
      //         // "Fecha de procesado": el.FechaProcesado ? el.FechaProcesado.slice(0,10) : 'Sin fecha'
      //       };
      //     });

      //     let doc, libro;
      //     doc = xlsx.utils.json_to_sheet(paquetes);
      //     libro = xlsx.utils.book_new();
      //     xlsx.utils.book_append_sheet(libro, doc, "Hoja 1");
      //     xlsx.writeFile(
      //       libro,
      //       `./registro${moment(day).format("DD.MM")}.xlsx`
      //     );
      //     console.log(`[registro${moment(day).format("DD.MM")}.xlsx] created.`);
      //   });
      //     // **************************************************************************************************************
      //     // Para folios.
      //     // var paquetes = cols.map((el) => {
      //     //     return {
      //     //         Paquete: el.noPaquete,
      //     //         // Folio: el.folio,
      //     //         "Folio": el.folio,
      //     //         "Tomo": el.tomo ? el.tomo : '',
      //     //             // Expediente: el.Expediente,
      //     //             // Toca: el.Toca,
      //     //             // "Fecha de procesado": el.FechaProcesado ? el.FechaProcesado.slice(0,10) : 'Sin fecha'
      //     //     };
      //     // });
      //     // let doc, libro;
      //     // doc = xlsx.utils.json_to_sheet(paquetes);
      //     // libro = xlsx.utils.book_new();
      //     // xlsx.utils.book_append_sheet(libro, doc, "Hoja 1");
      //     // xlsx.writeFile(libro, `./${name}.xlsx`);
      //     // console.log(`[${name}.csv] created.`)

      //     // total = await archivo.aggregate([
      //     //         // { $match: { FechaProcesado: {$regex: '06/01/2021'}, Error: false } },
      //     //         { $match: { Procesado: true, Error: true } },
      //     //         { $group: { _id: "", tot: { $sum: "$NumeroImagenes" } } }
      //     //     ]).toArray();

      //     //     paquetes.push({ Paquete: "Número total de imágenes:", "Número de imágenes": total[0].tot })
      //     //     console.log(total[0].tot, paquetes.length)

      //     // xlsx.writeFile(libro, `./paquetes${moment().subtract(1, 'days').format('DD-MM-YYYY')}.xlsx`);
      //     // xlsx.writeFile(libro, `./z${regex.slice(0, 2)}.csv`);
      //     // console.log(`[paquetes${moment().subtract(1, 'days').format('DD-MM-YYYY')}.xlsx] created.`)
      //     // console.log(`[z${regex.slice(0, 2)}.csv] created.`)
      // });

      // });
    }
  );
};
getPaquetes();

const actualizaPasado = async () => {
  try {
    await mongoose.connect(
      "mongodb://production:production$@172.26.60.61:27017/registro?authSource=admin",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        // useFindAndModify: false,
      }
    );
    // await mongoose.connect("mongodb://localhost:27017/registro", {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   useCreateIndex: true,
    //   // useFindAndModify: false,
    // });
    console.log("MongoDB connected...".magenta);

    const listaFolios = xlsx.readFile("./66carpetas.xlsx");
    let index = 0;
    let heads = listaFolios.SheetNames;
    let temp = xlsx.utils.sheet_to_json(listaFolios.Sheets[heads[0]], {
      skipHeader: true,
    });
    temp = temp.map((el) => {
      return {
        folio: el.Folio,
        tomo: el.Tomo || null,
      };
    });
    let tam = temp.length;
    console.time();
    for (el of temp) {
      // let con = await folios.findOne({ folio: el.Folio });
      // let noPaquete = con ? con.noPaquete : 'N/A';
      process.stdout.write(
        `${++index}/${tam}\t${el.folio}\t${el.tomo}`.italic.yellow
      );
      let m = await axios.get(
        "http://digitalizacion.pjcdmx.gob.mx/consulta_folio.php",
        {
          params: {
            f: el.folio,
          },
        }
      );
      if (m.data.encontrado) {
        let toUpdate = {
          expediente: m.data.expediente,
          juzgado: m.data.juzgado,
          instanciaJ: m.data.insJuz,
          instanciaS: m.data.insSal,
          dependencia: m.data.dependencia,
          toca: m.data.toca,
          actor: m.data.actor,
          demandado: m.data.demandado,
          juicio: m.data.juicio,
          sala: m.data.Sala,
          observaciones: null,
          validado: true,
        };
        let foliosFinded = await Folio.find({ folio: el.folio, tomo: el.tomo });
        if (foliosFinded.length == 0) {
          toUpdate.folio = el.folio;
          toUpdate.tomo = el.tomo;
          toUpdate.noPaquete = null;
          let folioCreated = await Folio.create(toUpdate);
          process.stdout.write("\tcreado.\n".green);
        } else {
          let folioUpdated = await Folio.updateOne(
            { folio: el.folio, tomo: el.tomo },
            toUpdate
          );
          process.stdout.write(`\tactualizado.\n`.magenta);
        }
        // console.log("Before".red, foliosFinded);
      } else process.stdout.write("\tNo se encontró\n".red);
      // el.Paquete = noPaquete;
      // console.log(el);
    }
    console.timeEnd();
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// actualizaPasado();
