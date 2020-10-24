const express = require('express');
const Usuario = require('../models/user');

const bcrypt = require('bcrypt');

// const { verToken, verRole } = require('../middlewares/autenticacion');


const app = express();

app.post('/login', (req, res) => {

    let body = req.body

    Usuario.findOne({ name: body.name }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "(email) y/o password incorrecto"
                }
            });
        }

        if (!bcrypt.compareSync(body.passwd, usuarioDB.passwd)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "email y/o (password) incorrecto"
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB.name
        })
    })

});

app.post('/user', (req, res) => {
    let name = req.body.name
    let passwd = bcrypt.hashSync(req.body.passwd, 10);

    console.log(req.body);

    Usuario.create({
        name,
        passwd
    }, (err, usuarioDB) => {
        if (err)
            res.status(500).json({
                ok: false,
                err
            });

        res.json({
            ok: true,
            usuarioDB
        })
    })
})

app.put('/user', function(req, res) {

    let name = req.body.name;
    let passwd = req.body.passwd;
    // let body = _.pick(req.body, ['name', 'email', 'img', 'role']);

    Usuario.findOneAndUpdate({ name }, { passwd }, { new: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });



});

// app.delete('/usuario/:id', [verToken, verRole], function(req, res) {

//     let id = req.params.id;

//     Usuario.findByIdAndRemove(id, (err, borrado) => {

//         if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 err
//             });
//         }

//         if (!borrado) {
//             return res.status(400).json({
//                 ok: false,
//                 err: {
//                     message: "Usuario no encontrado."
//                 }
//             });
//         }

//         res.json({
//             ok: true,
//             usuario: borrado
//         });
//     })

// });

module.exports = app;