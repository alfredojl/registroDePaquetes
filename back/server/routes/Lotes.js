const express = require('express');
const app = express();

const Lote = require('../models/Lote');

app.get('/lote', (req, res) => {
    let query = req.query;

    Lote.find(query, (err, loteDB) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            })
        loteDB = loteDB.map(el => {
            return {
                noLote: el.noLote,
                noPaquete: el.noPaquete,
                fechaEntregado: el.fechaEntregado ? new Date(el.fechaEntregado).toISOString().slice(0, 10) : null,
                fechaDevolucion: el.fechaDevolucion ? new Date(el.fechaDevolucion).toISOString().slice(0, 10) : null
            }
        })
        return res.json({
            ok: true,
            lote: loteDB
        })
    })
});

app.post('/lote', (req, res) => {
    let lote = req.body.lote;

    Lote.insertMany(lote, (err, loteDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        console.log('error no');
        res.json({
            ok: true,
            lote: loteDB
        })
    })
});

app.put('/lote', (req, res) => {
    let noLote = req.body.noLote;
    let fechaEntregado = req.body.fechaEntregado;
    let fechaDevolucion = req.body.fechaDevolucion;

    Lote.updateMany({ noLote }, { fechaDevolucion, fechaEntregado }, { new: true }, (err, equis) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
        Lote.find({ noLote }, (err, loteDB) => {
            if (err)
                return res.status(500).json({
                    ok: false,
                    err
                })
            loteDB = loteDB.map(el => {
                return {
                    noLote: el.noLote,
                    noPaquete: el.noPaquete,
                    fechaEntregado: el.fechaEntregado ? new Date(el.fechaEntregado).toISOString().slice(0, 10) : null,
                    fechaDevolucion: el.fechaDevolucion ? new Date(el.fechaDevolucion).toISOString().slice(0, 10) : null
                }
            });
            res.json({
                ok: true,
                lote: loteDB
            });
        })
    })
})

module.exports = app;