const Verificador = require('../server/models/Verificadores');
const Preparadores = require('../server/models/Preparadores');
const Digitalizador = require('../server/models/Digitalizadores');
const Estado = require('../server/models/Estado');
const mongoose = require('mongoose');

require('../server/config/config');



const verificadores = require('./Verificadores.json');
const preparadores = require('./Preparadores.json');
const estados = require('./Estados.json');
const digitalizadores = require('./Digitalizadores.json');

const install = async() => {
    mongoose.connect('mongodb://localhost:27017/registro', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }, (err, res) => {
        if (err) throw err;
        console.log("BD ONLINE");
    });
    // console.log(preparadores);
    await Preparadores.insertMany(preparadores)
        .then(preparadoresDB => {
            console.log("Preparadores añadidos correctamente.");
        })
        .catch(err => {
            console.log(err);
        })
    await Verificador.insertMany(verificadores)
        .then(VerificadoresDB => {
            console.log("Verificadores añadidos correctamente.");
        })
        .catch(err => {
            console.log(err);
        })

    await Estado.insertMany(estados)
        .then(estadosDB => {
            console.log('Estados agregados correctamente.');
        })
        .catch(err => {
            console.log(err);
        })

    await Digitalizador.insertMany(digitalizadores)
        .then(digitalizadoresDB => {
            console.log('Digitalizadores agregados correctamente.');
        })
        .catch(err => {
            console.log(err);
        })
    process.exit();
};

install();