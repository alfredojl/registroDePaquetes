const mongoose = require("mongoose");
const moment = require("moment");
const Folio = require("../server/models/Folios");
const Paquete = require("../server/models/Paquetes");
const xlsx = require("xlsx");

const inserta = async () => {
  try {
    let bd = await mongoose.connect(
      "mongodb://production:production$@172.26.60.61:27017/registro?authSource=admin",
      // "mongodb://localhost:27017/registro",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }
    );
    console.log("Mongo connected...");
    let workbook = xlsx.readFile("./r26.xlsx");
    let heads = workbook.SheetNames;
    let temp = xlsx.utils.sheet_to_json(workbook.Sheets[heads[0]], {
      skipHeader: false,
    });
    // * * * * * * * * * Empieza inserta * * * * * * * * *
    var paquetes = [],
      errores = [],
      paquetesDB = [],
      foliosDB = [];
    temp.forEach((el, index) => {
      let paquete = null,
        bis = null,
        folioInicio = null,
        folioFin = null,
        cantidad = null,
        identificador = null,
        fecha = null;
      if (typeof el.Paquete === "number") {
        paquete = el.Paquete;
        bis = false;
      } else {
        let partes = el.Paquete.split(" ");
        paquete = partes[0];
        if (partes.length > 2 && partes[1].toLowerCase() == "bis") {
          bis = true;
          cantidad = el.Paquete.split(" ")[2].split("/")[1];
          identificador = el.Paquete.split(" ")[2].split("/")[0];
        } else if (partes.length == 2 && partes[1].toLowerCase() == "bis") {
          bis = true;
        } else if (partes.length == 2) {
          bis = false;
          cantidad = el.Paquete.split(" ")[1].split("/")[1];
          identificador = el.Paquete.split(" ")[1].split("/")[0];
        }
      }
      // console.log({
      //   paquete,
      //   bis,
      //   cantidad,
      //   identificador,
      //   fecha:
      //     el.YYYY != "S/F"
      //       ? moment(`${el.YYYY}-${el.MM}-${el.DD}`).format()
      //       : null,
      //   format: `${el.YYYY}-${el.MM}-${el.DD}`,
      // });
      paquetes.push({
        noPaquete: paquete,
        bis,
        estado: "Recibido",
        local: false,
        identificador,
        cantidad,
        folioInicio: el.FolioInicio,
        folioFin: el.FolioFin,
        fechaExpediente:
          el.YYYY != "S/F"
            ? moment(`${el.YYYY}-${el.MM}-${el.DD}`).format()
            : null,
        fechaAlta: new Date(),
        registrado: "04Mayo",
      });
    });
    let index = 0;
    let indexFolios = 0;
    for (body of paquetes) {
      try {
        console.log(++index + " de " + paquetes.length);
        let folios = [];
        let folio = [];
        let paqueteDB = await Paquete.create(body);
        paquetesDB.push(paqueteDB);
        console.log(paqueteDB);
        for (
          let i = paqueteDB.folioInicio;
          i <= paqueteDB.folioFin;
          i++, ++indexFolios
        ) {
          folio = {
            folio: i,
            noPaquete: body.noPaquete,
            bis: body.bis,
          };
          folios.push(folio);
          // console.log(folio);
          // let folioDB = await Folio.create(folio);
          // foliosDB.push(folioDB);
          // console.log(folioDB);
        }
        foliosDB.push(await Folio.insertMany(folios));
      } catch (err) {
        errores.push(err);
      }
    }
    console.log(paquetes.length, errores.length, foliosDB.length, indexFolios);
    // * * * * * * * * * * * * * Hasta aquí * * * * * * * * *

    // console.log(element);
    //   await Paquete.create(element)
    //   .then(paqueteDB => {
    //     console.log('¡Hecho! Paquete.');
    //     paquetesDB.push(paqueteDB);
    //     for (let i = element.folioInicio; i <= element.folioFin; i++)
    //       await Folio.create({
    //           folio: paqueteDB.folioInicio,
    //           noPaquete: paqueteDB.noPaquete
    //       }, async(err, folioDB) => {
    //           if (err) errores.push(err)
    //           console.log('¡Hecho! Folio.');
    //           foliosDB.push(folioDB);
    //           console.log(folioDB);
    //       })
    //         .then((folioDB) => {

    //       })
    //     })
    //     .catch(err => {
    //       errores.push(err)
    //     });
  } catch (err) {
    console.log(err);
  }
};

inserta();
