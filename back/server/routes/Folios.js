const express = require('express');
const app = express();

const Folio = require('../models/Folios');
const Paquete = require('../models/Paquetes');

app.get('/folios', async(req, res) => {
    // let folioInicio = req.query.folioInicio;
    // let folioFin = req.query.folioFin || folioInicio;

    let noPaquete = req.query.noPaquete;

    Folio.find({ noPaquete }, {}, { sort: { folio: 1 } }, (err, folios) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            })
        return res.json({
            ok: true,
            folios
        });
    })



    // if (folioInicio) {
    //     var folios = await Folio.find({
    //             folio: { $gte: folioInicio, $lte: folioFin }
    //         })
    //         .catch(err => {
    //             console.log(err);
    //             return res.status(500).json({
    //                 ok: false,
    //                 err
    //             })
    //         })
    // } else {
    //     var folios = await Folio.find({
    //             noPaquete
    //         })
    //         .catch(err => {
    //             console.log(err);
    //             return res.status(500).json({
    //                 ok: false,
    //                 err
    //             })
    //         })
    // }
})

app.post('/folios', async(req, res) => {
    let body = req.body.data;
    let noPaquete = req.body.noPaquete;

    Folio.insertMany(body.folios,
            (err, foliosDB) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }
                res.json({
                    ok: true,
                    folios: foliosDB
                })

            })
        // Paquete.updateOne()
})

app.put('/folios', async(req, res) => {
    let folios = req.body.data.folios;
    let noPaquete = folios[0]['noPaquete'];
    let errors = false;
    let foliosResultado = [];

    for (folio of folios) {
        Folio.findOneAndUpdate({ folio: folio.folio }, folio, (err, folioDB) => {
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
    Paquete.findOneAndUpdate({ noPaquete }, { validado: folios[0]['validado'] }, (err, paqueteDB) => {
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
            message: 'hola final',
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