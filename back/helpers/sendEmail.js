const MongoClient = require("mongodb").MongoClient,
    assert = require("assert");
const xlsx = require("xlsx");

const moment = require('moment')
const send = require('gmail-send');

const getPaquetes = () => {
    // mongoose.connect(
    //     "mongodb://localhost:27017/archivosSICE", {
    //         useNewUrlParser: true,
    //         useUnifiedTopology: true,
    //         useCreateIndex: true,
    //         useFindAndModify: false,
    //     },
    var findDocuments = (db, callback) => {
        const archivo = db.collection("InfoFolio");

        archivo.find({ Procesado: false, Error: true }, [
                "Folio",
                "NombreArchivo",
                "NumeroDeImagenes",
                "Validado",
                "FechaValidado",
                "Procesado",
                "FechaProcesado",
                "Error",
            ],
            (err, archivoDB) => {
                if (err) return console.log(err);

                let doc, libro;
                doc = xlsx.utils.json_to_sheet(archivoDB);
                libro = xlsx.utils.book_new();
                xlsx.utils.book_append_sheet(libro, doc, "doc.xlsx");
                xlsx.writeFile(libro, `./archivosSICE.xlsx`);

                assert.strictEqual(err, null);
                assert.strictEqual(archivoDB);
                callback(archivoDB);
            }
        );
    };
    MongoClient.connect(
        "mongodb://pjcdmx:pjcdmx@127.0.0.1:27017/archivosSICE?authSource=admin", { useUnifiedTopology: true },
        // MongoClient.connect('mongodb://pjcdmx:pjcdmx@172.26.60.60:27017/archivosSICE', { useUnifiedTopology: true },
        async(err, res) => {

            moment.locale('es-mx')
            let yesterday = moment().subtract(1, 'days').format('L');


            if (err) throw err;
            console.log("BD ONLINE");

            const archivo = res.db("archivosSICE").collection("InfoFolio");

            // archivo.find({FechaProcesado: {$gte: fecha}}).toArray((err, cols) => {
            await archivo.find({ FechaProcesado: { $regex: { yesterday } } }).toArray((err, cols) => {
                // var folios = cols.map( el => {
                //     return { Folio: el.Folio, Tomo: el.Tomo, Toca: el.Toca,
                //         Concatenado: el.Tomo ? el.Folio + '-' + el.Tomo : el.Folio
                //     }
                // })

                var paquetes = cols.map((el) => {
                    return {
                        Paquete: el.Paquete,
                        Folio: el.Tomo ? el.Folio + "_Tomo-" + el.Tomo : el.Folio,
                    };
                });
                let doc, libro;
                doc = xlsx.utils.json_to_sheet(paquetes);
                libro = xlsx.utils.book_new();
                xlsx.utils.book_append_sheet(libro, doc, "doc.xlsx");
                xlsx.writeFile(libro, `./paquetes.xlsx`);
            });

            // archivo.find({}, ["Folio", "NombreArchivo", "NumeroDeImagenes", "Validado", "FechaValidado", "Procesado", "FechaProcesado", "Error"],
            // archivo.find({}, ["Folio"],
            // (err, archivoDB) => {
            //     if (err)
            //         return console.log(err);

            //     console.log(archivoDB)
            //     let doc, libro;
            //     doc = xlsx.utils.json_to_sheet(archivoDB);
            //     libro = xlsx.utils.book_new();
            //     xlsx.utils.book_append_sheet(libro, doc, "doc.xlsx");
            //     xlsx.writeFile(libro, `./archivosSICE.xlsx`);

            //     assert.strictEqual(err, null);
            //     assert.strictEqual(archivoDB)
            //     callback(archivoDB)
            // })

            // res.InfoFolio.find({}, (err, docs) => {
            //     if(err)
            //         return console.log('Error', err)
            //     console.log('Hecho. Sustituir por excel')
            // })

            // findDocuments(res, (err, archivoDB) => {
            //     db.close();
            //     console.log('Hecho')
            // })
        }
    );
};

const sendEmail = () => {
    const today = new Date();
    const send = require("gmail-send")({
        user: "alfredo.jl323@gmail.com",
        pass: "Everybody56.",
        to: "camiloces543@gmail.com",
        subject: "Prueba-mesta",
        text: `Buenos días.
Adjunto archivo excel de folios subidos el día ${today.toISOString().slice(0, 10)}.
Saludos.`,
        files: ['./paquetes.xlsx'],
    });
    send()
        .then((res, full) => console.log(res))
        .catch(err => console.log(err));
};

// getPaquetes();

// sendEmail();

const pruebaFecha = () => {
    const moment = require('moment')
    var today = new Date();
    var yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);

    moment.locale('es-mx')
    console.log(typeof moment().subtract(1, 'days').format('L'));
}

const exec = async() => {
    await getPaquetes();
    await sendEmail();
}