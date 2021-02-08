const mariadb = require('mariadb');
const config = require('./config');
// const pool = mariadb.createPool({
//     host: config.host,
//     user: config.username,
//     password: config.passwd,
//     database: config.db
// });
const md5 = require('md5');
const moment = require('moment');

const renombra = async(folio) => {
    // let conn = await pool.getConnection();
    // // let Id = await conn.query("SELECT MAX(Id) Id FROM T15");
    // conn.release();
    // Id = Id[0].Id + 1;
    console.log(`${config.pathUpload + folio.archivo}`);
    console.log(typeof folio);
    const Hash = md5(`${config.pathUpload + folio.archivo}`);
    const fecha = moment().format('YYYY-MM-DD HH:mm:ss');
    let f = {};
    // f.Id = Id;
    f.Hash = Hash.toString();
    f.Raiz = config.root;
    f.dupli = 0;
    f.Confi = 0;
    f.Usuario = config.user;
    f.Fecha = fecha;
    f.WaterMark = 0;
    f.C22 = folio.folio;
    f.C23 = folio.expediente;
    f.C24 = folio.noPaquete;
    f.C25 = folio.tomo;
    f.C26 = folio.juzgado;
    f.C27 = folio.instanciaJ;
    f.C28 = folio.instanciaS;
    f.C29 = folio.toca;
    f.C30 = folio.actor;
    f.C31 = folio.demandado;
    f.C32 = folio.juicio;
    f.C33 = null;
    f.C110 = folio.sala;
    f.C164 = 1;
    f.C241 = folio.observaciones;
    f.C11242 = folio.im;
    // folio = folio.toJSON();
    folio.Id = 5566;
    folio.fechaSubidoSICE = fecha;
    // folio = JSON.stringify(folio);
    // folio = JSON.parse(folio);
    console.log(f);
}

const sube = async() => {

}

const exec = async(folios) => {
    for (folio of folios) {
        await renombra(folio);
    }
    console.log('fin');
}

module.exports = exec;