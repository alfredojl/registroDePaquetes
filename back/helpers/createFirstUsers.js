const Usuario = require("../server/models/user");
const bcrypt = require("bcrypt");

const mongoose = require("mongoose");

require("../server/config/config");

mongoose.connect(
  "mongodb://production:production$@172.26.60.61:27017/registro?authSource=admin",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  (err, res) => {
    if (err) throw err;
    console.log("BD ONLINE");
  }
);

const crearUsuario = async () => {
  // const name = "root";
  // const passwdprov = "admin";

  const usuarios = [
    {
      name: "Cristal",
      passwd: bcrypt.hashSync("cristal_", 10),
    },
    // {
    //     name: "Alan",
    //     passwd: bcrypt.hashSync('alan_', 10)
    // },
    // {
    //     name: "Ricardo",
    //     passwd: bcrypt.hashSync('ricardo_', 10)
    // }
  ];

  await Usuario.insertMany(usuarios)
    .then((usuarioDB) => {
      console.log("Usuarios creados con éxito.");
    })
    .catch((err) => {
      console.log(err);
    });
  process.exit();
};

crearUsuario();
