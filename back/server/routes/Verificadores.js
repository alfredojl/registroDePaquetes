const express = require('express');
const app = express();

const Verificador = require('../models/Verificadores');

app.get('/verificadores', (req, res) => {

    // res.json({ verificadores: req.query })
    let turno = req.query.turno;

    Verificador.find({}, {}, {
        sort: {
            name: 1
        }
    }, (err, verificadoresDB) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            })
        res.json({
            ok: true,
            verificadores: verificadoresDB
        })
    })
});

module.exports = app;