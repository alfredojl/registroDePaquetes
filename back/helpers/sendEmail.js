const MongoClient = require("mongodb").MongoClient,
    assert = require("assert");
const xlsx = require("xlsx");

const moment = require('moment');
moment.locale('es-mx')

const lunes = new Date(moment().subtract(7, 'days').hours(0).minutes(0).seconds(0).format());
const domingo = new Date(moment().subtract(1, 'days').hours(23).minutes(59).seconds(59).format());

console.log(lunes, domingo);

const getPaquetes = async() => {
    MongoClient.connect('mongodb://production:production$@172.26.60.61:27017/registro?authSource=admin', { useUnifiedTopology: true },
        // MongoClient.connect('mongodb://pjcdmx:pjcdmx@172.26.60.60:27017/archivosSICE?authSource=admin', { useUnifiedTopology: true },
        async(err, res) => {
            if (err) throw err;
            console.log("BD ONLINE");

            const archivo = res.db("registro").collection("folios");

            // archivo.find({FechaProcesado: {$gte: fecha}}).toArray((err, cols) => {
            // await archivo.find({ FechaProcesado: { $regex: yesterday } }).toArray((err, cols) => {
            await archivo.find({ procesado: {$lte: domingo, $gte: lunes}}).toArray((err, cols) => {
                // var folios = cols.map( el => {
                //     return { Folio: el.Folio, Tomo: el.Tomo, Toca: el.Toca,
                //         Concatenado: el.Tomo ? el.Folio + '-' + el.Tomo : el.Folio
                //     }
                // })

                var paquetes = cols.map((el) => {
                    return {
                        Paquete: el.noPaquete,
                        Folio: el.folio,
                        Tomo: el.tomo,
                        Expediente: el.expediente,
                        Toca: el.toca,
                        Imgs: el.numeroImagenes
                    };
                });
                // console.log(paquetes);
                let doc, libro;
                doc = xlsx.utils.json_to_sheet(paquetes);
                libro = xlsx.utils.book_new();
                xlsx.utils.book_append_sheet(libro, doc, "");
                xlsx.writeFile(libro, `PTEF.xlsx`);
                console.log('Hecho.');
                xlsx.writeFile(libro, `./paquetes${moment(lunes).format('DD-MM') + '_' + moment(domingo).format('DD-MM')}.xlsx`);
                console.log(`[paquetes${moment(lunes).format('DD-MM-YYYY') + '_' + moment(domingo).format('DD-MM')}.xlsx] created.`)
            });

        }
    );
};

const sendEmail = () => {
    const users = [
        // 'alfredo.jl323@gmail.com',
        // 'lupita.cruz@tsjcdmx.gob.mx',
        'nahin.delfin@gonet.us',
        'karen.pineda@developmentsh.com'
    ];

    const send = require("gmail-send")({
        user: "alfredo.jl323@gmail.com",
        pass: "Everybody56.",
        // to: "lupita.cruz@tsjcdmx.gob.mx",
        subject: `Reporte de folios subidos a SICE.`,
        text: `Buenos días.
Adjunto archivo excel de folios subidos en el periodo comprendido por los días ${moment(lunes).format('LL')} y ${moment(domingo).format('LL')}.
Saludos.`,
        files: [`./paquetes${moment(lunes).format('DD-MM') + '_' + moment(domingo).format('DD-MM')}.xlsx`],
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

sendEmail();

// const exec = async() => {
//     getPaquetes();
//     sendEmail();
//     console.log('hoal')
//     process.exit();
// }

// exec();