const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let materiaSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario.'],
        unique: true
    }
});

module.exports = mongoose.model('Materias', materiaSchema);