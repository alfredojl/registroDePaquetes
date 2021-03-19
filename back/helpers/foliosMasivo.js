const xlsx = require('xlsx');
const Folio = require('../server/models/Folios');
const mongoose = require('mongoose');
const mariadb = require('mariadb');
const config = require('./procesoSICE/config');
const axios = require('axios');
const fs = require('fs');
const os = require('os');
const path = require('path');

const pool = mariadb.createPool({
    host: config.host,
    user: config.username,
    password: config.passwd,
    database: config.db
});

mongoose.connect(
    // 'mongodb://production:production$@172.26.60.61:27017/registro?authSource=admin', {
    'mongodb://localhost:27017/registro', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
    },
    (err, res) => {
        if (err) throw err;
        console.log("Mongo connected...");
    }
);

// Folio.find({}, (err, folioDB) => {
//     fs.appendFileSync(path.resolve('./reportBD.csv'), `Paquete,Folio,Tomo,Imgs.\n`, 'utf8')
//     folioDB.forEach(el => {
//         fs.appendFileSync(path.resolve('./reportBD.csv'), `${el.noPaquete},${el.folio},${el.tomo},${el.numeroImagenes}\n`, 'utf8')
//         console.log('¡Done!');
//     })
// })

const subida = async() => {
    let workbook = xlsx.readFile('./lote1-7.xlsx');
    let heads = workbook.SheetNames;
    console.log(xlsx.utils.sheet_to_json(workbook.Sheets[heads[0]], { skipHeader: false }).slice(0, 5));
    let index = 0;
    let errores = [];
    fs.appendFileSync(path.resolve('./report.csv'), `Paquete,Folio,Tomo,Imgs.,Acción,BD\n`, 'utf8')
    for (el of xlsx.utils.sheet_to_json(workbook.Sheets[heads[0]])) {
        let f = {};
        let folio = el.PDF.split('.')[0];
        let tomo = null;
        folio = folio.split('_');
        if (folio.length == 1) {
            folio = parseInt(folio);
        } else if (folio.length > 1) {
            tomo = folio[1]
            folio = parseInt(folio[0])
        }
        console.log({
            noPaquete: el.Paquete,
            folio,
            tomo,
            numeroImagenes: el.Imgs
        }, index);
        await Folio.find({ folio, tomo, noPaquete: el.Paquete }, async(err, folioFind) => {
                if (err) errores.push(err);
                if (folioFind.length < 1 || !folioFind.validado) {
                    let m = await maria(folio, tomo);
                    f.bis = false;
                    f.estado = "Completo";
                    f.validado = true;
                    if (m.encontrado) {
                        console.log('*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=');
                        f.folio = folio;
                        f.expediente = m.expediente;
                        f.noPaquete = el.Paquete;
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
                    await Folio.create(f, (err, doc) => {
                        fs.appendFileSync(path.resolve('./LOG.txt'), `created\n`, 'utf8')
                        if (m.encontrado)
                            fs.appendFileSync(path.resolve('./report.csv'), `${el.Paquete},${folio},${tomo},${el.Imgs},created,BDA\n`, 'utf8')
                        else
                            fs.appendFileSync(path.resolve('./report.csv'), `${el.Paquete},${folio},${tomo},${el.Imgs},created,SICE\n`, 'utf8')
                    })
                } else {
                    fs.appendFileSync(path.resolve('./LOG.txt'), `finded\n`, 'utf8')
                    fs.appendFileSync(path.resolve('./report.csv'), `${el.Paquete},${folio},${tomo},${el.Imgs},exists\n`, 'utf8')
                }
            })
            // console.log(f);
            // console.log(path.resolve('./LOG.txt'));
        index++;
        // await Folio.find({ folio, tomo, noPaquete: el.Paquete }, (err, folioDB) => {
        //     if (err) {
        //         fs.appendFileSync(path.resolve('./LOG.txt'), `error\n`, 'utf8')
        //         fs.appendFileSync(path.resolve('./report.csv'), `${el.Paquete},${folio},${tomo},${el.Imgs},error\n`, 'utf8')
        //     }
        //     if (folioDB.length > 0) {} else

        // })
        fs.appendFileSync(path.resolve('./LOG.txt'), `${JSON.stringify(f)}\n\n`, 'utf8')
    }
    process.exit();
}

const maria = async(f, t) => {
    let conn = await pool.getConnection((err, connection) => { if (err) console.log(err) });
    let a = await conn.query(`SELECT * FROM T15 WHERE C22 = ${f} AND C25 ${t ? '= ' + t : 'IS NULL'}`)
    let b = {};
    if (a.length > 0) {
        // console.log(a[0]);
        conn.release();
        return a[0];
        // let folio = {};
        // folio.folio = a.C22;
    } else {
        conn.release();
        await axios.get('http://digitalizacion.pjcdmx.gob.mx/consulta_folio.php', {
                params: { f }
            })
            .then(res => {
                // console.log(res.data);
                b = res.data;
                return
            })
            .catch(e => {
                console.log('Error in axios.');
            })
    }
    return b;
}

subida()