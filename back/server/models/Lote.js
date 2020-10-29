const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let loteSchema = new Schema({
    noPaquete: {
        type: Number,
        unique: true,
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
    }
});

// usuarioSchema.plugin(uniqueValidator, { message: '{PATH} ya existe, debe de ser único.' });


module.exports = mongoose.model('Lote', loteSchema);