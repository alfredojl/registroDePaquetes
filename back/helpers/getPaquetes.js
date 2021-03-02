const MongoClient = require("mongodb").MongoClient,
    assert = require("assert");
const xlsx = require("xlsx");

// const lista = require('./listaFactura.json');
    const name = 'registro02-03';

const moment = require('moment');
moment.locale('es-mx')
const yesterday = moment().subtract(1, 'days').format('DD/MM/YYYY');
const cron = require('node-cron');

const getPaquetes = async() => {
    MongoClient.connect('mongodb://production:production$@172.26.60.61:27017/registro?authSource=admin', { useUnifiedTopology: true },
    // MongoClient.connect('mongodb://pjcdmx:pjcdmx@172.26.60.60:27017/archivosSICE?authSource=admin', { useUnifiedTopology: true },
    async(err, res) => {


        let regex = '03-02-2021';

            if (err) throw err;
            console.log("BD ONLINE");

            const archivo = res.db("registro").collection("paquetes");

            // archivo.find({FechaProcesado: {$gte: fecha}}).toArray((err, cols) => {
            // await archivo.find({ FechaProcesado: { $regex: yesterday  } }).toArray((err, cols) => {
            // await archivo.find({ FechaProcesado: {$regex: regex}, Error: false}).sort({ Folio: 1, Tomo: 1 }).toArray(async(err, cols) => {
            // await archivo.find({ Procesado: true, Error: false, FechaProcesado: {$regex: '29/12/2020'} }).sort({Folio: 1, Tomo: 1}).toArray(async(err, cols) => {
            await archivo.find({ fechaAlta: {$gte: new Date(regex), $lte: new Date(regex + ' 23:59:59')} }).sort({noPaquete: 1}).toArray(async(err, cols) => {
            // await archivo.find({ $or: [ 
            //     { FechaProcesado: { $regex: '26/12/2020' }},
            //     { FechaProcesado: { $regex: '29/12/2020' }}
            // ]}).sort({ Folio: 1, Tomo: 1 }).toArray(async(err, cols) => {
                // var folios = cols.map( el => {
                //     return { Folio: el.Folio, Tomo: el.Tomo, Toca: el.Toca,
                //         Concatenado: el.Tomo ? el.Folio + '-' + el.Tomo : el.Folio
                //     }
                // })
                var paquetes = cols.map((el) => {
                    return {
                        Paquete: el.noPaquete,
                        "Folio inicio": el.folioInicio,
                        "Folio fin": el.folioFin,
                        "Fecha expediente": moment(el.fechaExpediente).format('L')
                        // Expediente: el.Expediente,
                        // Toca: el.Toca,
                        // "Fecha de procesado": el.FechaProcesado ? el.FechaProcesado.slice(0,10) : 'Sin fecha'
                    };
                });

                // total = await archivo.aggregate([
                //         // { $match: { FechaProcesado: {$regex: '06/01/2021'}, Error: false } },
                //         { $match: { Procesado: true, Error: true } },
                //         { $group: { _id: "", tot: { $sum: "$NumeroImagenes" } } }
                //     ]).toArray();
                    
                //     paquetes.push({ Paquete: "Número total de imágenes:", "Número de imágenes": total[0].tot })
                //     console.log(total[0].tot, paquetes.length)
                    
                    let doc, libro;
                    doc = xlsx.utils.json_to_sheet(paquetes);
                    libro = xlsx.utils.book_new();
                    xlsx.utils.book_append_sheet(libro, doc, "Hoja 1");
                    xlsx.writeFile(libro, `./${name}.csv`);
                    // xlsx.writeFile(libro, `./paquetes${moment().subtract(1, 'days').format('DD-MM-YYYY')}.xlsx`);
                    // xlsx.writeFile(libro, `./z${regex.slice(0, 2)}.csv`);
                    // console.log(`[paquetes${moment().subtract(1, 'days').format('DD-MM-YYYY')}.xlsx] created.`)
                    // console.log(`[z${regex.slice(0, 2)}.csv] created.`)
                    console.log(`[${name}.csv] created.`)
                });

        }
    );
};

getPaquetes();