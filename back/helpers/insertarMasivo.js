const mongoose = require('mongoose');
const Folio = require('../server/models/Folios');
const Paquete = require('../server/models/Paquetes');
const xlsx = require('xlsx');

mongoose.connect(
    'mongodb://production:production$@172.26.60.61:27017/registro?authSource=admin', {
        // 'mongodb://localhost:27017/registro', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    },
    (err, res) => {
        if (err) throw err;
        console.log("Mongo connected...");
    }
);

const inserta = async() => {
    let workbook = xlsx.readFile('./Agregar.xlsx');
    let heads = workbook.SheetNames;
    let temp = xlsx.utils.sheet_to_json(workbook.Sheets[heads[0]], { skipHeader: false });
    var paquetes = [],
        errores = [],
        paquetesDB = [],
        foliosDB = [];
    temp.forEach(el => {
        let paquete = el.Paquete.split(' ')[0];
        let cantidad = el.Paquete.split(' ')[1].split('/')[1];
        let identificador = el.Paquete.split(' ')[1].split('/')[0];
        paquetes.push({
            noPaquete: paquete,
            identificador,
            cantidad,
            folioInicio: el.FolioInicio,
            folioFin: el.FolioFin,
            fechaExpediente: new Date(el.Fecha.split('/').reverse()),
            fechaAlta: new Date(),
            registrado: "Toño"
        });
    });
    for (element of paquetes) {
        // console.log(element);
        // for (let i = element.folioInicio; i <= element.folioFin; i++)
        await Paquete.create(element, async(err, paqueteDB) => {
            if (err) errores.push(err)
            console.log('¡Hecho! Paquete.');
            paquetesDB.push(paqueteDB);
            console.log({
                folio: paqueteDB.folioInicio,
                noPaquete: paqueteDB.noPaquete
            });
            await Folio.create({
                folio: paqueteDB.folioInicio,
                noPaquete: paqueteDB.noPaquete
            }, async(err, folioDB) => {
                if (err) errores.push(err)
                console.log('¡Hecho! Folio.');
                foliosDB.push(folioDB);
                console.log(folioDB);
            })
        })
    }
    // console.log(paquetesDB);
    // console.log(foliosDB);
}

inserta();