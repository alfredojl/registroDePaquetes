const express = require('express');
const app = express();

const Paquete = require('../models/Paquetes');
const Folio = require('../models/Folios');

app.get('/paquete', (req, res) => {
    let noPaquete = req.query.noPaquete;

    Paquete.findOne({ noPaquete }, (err, paqueteDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        return res.json({
            ok: true,
            paquete: paqueteDB
        })
    })
});

app.post('/paquete', async(req, res) => {
    let body = req.body.data;
    let noPaquete = body.noPaquete;

    Paquete.findOneAndUpdate({ noPaquete }, body, { upsert: true }, async(err, paqueteDB) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                err
            })
        }

        await Folio.deleteMany({ noPaquete }, (err, fol) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Error al eliminar folios'
                    }
                })
            }
        });

        let folios = [];
        for (let i = body.folioInicio; i <= body.folioFin; i++) {
            let folio = {
                folio: i,
                noPaquete: body.noPaquete
            }
            folios.push(folio);
        };

        await Folio.insertMany(folios, (err, resultado) => {
            if (err) {
                Paquete.remove({ noPaquete: body.noPaquete });
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
        })
        return res.json({
            ok: true,
            paquete: paqueteDB
        });
    })
})

app.put('/paquete', async(req, res) => {

    let noPaquete = req.body.noPaquete;
    let folioInicio = req.body.folioInicio;
    let folioFin = req.body.folioFin;
    let fechaExpediente = req.body.fechaExpediente;
    let verificador = req.body.verificador;
    let preparador = req.body.preparador;
    let turno = req.body.turno;
    let digitalizador = req.body.digitalizador;
    let noFojas = req.body.noFojas;
    let registrado = req.body.registrado;

    await Paquete.updateOne({ noPaquete: noPaquete }, {
        noPaquete,
        folioInicio,
        folioFin,
        fechaExpediente,
        registrado,
        verificador,
        digitalizador,
        noFojas,
        preparador,
        turno
    }, { new: true }, async(err, paqueteDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        await Folio.deleteMany({ noPaquete }, (err, fol) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Error al eliminar folios'
                    }
                })
            }
        });
        let folios = [];
        for (let i = folioInicio; i <= folioFin; i++) {
            let folio = {
                folio: i,
                noPaquete: noPaquete
            }
            folios.push(folio);
        };

        await Folio.insertMany(folios, (err, resultado) => {
            if (err) {
                Paquete.remove({ noPaquete });
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
        })
        return res.json({
            ok: true,
            paquete: paqueteDB
        })
    })
});

app.put('/captura', (req, res) => {
    let noPaquete = req.body.noPaquete;
    let body = req.body;

    Paquete.updateOne({ noPaquete }, body, { new: true }, (err, paqueteDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            paquete: paqueteDB
        })
    })
})

app.delete('/paquete', (req, res) => {
    let noPaquete = req.query.noPaquete;

    Paquete.findOneAndDelete({ noPaquete }, (err, paqueteDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        Folio.deleteMany({ noPaquete }, (err, folioDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            return res.json({
                ok: true,
                paquete: paqueteDB
            })
        })
    });
})
module.exports = app;