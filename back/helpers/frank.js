const Paquete = require("../server/models/Paquetes");

const xlsx = require("xlsx");
const mongoose = require("mongoose");

require("../server/config/config");

const getPaquetes = () => {
    mongoose.connect(
        "mongodb://localhost:27017/registro", {
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

    Paquete.find({}, ["noPaquete", "fechaExpediente"], (err, paquetesDB) => {
        if (err) throw new Error(err);
        // console.log(paquetesDB);
        let aux = paquetesDB.map((el) => {
            return {
                Paquete: el.noPaquete,
                Fecha: el.fechaExpediente ?
                    new Date(el.fechaExpediente).toISOString().slice(0, 10) : "No hay fecha"
            };
        });
        let doc, libro;
        doc = xlsx.utils.json_to_sheet(aux);
        libro = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(libro, doc, "doc.xlsx");
        xlsx.writeFile(libro, `./paquetes.xlsx`);
    });
};

getPaquetes();