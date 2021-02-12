const sftp = require('./SFTP');
const fs = require('fs');
const mariadb = require('mariadb');
const config = require('./config');
const pool = mariadb.createPool({
    host: config.host,
    user: config.username,
    password: config.passwd,
    database: config.db
});
const colors = require('colors');
const symbols = require('log-symbols');

const maria = async(f, folio) => {
    console.log(symbols.info, 'Creando registro en SICE...'.cyan);
    let conn = await pool.getConnection();
    let values = [];
    Object.keys(f).forEach(el => {
        values.push(f[el]);
    })
    let a = await conn.query(`SELECT C22 FROM T15 WHERE C22 = ${f.C22} AND C25 ${f.C25 ? '= ' + f.C25 : 'IS NULL'}`)
    if (a.length > 0) {
        console.log(symbols.warning, 'Registro duplicado. Realizando acciones necesarias...'.bgYellow);
        fs.renameSync(folio.path, '/home/alima/Desktop/SFTPSimulado/Duplicados/' + folio.archivo);
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
            await sftp(folio);
        }).catch((err) => {
            console.log('¡Error!', err);
        });
    conn.release();
    return;
}

module.exports = maria;