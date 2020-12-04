const express = require('express');
const app = express();

const Dependencias = require('../models/Dependencias');

app.get('/dependencias', async(req, res) => {

    await Dependencias.find({})
        .exec((err, dependenciasDB) => {
            if (err)
                return res.status(500).json({
                    ok: false,
                    err
                })
            res.json({
                ok: true,
                dependencias: dependenciasDB
            })
        })

})

module.exports = app;