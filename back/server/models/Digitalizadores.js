const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let digitalizadorSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario.'],
        unique: true
    }
});

// usuarioSchema.plugin(uniqueValidator, { message: '{PATH} ya existe, debe de ser único.' });


module.exports = mongoose.model('Digitalizador', digitalizadorSchema);