const express = require('express');
const app = express();

const Digitalizador = require('../models/Digitalizadores');

app.get('/digitalizador', async(req, res) => {
    let name = req.query.name;

    await Digitalizador.find({})
        .exec((err, digitalizadoresDB) => {
            if (err)
                return res.status(500).json({
                    ok: false,
                    err
                })
            res.json({
                ok: true,
                digitalizadores: digitalizadoresDB
            })
        })

})

app.post('/digitalizador', (req, res) => {
    let name = req.body.name;

    Digitalizador.create({ name }, (err, digitalizadorDB) => {
        if (err) {
            return res.status(500).json({
                ok: true,
                digitalizadorDB
            })
        }

        return res.json({
            ok: true,
            digitalizador: digitalizadorDB
        })
    })
})
app.put('/digitalizador', (req, res) => {
    let oldName = req.body.oldName;
    let newName = req.body.newName;

    Digitalizador.findOneAndUpdate({ name: oldName }, { name: newName }, { new: true }, (err, digitalizadorDB) => {
        if (err) {
            return res.status(500).json({
                ok: true,
                digitalizadorDB
            })
        }

        return res.json({
            ok: true,
            digitalizador: digitalizadorDB
        })
    })
})
app.delete('/digitalizador', (req, res) => {
    let name = req.body.name;

    Digitalizador.findOneAndDelete({ name }, (err, digitalizadorDB) => {
        if (err) {
            return res.status(500).json({
                ok: true,
                digitalizadorDB
            })
        }

        return res.json({
            ok: true,
            digitalizador: digitalizadorDB
        })
    })
})

module.exports = app;