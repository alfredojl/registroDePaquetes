const Paquete = require('../server/models/Paquetes');

const mongoose = require('mongoose');


require('../server/config/config');

mongoose.connect('mongodb://localhost:27017/registro', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}, (err, res) => {
    if (err) throw err;
    console.log("BD ONLINE");
});

const getFaltantes = () => {
    Paquete.find({ folioInicio: null }, (err, faltantesDB) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            })
        res.json({
            ok: true,
            faltantes = faltantesDB
        });
    })

}

module.exports = app;