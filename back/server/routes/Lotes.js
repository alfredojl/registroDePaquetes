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
        return res.json({
            ok: true,
            lote: loteDB
        })
    })
});

app.post('/lote', (req, res) => {
    let lote = req.body.lote;
    console.log(lote);

    Lote.insertMany(lote, (err, loteDB) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            })
        console.log('error no');
        res.json({
            ok: true,
            lote: loteDB
        })
    })
});

module.exports = app;