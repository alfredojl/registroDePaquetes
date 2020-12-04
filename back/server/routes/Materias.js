const express = require('express');
const app = express();

const Materias = require('../models/Materias');

app.get('/materias', async(req, res) => {

    await Materias.find({})
        .exec((err, materiasDB) => {
            if (err)
                return res.status(500).json({
                    ok: false,
                    err
                })
            res.json({
                ok: true,
                materias: materiasDB
            })
        })

})

module.exports = app;