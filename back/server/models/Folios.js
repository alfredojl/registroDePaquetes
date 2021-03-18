const mongoose = require('mongoose');

// const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let foliosSchema = new Schema({
    folio: {
        type: Number,
        required: true,
        unique: false
    },
    fojas: {
        type: Number
    },
    tomos: {
        type: Number,
        default: null
    },
    referencias: {
        type: String
    },
    bis: {
        type: Boolean,
        default: false
    },
    identificador: {
        type: Number
    },
    estado: {
        type: String,
        default: 'Completo'
    },
    noPaquete: {
        type: Number,
        required: true
    },
    expediente: {
        type: String
    },
    paqueteF: {
        type: String
    },
    tomo: {
        type: String,
        default: null
    },
    juzgado: {
        type: String
    },
    instanciaJ: {
        type: String
    },
    sala: {
        type: String
    },
    instanciaS: {
        type: String
    },
    toca: {
        type: String
    },
    actor: {
        type: String
    },
    demandado: {
        type: String
    },
    juicio: {
        type: String
    },
    observaciones: {
        type: String
    },
    dependencia: {
        type: String
    },
    path: {
        type: String
    },
    archivo: {
        type: String
    },
    numeroImagenes: {
        type: Number
    },
    validado: {
        type: Boolean
    },
    Id: {
        type: Number
    },
    procesado: {
        type: Date
    }
});

// usuarioSchema.plugin(uniqueValidator, { message: '{PATH} ya existe, debe de ser único.' });


module.exports = mongoose.model('Folio', foliosSchema);