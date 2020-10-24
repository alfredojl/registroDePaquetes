const express = require('express');
const app = express();

const Estado = require('../models/Estado');
const url = '/estado'

app.use(url, (req, res) => {
    Estado.find({}, (err, estadosDB) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            })
        return res.json({
            ok: true,
            estados: estadosDB
        })
    })
});

module.exports = app;