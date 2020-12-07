const express = require('express');
const app = express();

const Folio = require('../models/Folios');
const Paquete = require('../models/Paquetes');

app.put('/foliosSICE', async(req, res) => {
    let folios = req.body.data.folios;
    let infoCapturadaSICE = req.body.data.infoCapturadaSICE || "NO";
    let noPaquete = folios[0]['noPaquete'];
    let foliosResultado = [];

    // Folio.findOneAndUpdate()
    for (bodi of folios) {
        var n = Folio.findOneAndUpdate({ folio: bodi.folio }, bodi, { new: true }, (err, folioDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            console.log(folioDB);
        })
    }
    Paquete.findOneAndUpdate({ noPaquete, bis }, { validado }, { new: true }, (err, paqueteDB) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                err
            })
        }
        console.log(paqueteDB);
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

        Folio.find({ noPaquete }, (err, folios) => {
            if (err)
                return res.status(500).json({
                    ok: false,
                    err
                })

            infoPaquete.folios = folios;

            return res.json({
                ok: true,
                infoPaquete
            });
        })
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