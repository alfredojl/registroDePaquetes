const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario.'],
        unique: true
    },
    passwd: {
        type: String,
        required: [true, 'Debes tener una contraseña.']
    }
});

// usuarioSchema.plugin(uniqueValidator, { message: '{PATH} ya existe, debe de ser único.' });


module.exports = mongoose.model('Usuario', usuarioSchema);