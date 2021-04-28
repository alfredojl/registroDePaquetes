const xlsx = require("xlsx");
const Folio = require("../server/models/Folios");
const mongoose = require("mongoose");
const mariadb = require("mariadb");
const config = require("./procesoSICE/config");
const axios = require("axios");
const fs = require("fs");
const os = require("os");
const colors = require("colors");
const path = require("path");

const pool = mariadb.createPool({
  host: config.host,
  user: config.username,
  password: config.passwd,
  database: config.db,
});

mongoose.connect(
  "mongodb://production:production$@172.26.60.61:27017/registro?authSource=admin",
  // "mongodb://localhost:27017/registro",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    // useFindAndModify: false,
  },
  (err, res) => {
    if (err) throw err;
    console.log("Mongo connected...");
  }
);
const subida = async () => {
  let workbook = xlsx.readFile("./faltantesAlma.xlsx");
  let heads = workbook.SheetNames;
  // console.log(xlsx.utils.sheet_to_json(workbook.Sheets[heads[0]], { skipHeader: false }).slice(0, 5));
  let index = 0;
  let foliosUpdated = [],
    foliosCreated = [];
  let total = xlsx.utils.sheet_to_json(workbook.Sheets[heads[0]]).length;
  let errors = 0,
    validado = 0,
    procesado = 0,
    mayUno = 0,
    no = 0,
    bda = 0,
    sice = 0;
  let errores = [];
  try {
    fs.statSync(path.resolve("./report.csv"));
  } catch (error) {
    fs.appendFileSync(
      path.resolve("./report.csv"),
      `Paquete,Folio,Tomo,Imgs.,Acción,BD\n`,
      "utf8"
    );
  }
  for (el of xlsx.utils.sheet_to_json(workbook.Sheets[heads[0]])) {
    let f = {};
    let folio = el.PDF.split(".")[0];
    let tomo = null;
    let nh = el.Imgs;
    folio = folio.split("_");
    if (folio.length == 2) {
      folio = parseInt(folio);
    } else if (folio.length > 2) {
      tomo = folio[1];
      folio = parseInt(folio[0]);
    }
    console.log(
      {
        noPaquete: el.Paquete || null,
        folio,
        tomo,
        numeroImagenes: nh,
      },
      `${++index} de ${total}`.magenta
    );

    var encontrado = await Folio.find({
      folio,
      tomo,
      noPaquete: el.Paquete || null,
    });
    if (!encontrado) {
      throw new Error('"encontrado" vacío...'.red);
    } else if (encontrado.length == 0) {
      console.log("*******************Creando***********************".bgGreen);
      no++;
      const m = await maria(folio, tomo, nh);
      if (m.encontrado) {
        console.log("BDA: ", m);
        bda++;
        f.folio = folio;
        f.expediente = m.expediente;
        f.noPaquete = el.Paquete || null;
        f.tomo = tomo;
        f.juzgado = m.juzgado;
        f.instanciaJ = m.insJuz;
        f.instanciaS = m.insSal;
        f.dependencia = m.dependencia;
        f.toca = m.toca;
        f.actor = m.actor;
        f.demandado = m.demandado;
        f.juicio = m.juicio;
        f.sala = m.Sala;
        f.observaciones = null;
        f.validado = true;
      } else {
        console.log("SICE: ", m);
        sice++;
        f.Id = m.Id;
        f.procesado = m.Fecha;
        f.folio = folio;
        f.expediente = m.C23;
        f.noPaquete = m.C24;
        f.tomo = tomo;
        f.juzgado = m.C26;
        f.instanciaJ = m.C27;
        f.instanciaS = m.C28;
        f.toca = m.C29;
        f.actor = m.C30;
        f.demandado = m.C31;
        f.juicio = m.C32;
        f.sala = m.C110;
        f.observaciones = m.C241;
        f.numeroImagenes = m.C11242;
      }
      await Folio.create(f, (err, folioCreated) => {
        if (err) throw new Error(err);
        console.log("¡Creado!".brightCyan);
        foliosCreated.push(folioCreated);
        fs.appendFileSync(
          path.resolve("./report.csv"),
          `${el.Paquete || f.noPaquete || null},${folio},${tomo},${
            el.Imgs
          },created\n`,
          "utf8"
        );
      });
    } else if (encontrado.length == 1) {
      if (encontrado[0].procesado) {
        fs.appendFileSync(
          path.resolve("./report.csv"),
          `${el.Paquete || f.noPaquete || null},${folio},${tomo},${
            el.Imgs
          },finded,procesado\n`,
          "utf8"
        );
        procesado++;
      } else if (encontrado[0].dependencia) {
        fs.appendFileSync(
          path.resolve("./report.csv"),
          `${el.Paquete || f.noPaquete || null},${folio},${tomo},${
            el.Imgs
          },finded,validado\n`,
          "utf8"
        );
        validado++;
      } else {
        await Folio.updateOne(
          { folio, tomo, noPaquete: el.Paquete },
          f,
          (err, folioUpdated) => {
            if (err) throw new Error(err);
            console.log("¡Actualizado!".brightCyan);
            foliosUpdated.push(folioUpdated);
            fs.appendFileSync(
              path.resolve("./report.csv"),
              `${el.Paquete || f.noPaquete || null},${folio},${tomo},${
                el.Imgs
              },updated\n`,
              "utf8"
            );
          }
        );
      }
      //     console.log('Validado')
    } else {
      mayUno++;
      console.log(`Folio ${folio} has ${encontrado.length} length.`.magenta);
      fs.appendFileSync(
        path.resolve("./report.csv"),
        `${el.Paquete || f.noPaquete || null},${folio},${tomo},${
          el.Imgs
        },duplicated\n`,
        "utf8"
      );
    }
  }
  console.log(
    "Folios actualizados: ".brightCyan,
    colors.magenta(foliosUpdated)
  );
  console.log("Folios creados: ".brightCyan, colors.magenta(foliosCreated));
  console.log(
    "Errores: ",
    errors,
    "\tNo: ",
    no,
    "\tMayUno: ",
    mayUno,
    "\tValidado: ",
    validado
  );
  console.log("Procesado: ", procesado, "\tBDA: ", bda, "\tSICE: ", sice);
  // process.exit();
};

const maria = async (f, t, nh) => {
  let conn = await pool.getConnection((err, connection) => {
    if (err) console.log(err);
  });
  let a = await conn.query(
    `SELECT * FROM T15 WHERE C22 = ${f} AND C25 ${
      t ? "= " + t : "IS NULL"
    } AND C11242 = ${nh}`
  );
  let b = {};
  if (a.length > 0) {
    conn.release();
    // console.log(a[0]);
    return a[0];
    // let folio = {};
    // folio.folio = a.C22;
  } else {
    conn.release();
    await axios
      .get("http://digitalizacion.pjcdmx.gob.mx/consulta_folio.php", {
        params: { f },
      })
      .then((res) => {
        b = res.data;
        // return
      })
      .catch((e) => {
        console.log("Error in axios.".red);
      });
  }
  return b;
};

const crea = async (folio, tomo, el) => {
  let f = {};
  let m = await maria(folio, tomo);
  f.bis = false;
  f.estado = "Completo";
  f.validado = true;
  if (m.encontrado) {
    console.log(
      "*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*="
    );
    f.folio = folio;
    f.expediente = m.expediente;
    f.noPaquete = el.Paquete || null;
    f.tomo = tomo;
    f.juzgado = m.juzgado;
    f.instanciaJ = m.insJuz;
    f.instanciaS = m.insSal;
    f.dependencia = m.dependencia;
    f.toca = m.toca;
    f.actor = m.actor;
    f.demandado = m.demandado;
    f.juicio = m.juicio;
    f.sala = m.Sala;
    f.observaciones = null;
  } else {
    f.Id = m.Id;
    f.procesado = m.Fecha;
    f.folio = folio;
    f.expediente = m.C23;
    f.noPaquete = m.C24;
    f.tomo = tomo;
    f.juzgado = m.C26;
    f.instanciaJ = m.C27;
    f.instanciaS = m.C28;
    f.toca = m.C29;
    f.actor = m.C30;
    f.demandado = m.C31;
    f.juicio = m.C32;
    f.sala = m.C110;
    f.observaciones = m.C241;
    f.numeroImagenes = m.C11242;
  }
  let temp = await Folio.create(
    { folio, tomo, noPaquete: el.Paquete || null },
    f,
    (err, doc) => {
      if (err) fs.appendFileSync(path.resolve("./LOG.txt"), `error\n`, "utf8");
      console.log(doc);
      fs.appendFileSync(path.resolve("./LOG.txt"), `created\n`, "utf8");
      if (m.encontrado)
        fs.appendFileSync(
          path.resolve("./report.csv"),
          `${el.Paquete || null},${folio},${tomo},${el.Imgs},updated,BDA\n`,
          "utf8"
        );
      else
        fs.appendFileSync(
          path.resolve("./report.csv"),
          `${el.Paquete || null},${folio},${tomo},${el.Imgs},updated,SICE\n`,
          "utf8"
        );
      return doc;
    }
  );
  return f;
};

subida();
