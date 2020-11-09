const express = require("express");
const app = express();

const Paquete = require("../models/Paquetes");

app.get("/reportePreparado", (req, res) => {
    let verificador = req.query.verificador;
    let preparador = req.query.preparador;
    let fechaInicio = new Date(req.query.fechaInicio);
    let turno = req.query.turno;
    let fechaFin = req.query.fechaFin || fechaInicio;
    fechaFin = new Date(fechaFin);

    if (preparador) {
        Paquete.aggregate(
            [
                { $match: { preparador: `${preparador}`, turno: `${turno}` } },
                {
                    $group: {
                        _id: "$preparador",
                        total: { $sum: "$noFojas" },
                    },
                },
                { $sort: { preparador: 1 } },
            ],
            (err, reporte) => {
                if (err)
                    return res.status(500).json({
                        ok: false,
                        err,
                    });
                return res.json({
                    ok: true,
                    reporte,
                });
            }
        );
    }
    if (verificador) {
        Paquete.aggregate(
            [
                { $match: { verificador: `${verificador}`, turno: `${turno}` } },
                {
                    $group: {
                        _id: "$verificador",
                        total: { $sum: "$noFojas" },
                    },
                },
                { $sort: { verificador: -1 } },
            ],
            (err, reporte) => {
                if (err)
                    return res.status(500).json({
                        ok: false,
                        err,
                    });
                return res.json({
                    ok: true,
                    mes: "verificador",
                    reporte,
                });
            }
        );
    }

    if (fechaInicio && fechaFin) {
        Paquete.aggregate(
            [{
                    $match: {
                        $and: [
                            { fechaAsignacion: { $lte: fechaFin } },
                            { fechaAsignacion: { $gte: fechaInicio } },
                            { turno: `${turno}` }
                        ],
                    },
                },
                {
                    $group: { _id: "$preparador", total: { $sum: "$noFojas" } },
                },
                { $sort: { _id: 1 } },
            ],
            (err, reporte) => {
                if (err)
                    return res.status(500).json({
                        ok: false,
                        err,
                    });
                return res.json({
                    ok: true,
                    mes: 'verificador',
                    reporte,
                });
            }
        );
    }

});

app.get('/reporteCosido', (req, res) => {
    let verificador = req.query.verificador;
    let preparador = req.query.preparador;
    let fechaInicio = new Date(req.query.fechaInicio);
    let turno = req.query.turno;
    let fechaFin = req.query.fechaFin || fechaInicio;
    fechaFin = new Date(fechaFin);

    if (preparador) {
        Paquete.aggregate(
            [
                { $match: { cosedor: `${cosedor}`, turno: `${turno}` } },
                {
                    $group: {
                        _id: "$cosedor",
                        total: { $sum: "$noFojas" },
                    },
                },
                { $sort: { preparador: 1 } },
            ],
            (err, reporte) => {
                if (err)
                    return res.status(500).json({
                        ok: false,
                        err,
                    });
                return res.json({
                    ok: true,
                    reporte,
                });
            }
        );
    }

    if (fechaInicio && fechaFin) {
        Paquete.aggregate(
            [{
                    $match: {
                        $and: [
                            { fechaCosido: { $lte: fechaFin } },
                            { fechaCosido: { $gte: fechaInicio } },
                            { turno: `${turno}` }
                        ],
                    },
                },
                {
                    $group: { _id: "$cosedor", total: { $sum: "$noFojas" } },
                },
                { $sort: { _id: 1 } },
            ],
            (err, reporte) => {
                if (err)
                    return res.status(500).json({
                        ok: false,
                        err,
                    });
                return res.json({
                    ok: true,
                    mes: 'verificador',
                    reporte,
                });
            }
        );
    }
});

module.exports = app;