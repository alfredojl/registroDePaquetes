const express = require('express');
const app = express();

const Folio = require('../models/Folios');
const Paquete = require('../models/Paquetes');

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