// const Paquete = require("../server/models/Paquetes");

const MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
const xlsx = require("xlsx");
const { db } = require('./server/models/Lote');
// const mongoose = require("mongoose");

const getPaquetes = () => {
    // mongoose.connect(
    //     "mongodb://localhost:27017/archivosSICE", {
    //         useNewUrlParser: true,
    //         useUnifiedTopology: true,
    //         useCreateIndex: true,
    //         useFindAndModify: false,
    //     },
    var findDocuments = (db, callback) => {
        const archivo = db.collection('InfoFolio');

        archivo.find({}, ["Folio", "NombreArchivo", "NumeroDeImagenes", "Validado", "FechaValidado", "Procesado", "FechaProcesado", "Error"],
            (err, archivoDB) => {
                if (err)
                    return console.log(err);

                let doc, libro;
                doc = xlsx.utils.json_to_sheet(archivoDB);
                libro = xlsx.utils.book_new();
                xlsx.utils.book_append_sheet(libro, doc, "doc.xlsx");
                xlsx.writeFile(libro, `./archivosSICE.xlsx`);

                assert.strictEqual(err, null);
                assert.strictEqual(archivoDB)
                callback(archivoDB)
            })
    }
    MongoClient.connect('mongodb://localhost:27017/archivosSICE', { useUnifiedTopology: true },
        (err, res) => {
            if (err) throw err;
            console.log("BD ONLINE");

            findDocuments(db, (err, archivoDB) => {
                db.close();
            })

        }
    );
};

getPaquetes();