const path = require("path");
const fs = require("fs");
const os = require("os");
const mongoose = require("mongoose");
const axios = require("axios");
const Folio = require("../server/models/Folios");

const getList = async () => {
  try {
    let res = await mongoose.connect(
      // "mongodb://production:production$@172.26.60.61:27017/registro?authSource=admin",
      "mongodb://localhost:27017/registro",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }
    );
    console.log("Mongo connected...");
    let ruta = path.join(os.homedir(), "Documents", "aSubir");
    let folio = null,
      tomo = null,
      direc = null,
      base = null,
      sep = null,
      nh = null;
    // console.log(path.join(os.homedir(), 'SICE', 'nuevoRoot', 'alma'))
    let dirs = fs.readdirSync(ruta);
    dirs = dirs.filter((el) => path.parse(path.join(ruta, el)).ext == ".pdf");
    for (file of dirs) {
      folio = null;
      tomo = null;
      sep = null;
      nh = null;
      sep = path.parse(path.join(ruta, file)).name.split("_");
      folio = sep[0];
      if (sep.length === 3) {
        tomo = sep[1];
        nh = sep[2];
      } else {
        nh = sep[1];
      }
      console.log(folio, tomo, nh);
      let f = await Folio.find({ folio, tomo });
      if (f.length == 0) {
        console.log("*******************Creando***********************");
        let m = await axios.get(
          "http://digitalizacion.pjcdmx.gob.mx/consulta_folio.php",
          {
            params: {
              f: folio,
            },
          }
        );
        m = m.data;
        if (m.encontrado) {
          let toCreate = {
            folio,
            tomo,
            numeroImagenes: nh,
            expediente: m.expediente,
            noPaquete: null,
            juzgado: m.juzgado,
            instanciaJ: m.insJuz,
            instanciaS: m.insSal,
            dependencia: m.dependencia,
            toca: m.toca,
            actor: m.actor,
            demandado: m.demandado,
            juicio: m.juicio,
            sala: m.Sala,
            observaciones: null,
            validado: true,
          };
          let folioCreated = await Folio.create(toCreate);
          fs.appendFileSync(
            path.resolve("foliosASubir.csv"),
            `${folio},${tomo},${nh},created\n`,
            "utf-8"
          );
        } else {
          fs.appendFileSync(
            path.resolve("foliosASubir.csv"),
            `${folio},${tomo},${nh},notFinded\n`,
            "utf-8"
          );
        }
      } else {
        if (f[0].procesado)
          fs.appendFileSync(
            path.resolve("foliosASubir.csv"),
            `${folio},${tomo},${nh},procesado\n`,
            "utf-8"
          );
        else if (f[0].validado) {
          let folioUpdated = await Folio.updateOne(
            { folio, tomo },
            { numeroImagenes: nh }
          );
          fs.appendFileSync(
            path.resolve("foliosASubir.csv"),
            `${folio},${tomo},${nh},validado\n`,
            "utf-8"
          );
        } else {
          console.log("*******************Actualizando***********************");
          let m = await axios.get(
            "http://digitalizacion.pjcdmx.gob.mx/consulta_folio.php",
            {
              params: {
                f: folio,
              },
            }
          );
          m = m.data;
          if (m.encontrado) {
            let toUpdate = {
              folio,
              tomo,
              numeroImagenes: nh,
              expediente: m.expediente,
              noPaquete: null,
              juzgado: m.juzgado,
              instanciaJ: m.insJuz,
              instanciaS: m.insSal,
              dependencia: m.dependencia,
              toca: m.toca,
              actor: m.actor,
              demandado: m.demandado,
              juicio: m.juicio,
              sala: m.Sala,
              observaciones: null,
              validado: true,
            };
            // let folioCreated = await Folio.create(toCreate);
            // fs.appendFileSync(path.resolve('foliosASubir.csv'), `${folio},${tomo},${nh},created\n`, 'utf-8')
            // console.log(folioCreated);
            let folioUpdated = await Folio.updateOne({ folio, tomo }, toUpdate);
            fs.appendFileSync(
              path.resolve("foliosASubir.csv"),
              `${folio},${tomo},${nh},updated\n`,
              "utf-8"
            );
          } else {
            fs.appendFileSync(
              path.resolve("foliosASubir.csv"),
              `${folio},${tomo},${nh},notUpdated\n`,
              "utf-8"
            );
          }
        }
      }
    }
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

getList();
