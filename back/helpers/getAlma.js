const mongoose = require('mongoose');
const xlsx = require('xlsx');
const moment = require('moment');
const Folio = require('../server/models/Folios');

const list = require('./alma05-09_04.json');


const getAlma = async() => {
    await mongoose.connect(
        "mongodb://localhost:27017/registro", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        })
        .then(() => console.log("BD ONLINE"))
        .catch((err) => { throw new Error(err) });
    moment.locale('es-mx');
    let lunes = moment().subtract(7, 'days').format('DD-MM')
    let martes = moment().subtract(3, 'days').format('DD-MM')
    console.log(lunes, martes);
    await Folio.find({ folio: { $in: list } }, (err, foliosFinded) => {
        if(err) throw new Error(err);
        let folios = foliosFinded.map(el => {
            return { 
                Folio: el.folio,
                Tomo: el.tomo ? el.tomo : '',
                Expediente: el.expediente,
                Toca: el.toca,
                "# Imágenes": el.numeroImagenes
            };
        });
        let doc, libro;
        doc = xlsx.utils.json_to_sheet(folios);
        libro = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(libro, doc, "Hoja 1");
        xlsx.writeFile(libro, `./folios${lunes}_${martes}.xlsx`)
        console.log(`[ folios${lunes}_${martes}.xlsx ] created.`)
    })
    // process.exit();
}

getAlma();