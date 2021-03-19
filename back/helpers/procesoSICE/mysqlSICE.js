const sftp = require('./SFTP');
const fs = require('fs');
const path = require('path');
const os = require('os');
const mariadb = require('mariadb');
const config = require('./config');
const pool = mariadb.createPool({
    host: config.host,
    user: config.username,
    password: config.passwd,
    database: config.db
});
const moment = require('moment');
const colors = require('colors');
const symbols = require('log-symbols');

moment.locale('es-mx');

const maria = async(f, folio) => {
    console.log(symbols.info, `Creando registro en SICE de folio ${f.C22}${f.C25 ? ' Tomo ' + f.C25 : ''}...`.cyan);
    let conn = await pool.getConnection((err, connection) => { if (err) console.log(err) });
    let values = [];
    Object.keys(f).forEach(el => {
        values.push(f[el]);
    })
    let a = await conn.query(`SELECT C22 FROM T15 WHERE C22 = ${f.C22} AND C25 ${f.C25 ? '= ' + f.C25 : 'IS NULL'}`)
    if (a.length > 0) {
        console.log(symbols.warning, 'Registro duplicado. Realizando acciones necesarias...'.bgYellow);
        fs.renameSync(folio.path, path.resolve(os.homedir(), 'SICE/Duplicados', folio.archivo));
        fs.appendFileSync(path.resolve(os.homedir(), 'LOG.txt'), `${folio.folio} ${folio.tomo ? 'Tomo ' + folio.tomo : ''} duplicado y movido a la carpeta de 'Duplicados'.\t\t [${moment().format('ddd, D MMM Y, HH:mm:ss')}]\n`, 'utf8')
        conn.release();
    } else
        await conn.query(`INSERT INTO T15 
            (Id,
            Hash,
            Raiz,
            dupli,
            Confi,
            Usuario,
            Fecha,
            WaterMark,
            C22,
            C23,
            C24,
            C25,
            C26,
            C27,
            C28,
            C29,
            C30,
            C31,
            C32,
            C33,
            C110,
            C164,
            C241,
            C11242) VALUES (?)`, [values])
        .then(async(result) => {
            console.log(symbols.success, 'Registro en SICE creado correctamente.'.green);
            fs.appendFileSync(path.resolve(os.homedir(), 'LOG.txt'), `${folio.folio} ${folio.tomo ? 'Tomo ' + folio.tomo : ''} registrado en SICE.`, 'utf8')
            await sftp(folio);
            conn.release();
        }).catch((err) => {
            conn.release();
            fs.appendFileSync(path.resolve(os.homedir(), 'LOG.txt'), `${folio.folio} ${folio.tomo ? 'Tomo ' + folio.tomo : ''} no se registró correctamente en SICE.\t [${moment().format('ddd, D MMM Y, HH:mm:ss')}]`, 'utf8')
            console.log('¡Error!', err);
            return false;
        });
}

module.exports = maria;