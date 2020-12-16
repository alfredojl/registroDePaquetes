const MongoClient = require("mongodb").MongoClient,
    assert = require("assert");
const xlsx = require("xlsx");

const moment = require('moment');
const { arch } = require("os");
const yesterday = moment().subtract(1, 'days').format('DD/MM/YYYY');

const getPaquetes = async() => {
    MongoClient.connect('mongodb://pjcdmx:pjcdmx@172.26.60.60:27017/archivosSICE?authSource=admin', { useUnifiedTopology: true },
        // MongoClient.connect('mongodb://pjcdmx:pjcdmx@172.26.60.60:27017/archivosSICE?authSource=admin', { useUnifiedTopology: true },
        async(err, res) => {


            moment.locale('es-mx')


            if (err) throw err;
            console.log("BD ONLINE");

            const archivo = res.db("archivosSICE").collection("InfoFolio");

            // archivo.find({FechaProcesado: {$gte: fecha}}).toArray((err, cols) => {
            // await archivo.find({ FechaProcesado: { $regex: yesterday } }).toArray((err, cols) => {
            await archivo.find({ Procesado: false, Error: true }).toArray((err, cols) => {
                // var folios = cols.map( el => {
                //     return { Folio: el.Folio, Tomo: el.Tomo, Toca: el.Toca,
                //         Concatenado: el.Tomo ? el.Folio + '-' + el.Tomo : el.Folio
                //     }
                // })

                var paquetes = cols.map((el) => {
                    return {
                        Paquete: el.Paquete,
                        Folio: el.Tomo ? el.Folio + "_Tomo-" + el.Tomo : el.Folio,
                        Expediente: el.Expediente,
                        Toca: el.Toca
                    };
                });
                let doc, libro;
                doc = xlsx.utils.json_to_sheet(paquetes);
                libro = xlsx.utils.book_new();
                xlsx.utils.book_append_sheet(libro, doc, "doc.xlsx");
                xlsx.writeFile(libro, `PTEF.xlsx`);
                console.log('Hecho.');
                // xlsx.writeFile(libro, `./paquetes${moment().subtract(1, 'days').format('DD-MM-YYYY')}.xlsx`);
                // console.log(`[paquetes${moment().subtract(1, 'days').format('DD-MM-YYYY')}.xlsx] created.`)
            });

        }
    );
};

const sendEmail = () => {
    const users = [
        // 'alfredo.jl323@gmail.com',
        // 'lupita.cruz@tsjcdmx.gob.mx',
        'nahin.delfin@gonet.us'
    ];

    const send = require("gmail-send")({
        user: "alfredo.jl323@gmail.com",
        pass: "Everybody56.",
        // to: "lupita.cruz@tsjcdmx.gob.mx",
        subject: `Reporte de folios subidos el día ${yesterday}.`,
        text: `Buenos días.
Adjunto archivo excel de folios subidos el día ${yesterday}.
Saludos.`,
        files: [`./paquetes${moment().subtract(1, 'days').format('DD-MM-YYYY')}.xlsx`],
    });

    users.forEach(el => {
        send({
                to: el
            })
            .then((res, full) => {
                console.log(`Email to ${el} sent succesfully.`)
            })
            .catch(err => console.log(err));
    });

};

getPaquetes();

// sendEmail();

// const exec = async() => {
//     getPaquetes();
//     sendEmail();
//     console.log('hoal')
//     process.exit();
// }

// exec();