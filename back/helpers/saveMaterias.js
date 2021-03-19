const Materia = require('../server/models/Materias');
const Dependencia = require('../server/models/Dependencias');

const mongoose = require('mongoose');

const materias = require('./Materias.json');
const dependencias = require('./Dependencias.json')

const install = async() => {
    mongoose.connect('mongodb://production:production$@172.26.60.61:27017/registro?authSource=admin', {
        // mongoose.connect('mongodb://localhost:27017/registro', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }, (err, res) => {
        if (err) throw err;
        console.log("BD ONLINE");
    });

    await Materia.insertMany(materias)
        .then((materiasDB) => {
            console.log("'Materias' saved succesfully.");
        }).catch((err) => {
            console.log(err);
        });

    // await Dependencia.insertMany(dependencias)
    //     .then((dependenciasDB) => {
    //         console.log('Dependencias saved succesfully.');
    //     }).catch((err) => {
    //         console.log(err);
    //     });

    process.exit();

}

install();