const xlsx = require('xlsx');
const Folio = require('../server/models/Folios');
const mongoose = require('mongoose');
const mariadb = require('mariadb');
const config = require('./procesoSICE/config');
const axios = require('axios');
const fs = require('fs');
const os = require('os');
const colors = require('colors');
const path = require('path');

const pool = mariadb.createPool({
    host: config.host,
    user: config.username,
    password: config.passwd,
    database: config.db
});

mongoose.connect(
    'mongodb://production:production$@172.26.60.61:27017/registro?authSource=admin', {
        // 'mongodb://localhost:27017/registro', {
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
    let workbook = xlsx.readFile('./lista.xlsx');
    let heads = workbook.SheetNames;
    // console.log(xlsx.utils.sheet_to_json(workbook.Sheets[heads[0]], { skipHeader: false }).slice(0, 5));
    let index = 0;
    let errores = [];
    fs.appendFileSync(path.resolve('./report.csv'), `Paquete,Folio,Tomo,Imgs.,Acción,BD\n`, 'utf8')
    for await (el of xlsx.utils.sheet_to_json(workbook.Sheets[heads[0]])) {
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
            noPaquete: el.Paquete || null,
            folio,
            tomo,
            numeroImagenes: el.Imgs
        }, index + ' de ' + xlsx.utils.sheet_to_json(workbook.Sheets[heads[0]]).length);

        //=====================================================================================================================
        let m = await maria(folio, tomo);
        f.bis = false;
        f.estado = "Completo";
        f.validado = true;
        if (m.encontrado) {
            console.log('*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=');
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
        await Folio.create(f, (err, doc) => {
                if (err) {
                    console.log(err);
                    fs.appendFileSync(path.resolve('./LOG.txt'), `error\n`, 'utf8')
                }
                fs.appendFileSync(path.resolve('./LOG.txt'), `created\n`, 'utf8')
                if (m.encontrado)
                    fs.appendFileSync(path.resolve('./report.csv'), `${el.Paquete || f.noPaquete || null},${folio},${tomo},${el.Imgs},updated,BDA\n`, 'utf8')
                else
                    fs.appendFileSync(path.resolve('./report.csv'), `${el.Paquete || f.noPaquete || null},${folio},${tomo},${el.Imgs},updated,SICE\n`, 'utf8')
                return doc;
            })
            //=====================================================================================================================

        // let temp = await Folio.find({ folio, tomo, noPaquete: el.Paquete || null }, async(err, folioFind) => {
        //         if (err) errores.push(err);
        //         // console.log(`${folioFind}`.magenta);
        //         if (folioFind.length < 1) {
        //             console.log(folioFind.length);
        //             f = await crea(folio, tomo, el)
        //         } else if ((folioFind.length == 1)) {
        //             if (!folioFind[0].validado) {
        //                 f = await crea(folio, tomo, el)
        //             } else {
        //                 fs.appendFileSync(path.resolve('./LOG.txt'), `finded\n`, 'utf8')
        //                 fs.appendFileSync(path.resolve('./report.csv'), `${el.Paquete || null},${folio},${tomo},${el.Imgs},exists\n`, 'utf8')
        //             }
        //         } else {
        //             fs.appendFileSync(path.resolve('./LOG.txt'), `finded\n`, 'utf8')
        //             fs.appendFileSync(path.resolve('./report.csv'), `${el.Paquete || null},${folio},${tomo},${el.Imgs},dup\n`, 'utf8')
        //         }
        //         fs.appendFileSync(path.resolve('./LOG.txt'), `${JSON.stringify(f)}\n\n`, 'utf8')
        //     })
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
    }
    // process.exit();
}

const maria = async(f, t) => {
    let conn = await pool.getConnection((err, connection) => { if (err) console.log(err) });
    let a = await conn.query(`SELECT * FROM T15 WHERE C22 = ${f} AND C25 ${t ? '= ' + t : 'IS NULL'}`)
    let b = {};
    if (a.length > 0) {
        conn.release();
        // console.log(a[0]);
        return a[0];
        // let folio = {};
        // folio.folio = a.C22;
    } else {
        conn.release();
        await axios.get('http://digitalizacion.pjcdmx.gob.mx/consulta_folio.php', {
                params: { f }
            })
            .then(res => {
                console.log(res.data, f);
                b = res.data;
                // return
            })
            .catch(e => {
                console.log('Error in axios.');
            })
    }
    return b;
}

const crea = async(folio, tomo, el) => {
    let f = {};
    let m = await maria(folio, tomo);
    f.bis = false;
    f.estado = "Completo";
    f.validado = true;
    if (m.encontrado) {
        console.log('*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=');
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
    let temp = await Folio.create({ folio, tomo, noPaquete: el.Paquete || null }, f, (err, doc) => {
        if (err)
            fs.appendFileSync(path.resolve('./LOG.txt'), `error\n`, 'utf8')
        console.log(doc);
        fs.appendFileSync(path.resolve('./LOG.txt'), `created\n`, 'utf8')
        if (m.encontrado)
            fs.appendFileSync(path.resolve('./report.csv'), `${el.Paquete || null},${folio},${tomo},${el.Imgs},updated,BDA\n`, 'utf8')
        else
            fs.appendFileSync(path.resolve('./report.csv'), `${el.Paquete || null},${folio},${tomo},${el.Imgs},updated,SICE\n`, 'utf8')
        return doc;
    })
    return f;
}

subida()