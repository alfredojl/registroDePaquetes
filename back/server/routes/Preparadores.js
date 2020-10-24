const express = require('express');
const app = express();

const Preparador = require('../models/Preparadores');
const Verificador = require('../models/Verificadores');

app.get('/preparadores', (req, res) => {
    Preparador.find({}, {}, {
        sort: {
            name: 1
        }
    }, (err, preparadorDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            preparadores: preparadorDB
        });
    })
});

app.post('/preparadores', async(req, res) => {
    let name = req.body.name
    let ver = req.body.vname

    var verificador = await Verificador.findOne({ name: ver });
    if (!verificador) {
        verificador = Verificador.create({ name: ver }, (err, verificadorDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            return verificadorDB
        })
    }
    res.json({
        verificador
    })

    Preparador.create({
        name,
        verificador
    }, (err, preparadorDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            preparador: preparadorDB
        })
    });
});

app.put('/preparadores', (req, res) => {
    let oldName = req.body.oldName;
    let newName = req.body.newName;
    Preparador.findOneAndUpdate({ name: oldName }, { name: newName }, { new: true }, (err, preparadorDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        return res.json({
            ok: true,
            preparador: preparadorDB
        })
    })
});

app.delete('/preparadores', (req, res) => {
    let name = req.body.name

    Preparador.findOneAndDelete({ name }, (err, preparadorDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        return res.json({
            ok: true,
            preparador: preparadorDB
        })

    })
})

module.exports = app;