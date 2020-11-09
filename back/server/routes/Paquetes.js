const express = require('express');
const app = express();

const Paquete = require('../models/Paquetes');
const Folio = require('../models/Folios');

app.get('/paquete', (req, res) => {
    let noPaquete = req.query.noPaquete;
    let bis = req.query.bis || false;

    Paquete.findOne({ noPaquete, bis }, (err, paqueteDB) => {
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
    let bis = body.bis;

    Paquete.find({ noPaquete, bis }, {}, (err, encontradoDB) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        if (encontradoDB.length > 0) {

            res.json({
                ok: true,
                message: "existente",
            })
        } else
            Paquete.create(body, async(err, paqueteDB) => {
                if (err)
                    return res.status(500).json({
                        ok: false,
                        err
                    });

                await Folio.deleteMany({ noPaquete, bis }, (err, fol) => {
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
                        noPaquete: body.noPaquete,
                        bis
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
                });
                return res.json({
                    ok: true,
                    paquete: paqueteDB
                });
            });

    })
})

app.put('/paquete', async(req, res) => {

    let noPaquete = req.body.noPaquete;
    let bis = req.body.bis;
    let folioInicio = req.body.folioInicio;
    let fechaAsignacion = req.body.fechaAsignacion;
    let folioFin = req.body.folioFin;
    let fechaExpediente = req.body.fechaExpediente;
    let verificador = req.body.verificador;
    let preparador = req.body.preparador;
    let turno = req.body.turno;
    let digitalizador = req.body.digitalizador;
    let noFojas = req.body.noFojas;
    let registrado = req.body.registrado;

    await Paquete.updateOne({ noPaquete, bis }, {
        noPaquete,
        verificador,
        fechaAsignacion,
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
        return res.json({
            ok: true,
            paquete: paqueteDB
        })
    })
});

app.put('/captura', (req, res) => {
    let noPaquete = req.body.noPaquete;
    let bis = req.body.bis;
    let digitalizador = req.body.digitalizador;
    let noFojas = req.body.noFojas;
    let fechaCosido = req.body.fechaCosido;
    let estado = req.body.estado;
    let cosedor = req.body.cosedor;
    let fechaPreparacion = req.body.fechaPreparacion;
    let observaciones = req.body.observaciones;
    let preparador = req.body.preparador;

    Paquete.updateOne({ noPaquete, bis }, {
        digitalizador,
        noFojas,
        cosedor,
        estado,
        fechaPreparacion,
        fechaCosido,
        observaciones,
        preparador
    }, { new: true }, (err, paqueteDB) => {
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