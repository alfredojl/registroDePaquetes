const Usuario = require('../server/models/user');
const bcrypt = require('bcrypt');

const mongoose = require('mongoose');


require('../server/config/config');

mongoose.connect('mongodb://localhost:27017/registro', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}, (err, res) => {
    if (err) throw err;
    console.log("BD ONLINE");
});

const crearUsuario = async() => {
    // const name = "root";
    // const passwdprov = "admin";

    const usuarios = [{
            name: "Tania Sánchez",
            passwd: bcrypt.hashSync('0404', 10),
        },
        {
            name: "fabi",
            passwd: bcrypt.hashSync('2020', 10)
        },
        {
            name: "alice",
            passwd: bcrypt.hashSync('amh', 10)
        }
    ]

    await Usuario.insertMany(usuarios)
        .then(usuarioDB => {
            console.log('Usuarios creados con éxito.');
        })
        .catch(err => {
            console.log(err);
        })
    process.exit();
};

crearUsuario();