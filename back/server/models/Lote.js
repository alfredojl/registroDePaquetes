const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let loteSchema = new Schema({
    noPaquete: {
        type: Number,
        required: true
    },
    fechaEntregado: {
        type: Date,
    },
    fechaDevolucion: {
        type: Date
    },
    noLote: {
        type: Number,
        required: true
    },
    bis: {
        type: Boolean,
        default: false
    },
    identificador: {
        type: String
    },
    cantidad: {
        type: Number
    }
});

// usuarioSchema.plugin(uniqueValidator, { message: '{PATH} ya existe, debe de ser único.' });


module.exports = mongoose.model('Lote', loteSchema);