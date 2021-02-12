const mariadb = require('mariadb');
const config = require('./config');
const pool = mariadb.createPool({
    host: config.host,
    user: config.username,
    password: config.passwd,
    database: config.db
});
const md5 = require('md5');
const moment = require('moment');
const maria = require('./mysqlSICE');

const renombra = async(folio) => {
    let conn = await pool.getConnection();
    let Id = await conn.query("SELECT MAX(Id) Id FROM T15");
    conn.release();
    Id = Id[0].Id + 1;
    const Hash = md5(`${config.pathUpload + folio.archivo}`);
    const fecha = moment().format('YYYY-MM-DD HH:mm:ss');
    let f = {};
    f.Id = Id;
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
    f.C26 = folio.juzgado || null;
    f.C27 = folio.instanciaJ || null;
    f.C28 = folio.instanciaS || null;
    f.C29 = folio.toca || null;
    f.C30 = folio.actor || null;
    f.C31 = folio.demandado || null;
    f.C32 = folio.juicio || null;
    f.C33 = null;
    f.C110 = folio.sala || null;
    f.C164 = 1;
    f.C241 = folio.observaciones || null;
    f.C11242 = folio.numeroImagenes;
    folio.Id = Id;
    folio.fechaSubidoSICE = fecha;
    f = JSON.stringify(f);
    f = JSON.parse(f);
    return sube(f, folio)
}

const sube = async(f, folio) => {
    await maria(f, folio);
    return;
}

const exec = async(folios) => {
    for (folio of folios) {
        await renombra(folio);
    }
    return;
}

module.exports = exec;