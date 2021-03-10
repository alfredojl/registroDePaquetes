const express = require('express');
const app = express();

const MongoClient = require("mongodb").MongoClient;
const Folio = require('../models/Folios');
const Paquete = require('../models/Paquetes');
const mariadb = require('mariadb');

const config = require('../../helpers/procesoSICE/config');
const pool = mariadb.createPool({
    host: config.host,
    user: config.username,
    password: config.passwd,
    database: config.db
});

app.get('/busquedaSICE', async(req, res) => {
    let folioInicio = parseInt(req.query.folioInicio);
    let folioFin = parseInt(req.query.folioFin);


    let conn = await pool.getConnection();
    // let intervalo = 
    const folios = await conn.query(`SELECT C22 Folio FROM T15 WHERE C22 >= ${folioInicio} AND C22 <= ${folioFin}`);
    // console.log(intervalo);
    conn.end();
    return res.json({
        ok: true,
        folios
    })
})

app.put('/foliosSICE', async(req, res) => {
    let folios = req.body.data.folios;
    let foliosResultado = [];
    let errors = [];
    console.log(folios);

    // let foliosSICE = folios.map(el => {
    //     return {
    //         Folio: el.folio,
    //         Expediente: el.expediente,
    //         Paquete: el.noPaquete,
    //         Tomo: el.tomos,
    //         Juzgado: el.juzgado,
    //         JuzgadoInstancia: el.instanciaJ,
    //         Sala: el.sala,
    //         SalaInstancia: el.instanciaS,
    //         Toca: el.toca,
    //         Actor: el.actor,
    //         Demandado: el.demandado,
    //         Juicio: el.juicio,
    //         Observaciones: el.observaciones,
    //         Dependencia: el.dependencia,
    //         NumeroImagenes: el.numImagenes
    //     };
    // })

    // console.log(foliosSICE);

    // MongoClient.connect(
    //         "mongodb://pjcdmx:pjcdmx@172.26.60.60:27017/archivosSICE?authSource=admin", { useUnifiedTopology: true },
    //         (err, result) => {
    //             if (err) throw new Error(err);

    //             const archivo = result.db("registro").collection("folios");
    //             archivo.insertMany(foliosSICE)
    //                 .then(foliosDB => {
    //                     console.log(foliosDB);
    //                     return res.json({
    //                         ok: true,
    //                         folios: foliosDB
    //                     })
    //                 })
    //                 .catch(err => {
    //                     return res.status(500).json({
    //                         ok: false,
    //                         err
    //                     })
    //                 });
    //         })
    // Folio.findOneAndUpdate()
    for (bodi of folios) {
        delete bodi._id;
        await Folio.updateOne({ folio: bodi.folio, bis: bodi.bis, tomo: bodi.tomo }, { $set: bodi }, { new: true, upsert: true }, (err, folioDB) => {
            if (err) {
                errors.push(err)
            }
            foliosResultado.push(folioDB);
        })
    }
    res.json({
            ok: true,
            result: {
                errors,
                foliosResultado
            }
        })
        // Paquete.findOneAndUpdate({ noPaquete, bis }, { validado }, { new: true }, (err, paqueteDB) => {
        //     if (err) {
        //         console.log(err);
        //         return res.status(500).json({
        //             ok: false,
        //             err
        //         })
        //     }
        //     console.log(paqueteDB);
        // });
        // // return res.json({
        // //         ok: true,
        // //         message: 'Actualizados'
        // //     })
        // Folio.updateMany(folios)
        //     .exec((err, foliosDB) => {
        //         if (err) {
        //             console.log(err);
        //             return res.status(500).json({
        //                 ok: false,
        //                 err
        //             })
        //         }
        //         Paquete.findOneAndUpdate({ noPaquete }, { validado: folios[0]['validado'] }, (err, paqueteDB) => {
        //             if (err) {
        //                 console.log(err);
        //                 return res.status(500).json({
        //                     ok: false,
        //                     err
        //                 })
        //             }

    //             return res.json({
    //                 ok: true,
    //                 message: 'hola final',
    //                 folios: foliosDB
    //             })
    //         })

    //     })


})

app.get('/foliosPaquete', async(req, res) => {
    let noPaquete = req.query.noPaquete;
    let bis = req.query.bis;
    let folioInicio = req.query.folioInicio;
    let folioFin = req.query.folioFin;
    let infoPaquete = {
        paquete: null,
        folios: null
    };

    Paquete.find({ noPaquete, bis }, (err, paqueteDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!paqueteDB)
            return res.json({
                    ok: false,
                    msg: 'El paquete ingresado no existe.'
                })
                // else if (paqueteDB.estado != 'Preparado')
                //     return res.json({
                //         ok: false,
                //         msg: 'El estado del paquete debe ser "Preparado" para poder capturar la informacion de sus respectivos folios.'
                //     })

        infoPaquete.paquete = paqueteDB;

        // Folio.find({ noPaquete }, (err, folios) => {
        //     if (err)
        //         return res.status(500).json({
        //             ok: false,
        //             err
        //         })

        //     infoPaquete.folios = folios;

        return res.json({
            ok: true,
            infoPaquete
        });
        // })
    })
})

app.get('/folio', (req, res) => {
    let folio = req.query.folio;

    Folio.find({ folio }, (err, folioDB) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        res.json({
            ok: true,
            folio: folioDB
        });
    })
})

app.get('/folios', async(req, res) => {
    let noPaquete = req.query.noPaquete;
    let bis = req.query.bis;
    let folioInicio = req.query.folioInicio;
    let folioFin = req.query.folioFin;

    // Folio.find({ noPaquete, bis }, {}, { sort: { folio: 1 } }, (err, folios) => {
    //     if (err)
    //         return res.status(500).json({
    //             ok: false,
    //             err
    //         })
    //     return res.json({
    //         ok: true,
    //         folios
    //     });
    // })
    Folio.find({
        $and: [{
            noPaquete: { $eq: noPaquete },
            bis: { $eq: bis },
            folio: { $gte: folioInicio, $lte: folioFin }
        }]
    }, {}, { sort: { folio: 1 } }, (err, foliosDB) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
        res.json({
            ok: true,
            folios: foliosDB
        })
    })

})

app.post('/folios', async(req, res) => {
    let body = req.body.data;
    let noPaquete = req.body.noPaquete;

    body.folios.forEach(element => {
        console.log(element);
    });

    // Folio.insertMany(body.folios,
    //         (err, foliosDB) => {
    //             if (err) {
    //                 console.log(err);
    //                 return res.status(500).json({
    //                     ok: false,
    //                     err
    //                 })
    //             }
    //             res.json({
    //                 ok: true,
    //                 folios: foliosDB
    //             })

    //         })
    // Paquete.updateOne()
})

app.put('/folios', async(req, res) => {
    let folios = req.body.data.folios;
    let noPaquete = req.body.data.noPaquete;
    let bis = req.body.data.bis;
    let errors = false;
    let validado = req.body.data.validado;
    let foliosResultado = [];

    for (folio of folios) {
        Folio.findOneAndUpdate({ noPaquete, folio: folio.folio, bis }, folio, (err, folioDB) => {
            if (err)
                errors = true;
        })
    }
    if (errors) {
        return res.status(500).json({
            ok: false,
            err
        });
    }
    Paquete.findOneAndUpdate({ noPaquete, bis }, { validado }, (err, paqueteDB) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                err
            })
        }
    });
    return res.json({
            ok: true,
            message: 'Actualizados'
        })
        // Folio.updateMany(folios)
        //     .exec((err, foliosDB) => {
        //         if (err) {
        //             console.log(err);
        //             return res.status(500).json({
        //                 ok: false,
        //                 err
        //             })
        //         }
        //         Paquete.findOneAndUpdate({ noPaquete }, { validado: folios[0]['validado'] }, (err, paqueteDB) => {
        //             if (err) {
        //                 console.log(err);
        //                 return res.status(500).json({
        //                     ok: false,
        //                     err
        //                 })
        //             }

    //             return res.json({
    //                 ok: true,
    //                 message: 'hola final',
    //                 folios: foliosDB
    //             })
    //         })

    //     })


})

module.exports = app;