const express = require('express');
const app = express();

const Paquete = require('../models/Paquetes');
const Folio = require('../models/Folios');

app.get('/paqueteFormato', (req, res) => {
    let noPaquete = req.query.noPaquete;
    let bis = req.query.bis || false;
    let folioInicio = req.query.folioInicio;

    Paquete.find({ noPaquete, bis, folioInicio }, (err, paqueteDB) => {
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

app.get('/paquete', (req, res) => {
    let noPaquete = req.query.noPaquete;
    let bis = req.query.bis || false;
    let folioInicio = req.query.folioInicio;

    Paquete.find({ noPaquete, bis }, (err, paqueteDB) => {
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
    let folioInicio = body.folioInicio;
    let folioFin = body.folioFin;
    let bis = body.bis;

    await Paquete.find({ noPaquete, bis, folioInicio, folioFin }, {}, async(err, encontradoDB) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        if (encontradoDB.length > 0) {
            return res.json({
                ok: false,
                message: "El paquete ya existe. Verifique la información.",
            })
        }
        await Folio.find({ folio: { $gte: folioInicio, $lte: folioFin } }, async(err, foliosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (foliosDB.length > 0)
                return res.json({
                    ok: false,
                    message: `Conflicto con paquete ${foliosDB[0].noPaquete} y folios ${foliosDB.map(el => el.folio).join(', ')}.`
                })
            await Paquete.create(body, async(err, paqueteDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                await Folio.deleteMany({
                    $and: [{
                        noPaquete,
                        bis,
                        folio: { $gte: folioInicio, $lte: folioFin },
                    }]
                }, (err, fol) => {
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
})

app.put('/paquete', async(req, res) => {
    let body = req.body.data;
    await Paquete.updateOne({ noPaquete: body.noPaquete, bis: body.bis, folioInicio: body.folioInicio }, body, { new: true }, async(err, paqueteDB) => {
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

app.put('/edit', async(req, res) => {
    let body = req.body.data;
    let id = body._id;
    delete body._id;
    console.log(body);
    await Paquete.findByIdAndUpdate(id, body, { new: true }, (err, paqueteUpdated) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                message: err
            })
        }
        console.log(paqueteUpdated);
        return res.json({
            ok: true,
            paquete: paqueteUpdated
        });
    })
})

app.delete('/edit', async(req, res) => {
    let body = req.body;
    let id = body._id;
    await Paquete.findByIdAndDelete(id, async(err, paqueteDeleted) => {
        if (err) return res.status(500).json({
            ok: false,
            message: err
        });
        await Folio.deleteMany({ noPaquete: body.noPaquete }, (err, foliosDeleted) => {
            if (err) return res.status(500).json({
                ok: false,
                message: err
            });
            return res.json({
                ok: true,
                paquete: paqueteDeleted
            });
        })
    })
});

app.put('/captura', (req, res) => {
    let noPaquete = req.body.noPaquete;
    let bis = req.body.bis;
    let folioInicio = req.body.folioInicio;
    let body = req.body
    Paquete.updateOne({ noPaquete, bis, folioInicio }, body, { new: true }, (err, paqueteDB) => {
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
    let bis = req.query.bis;
    let folioInicio = req.query.folioInicio;
    let folioFin = req.query.folioFin;

    Paquete.findOneAndDelete({ noPaquete, bis, folioInicio }, (err, paqueteDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        Folio.deleteMany({ noPaquete, bis, folio: { $gte: folioInicio, $lte: folioFin } }, (err, folioDB) => {
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