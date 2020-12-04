const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let dependenciaSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario.'],
        unique: true
    },
    value: {
        type: Number,
        unique: true,
        required: [true, 'El nombre es necesario.']
    },
});

module.exports = mongoose.model('Dependencia', dependenciaSchema);