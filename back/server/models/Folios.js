const mongoose = require('mongoose');

// const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let foliosSchema = new Schema({
    folio: {
        type: Number,
        required: true,
        unique: false
    },
    tomos: {
        type: Number
    },
    referencias: {
        type: String
    },
    estado: {
        type: String,
        default: 'Completo'
    },
    noPaquete: {
        type: Number,
        required: true
    }
});

// usuarioSchema.plugin(uniqueValidator, { message: '{PATH} ya existe, debe de ser único.' });


module.exports = mongoose.model('Folio', foliosSchema);