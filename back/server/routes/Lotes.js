const express = require('express');
const app = express();
const moment = require('moment');

const Lote = require('../models/Lote');

moment.locale('es-mx');

app.get('/lote', async(req, res) => {
    let query = req.query;

    await Lote.find(query, (err, loteDB) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            })
        loteDB = loteDB.map(el => {
            return {
                noLote: el.noLote,
                noPaquete: el.noPaquete,
                fechaEntregado: el.fechaEntregado ? moment(el.fechaEntregado).format('DD/MM/YYYY') : null,
                fechaDevolucion: el.fechaDevolucion ? moment(el.fechaDevolucion).format('DD/MM/YYYY') : null
            }
        })
        return res.json({
            ok: true,
            lote: loteDB
        })
    })
});

app.post('/lote', async(req, res) => {
    let lote = req.body.lote;
    let list = [];
    let listErrors = [];
    let fechaE, fechaD;
    if (lote[0].fechaEntregado) {
        fechaE = lote[0].fechaEntregado.split('/').reverse();
        fechaE[1]--;
        lote.forEach(el => {
            el.fechaEntregado = moment(fechaE)
        })
    }
    if (lote[0].fechaDevolucion) {
        fechaD = lote[0].fechaDevolucion.split('/').reverse();
        fechaD[1]--;
        lote.forEach(el => {
            el.fechaDevolucion = moment(fechaD)
        })
    }
    // console.log(lote);
    // res.json({ ok: true })

    for (const [index, item] of lote.entries()) {
        await Lote.findOneAndUpdate({ noPaquete: item.noPaquete, bis: item.bis, identificador: item.identificador }, item, async(err, loteDB) => {
            if (err) {
                listErrors.push(err)
            }
            if (!loteDB)
                await Lote.create(lote[index], (err, loteCreated) => {
                    if (err) listErrors.push(err)
                    list.push(loteCreated);
                })
            else list.push(loteDB);
        })
    }
    if (listErrors.length > 0)
        return res.status(500).json({
            ok: false,
            messages: listErrors
        })
    else
        return res.json({
                ok: true,
                lote: list
            })
            // await Lote.insertMany(lote, (err, loteDB) => {
            //     if (err) {
            //         return res.status(500).json({
            //             ok: false,
            //             err
            //         })
            //     }
            //     return res.json({
            //         ok: true,
            //         lote: loteDB
            //     })
            // })
});

app.put('/lote', (req, res) => {
    let noLote = req.body.noLote;
    let fechaEntregado = req.body.fechaEntregado;
    let fechaDevolucion = req.body.fechaDevolucion;
    let body = {
        noLote
    };
    if (fechaEntregado)
        body.fechaEntregado = fechaEntregado;
    if (fechaDevolucion)
        body.fechaDevolucion = fechaDevolucion;

    Lote.updateMany({ noLote }, body, { new: true }, (err, equis) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
        Lote.find({ noLote }, (err, loteDB) => {
            if (err)
                return res.status(500).json({
                    ok: false,
                    err
                })
            loteDB = loteDB.map(el => {
                return {
                    noLote: el.noLote,
                    noPaquete: el.noPaquete,
                    fechaEntregado: el.fechaEntregado ? new Date(el.fechaEntregado).toISOString().slice(0, 10) : null,
                    fechaDevolucion: el.fechaDevolucion ? new Date(el.fechaDevolucion).toISOString().slice(0, 10) : null
                }
            });
            res.json({
                ok: true,
                lote: loteDB
            });
        })
    })
})

module.exports = app;