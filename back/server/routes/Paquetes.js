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

    Paquete.updateOne({ noPaquete }, body, { upsert: true }, async(err, paqueteDB) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                err
            })
        }

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
    let registrado = req.body.registrado;

    await Paquete.updateOne({ noPaquete: noPaquete }, {
        noPaquete,
        folioInicio,
        folioFin,
        fechaExpediente,
        registrado,
        verificador,
        preparador,
        turno
    }, { new: true }, async(err, paqueteDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
            throw new Error('1');
        }
        Folio.deleteMany({ noPaquete }, (err, fol) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Error al eliminar folios'
                    }
                })
                throw new Error('2');
            }
        });
        let folios = [];
        // for (let i = folioInicio; i <= folioFin; i++) {
        //     let folio = {
        //         folio: i,
        //         noPaquete: noPaquete
        //     }
        //     let hola = Folio.create(folio, (err, resultado) => {
        //             if (err) {
        //                 Paquete.deleteOne({ noPaquete });
        //                 res.status(500).json({
        //                     ok: false,
        //                     err
        //                 });
        //                 throw new Error('3');
        //             }
        //             console.log(resultado);
        //         })
        //         // folios.push(folio);
        //     folios.push(hola)
        // };
        let i = folioInicio;
        let temp = folioFin + 1;
        while (folioInicio <= folioFin) {
            let aux = new Folio({
                folio: folioInicio,
                noPaquete
            });
            aux.save((err, folio) => {
                if (err)
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                folios.push(folio);
                folioInicio++;
                console.log('uno mas');
            })
            if (folioInicio == folioFin)
                return res.json({
                    ok: true,
                    paquete: folios
                });
            console.log(folioInicio);
        }

    })
});

app.put('/captura', (req, res) => {
    let noPaquete = req.body.noPaquete;
    let body = req.body;

    Paquete.updateOne({ noPaquete }, body, { new: true }, (err, paqueteDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            })
            throw new Error('put');
        }

        return res.json({
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