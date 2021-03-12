const MongoClient = require("mongodb").MongoClient,
    assert = require("assert");
const xlsx = require("xlsx");
const cron = require('node-cron')

const moment = require('moment');
moment.locale('es-mx')

// const lunes = new Date(moment().subtract(7, 'days').hours(0).minutes(0).seconds(0).format());
// const domingo = new Date(moment().subtract(1, 'days').hours(23).minutes(59).seconds(59).format());
const yesterdayL = new Date(moment().subtract(1, 'days').hours(23).minutes(59).seconds(59).format());
const yesterdayF = new Date(moment().subtract(1, 'days').hours(0).minutes(0).seconds(0).format());

// console.log(lunes, domingo);

const getPaquetes = async() => {
    MongoClient.connect('mongodb://production:production$@172.26.60.61:27017/registro?authSource=admin', { useUnifiedTopology: true },
        // MongoClient.connect('mongodb://pjcdmx:pjcdmx@172.26.60.60:27017/archivosSICE?authSource=admin', { useUnifiedTopology: true },
        async(err, res) => {
            if (err) throw err;
            console.log("BD ONLINE");

            const archivo = res.db("registro").collection("folios");

            // archivo.find({FechaProcesado: {$gte: fecha}}).toArray((err, cols) => {
            // await archivo.find({ FechaProcesado: { $regex: yesterday } }).toArray((err, cols) => {
            await archivo.find({ procesado: {$lte: yesterdayL, $gte: yesterdayF}}).sort({ folio: 1, tomo: 1}).toArray(async(err, cols) => {
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
                let total = await archivo.aggregate([
                    { $match: { procesado: {$lte: yesterdayL, $gte: yesterdayF } } },
                    { $group: { _id: '', tot: { $sum: "$numeroImagenes" } } }
                ]).toArray();
                if(total.length == 0)
                    total = [ {0: 0, tot: 0 } ];
                paquetes.push({
                    Paquete: 'Total:',
                    Imgs: total[0].tot
                })
                // console.log(total);
                let doc, libro;
                doc = xlsx.utils.json_to_sheet(paquetes);
                libro = xlsx.utils.book_new();
                xlsx.utils.book_append_sheet(libro, doc, "");
                console.log('Hecho.');
                xlsx.writeFile(libro, `./paquetes${moment(yesterdayF).format('DD-MM')}.xlsx`);
                console.log(`[paquetes${moment(yesterdayF).format('DD-MM')}.xlsx] created.`)
            });

        }
    );
};

const sendEmail = () => {
    const users = [
        // 'alfredo.jl323@gmail.com',
        'jose.jimenez@developmentsh.com',
        'lupita.cruz@tsjcdmx.gob.mx',
        'cristian.camilo@developmentsh.com',
        'nahin.delfin@gonet.us',
        'karen.pineda@developmentsh.com'
    ];

    const send = require("gmail-send")({
        user: "alfredo.jl323@gmail.com",
        pass: "Everybody56.",
        subject: `Reporte de folios subidos a SICE ${moment(yesterdayF).format('L')}.`,
        text: `Buenos días.
Adjunto archivo excel de folios subidos el día ${moment(yesterdayF).format('LL')}.
Saludos.`,
        files: [`./paquetes${moment(yesterdayF).format('DD-MM')}.xlsx`],
    });

    // users.forEach(el => {
        send({
                to: users
            })
            .then((res, full) => {
                console.log(`Email to '${users.join(', ')}' sent succesfully.`)
            })
            .catch(err => console.log(err));
    // });

};

getPaquetes();

sendEmail();

// const exec = async() => {
//     getPaquetes();
//     sendEmail();
//     process.exit();
// }

// exec();