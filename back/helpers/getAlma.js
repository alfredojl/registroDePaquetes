const mongoose = require('mongoose');
const xlsx = require('xlsx');
const moment = require('moment');
const Folio = require('../server/models/Folios');
const mariadb = require("mariadb");

const list = require('./alma05-09_04.json');


const getAlma = async() => {
    await mariadb.createConnection({
        host: '10.17.5.40',
        user: 'proveedor',
        password: '$354m0.1',
        database: 'documentos'
    })
    .then(async(res) => {
        console.log('Conectado...');
        let lunes = moment().subtract(8, 'days').format('DD-MM')
        let martes = moment().subtract(4, 'days').format('DD-MM')

        await res.query('SELECT C24 Paquete, C22 Folio, C25 Tomo, C23 Expediente, C29 Toca, C11242 "# Imágenes" FROM T15 WHERE Usuario = "Development S&H" AND C22 IN (?) ORDER BY C22, C25;', [list])
        .then(consult => {
            consult.forEach(el => {
                el.Paquete = el.Paquete ? el.Paquete : 'N/A';
            })
            // console.log(consult);
            let doc, libro;
            doc = xlsx.utils.json_to_sheet(consult);
            libro = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(libro, doc, "Hoja 1");
            xlsx.writeFile(libro, `./foliosPrueba${lunes}_${martes}.xlsx`)
            console.log(`[ foliosPrueba${lunes}_${martes}.xlsx ] created.`)    
        })
    })
//     await mongoose.connect(
//   "mongodb://production:production$@172.26.60.61:27017/registro?authSource=admin", {
//     // "mongodb://localhost:27017/registro", {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             useCreateIndex: true,
//             useFindAndModify: false,
//         })
//         .then(() => console.log("BD ONLINE"))
//         .catch((err) => { throw new Error(err) });
//     moment.locale('es-mx');
//     console.log(lunes, martes);
//     await Folio.find({ folio: { $in: list } }, (err, foliosFinded) => {
//         if(err) throw new Error(err);
//         console.log('Cantidad folios encontrados: ', foliosFinded.length);
//         let folios = foliosFinded.map(el => {
//             return { 
//                 Paquete: el.noPaquete || 'N/A',
//                 Folio: el.folio,
//                 Tomo: el.tomo ? el.tomo : '',
//                 Expediente: el.expediente,
//                 Toca: el.toca,
//                 "# Imágenes": el.numeroImagenes
//             };
//         });
//         let doc, libro;
//         doc = xlsx.utils.json_to_sheet(folios);
//         libro = xlsx.utils.book_new();
//         xlsx.utils.book_append_sheet(libro, doc, "Hoja 1");
//         xlsx.writeFile(libro, `./folios${lunes}_${martes}.xlsx`)
//         console.log(`[ foliosUrgentes${lunes}_${martes}.xlsx ] created.`)
//     })
    // process.exit();
}

getAlma();