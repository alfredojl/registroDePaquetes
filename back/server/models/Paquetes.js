const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let paqueteSchema = new Schema({
    noPaquete: {
        type: Number,
        required: [true, 'Paquete es necesario'],
    },
    folioInicio: {
        type: Number,
        required: true,
        unique: false
    },
    folioFin: {
        type: Number,
        required: true,
        unique: false
    },
    turno: {
        type: String,
    },
    preparador: {
        type: String
    },
    verificador: {
        type: String
    },
    fechaExpediente: {
        type: Date,
    },
    fechaCosido: {
        type: Date,
    },
    fechaAsignacion: {
        type: Date,
    },
    fechaPreparacion: {
        type: Date,
    },
    fechaAlta: {
        type: Date
    },
    noFojas: {
        type: Number
    },
    bis: {
        type: Boolean,
        default: false
    },
    identificador: {
        type: Number
    },
    cantidad: {
        type: Number
    },
    registrado: {
        type: String
    },
    cosedor: {
        type: String
    },
    digitalizador: {
        type: String
    },
    validado: {
        type: String
    },
    sellado: {
        type: String
    },
    cosido: {
        type: String
    },
    estado: {
        type: String,
        default: 'Recibido'
    },
    observaciones: {
        type: String
    },
    noLote: {
        type: Number
    },
    revisado: {
        type: Boolean,
        default: false
    },
    infoCapturadaSICE: {
        type: String
    }
});

// usuarioSchema.plugin(uniqueValidator, { message: '{PATH} ya existe, debe de ser único.' });


module.exports = mongoose.model('Paquete', paqueteSchema);