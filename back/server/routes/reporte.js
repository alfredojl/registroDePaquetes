const express = require("express");
const app = express();

const Paquete = require("../models/Paquetes");

app.get("/reporte", (req, res) => {
    let verificador = req.query.verificador;
    let preparador = req.query.preparador;

    if (preparador) {
        Paquete.aggregate(
            [
                { $match: { preparador: `${preparador}` } },
                {
                    $group: {
                        _id: "$preparador",
                        total: { $sum: "$noFojas" },
                    },
                },
                { $sort: { total: -1 } },
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
                { $match: { verificador: `${verificador}` } },
                {
                    $group: {
                        _id: "$verificador",
                        total: { $sum: "$noFojas" },
                    },
                },
                { $sort: { total: -1 } },
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

    if (!verificador && !preparador) {
        Paquete.aggregate(
            [{
                    $match: { fechaAsignacion: { $eq: new Date(req.query.fechaAsignacion) } }
                },
                {
                    $group: {
                        _id: "$preparador",
                        total: { $sum: "$noFojas" },
                    },
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
                    reporte,
                });
            }
        );
    }

});

module.exports = app;