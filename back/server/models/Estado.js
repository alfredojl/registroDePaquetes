const mongoose = require('mongoose');
// const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let estadoSchema = new Schema({
    estado: {
        type: String,
        unique: true
    }
});

// usuarioSchema.plugin(uniqueValidator, { message: '{PATH} ya existe, debe de ser único.' });


module.exports = mongoose.model('Estado', estadoSchema);