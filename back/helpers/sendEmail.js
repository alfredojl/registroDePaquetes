const MongoClient = require("mongodb").MongoClient,
assert = require("assert");
const xlsx = require("xlsx");
const cron = require("node-cron");
const config = require("./procesoSICE/config");
const mariadb = require("mariadb");
const pool = mariadb.createPool({
    host: config.host,
    user: config.username,
    password: config.passwd,
    database: config.db,
});

const send = require("gmail-send")({
  user: "alfredo.jl323@gmail.com",
  pass: "Everybody56."
});
const colors = require("colors");
const moment = require("moment");
moment.locale("es-mx");

// const yesterdayF = "2021-05-16 00:00:00";
// const yesterdayL = "2021-05-16 23:59:59";
const yesterdayL = moment()
  .subtract(1, "days")
  .hours(23)
  .minutes(59)
  .seconds(59)
  .format("YYYY-MM-DD HH:mm:ss");
const yesterdayF = moment()
  .subtract(1, "days")
  .hours(0)
  .minutes(0)
  .seconds(0)
  .format("YYYY-MM-DD HH:mm:ss");

  console.log(yesterdayF, yesterdayL);

const getPaquetes = async () => {
  const user = "lupita.cruz@tsjcdmx.gob.mx";
  // const user = "jose.jimenez@developmentsh.com";
    const copies = [
        // '312047278@pcpuma.acatlan.unam.mx',        
        // 'dulcelizeth1509@gmail.com',
        // 'francisco.lopez@developmentsh.com'
        "jose.jimenez@developmentsh.com",
        "cristian.camilo@developmentsh.com",
        "nahin.delfin@gonet.us",
        "karen.pineda@developmentsh.com",
    ];
  try {
    let conn = await pool.getConnection();
    console.log("Mariadb connected...".green);
    let foliosRecorded = await conn.query(
      `SELECT C24 Paquete, C22 Folio, C25 Tomo, C23 Expediente, C29 Toca, C11242 'Imágenes' FROM T15 WHERE Fecha BETWEEN '${yesterdayF}' AND '${yesterdayL}' AND Usuario = "DEVELOPMENT S&H" ORDER BY C22, C25;`
    );
    let suma = await conn.query(
      `SELECT SUM(C11242) suma FROM T15 WHERE Fecha BETWEEN '${yesterdayF}' AND '${yesterdayL}' AND Usuario = "DEVELOPMENT S&H";`
    );

    suma = suma[0].suma || 0;
    console.log(suma);
    if (suma == 0) {
      console.log('Email not sended.');
    }
    else {
      foliosRecorded.push({ Paquete: "Total", Imágenes: suma });
  
      let doc, libro;
      doc = xlsx.utils.json_to_sheet(foliosRecorded);
      libro = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(libro, doc, "");
      xlsx.writeFile(
        libro,
        `./paquetes${moment(yesterdayF).format("DD-MM")}.xlsx`
      );
      console.log(
        `[paquetes${moment(yesterdayF).format("DD-MM")}.xlsx] created.`.cyan
      );
  
      let resultado = await send({
          to: user,
          bcc: copies,
          subject: `Reporte de folios subidos a SICE ${moment(yesterdayF).format(
              "L"
            )}.`,
            text: `Buenos días.
Adjunto archivo excel de folios subidos el día ${moment(yesterdayF).format(
            "LL"
          )}.
Saludos.`,
        files: [`./paquetes${moment(yesterdayF).format("DD-MM")}.xlsx`],
      });
  
      console.log(`Email to '${user}' with copy to '${copies.join(", ")}' sent succesfully.`.green);
    }
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

getPaquetes();
