const Folio = require("../../server/models/Folios");
const moment = require('moment');
const path = require('path');
const os = require('os');
const fs = require('fs');
const mongoose = require("mongoose");
require("../../server/config/config");
mongoose.connect(
    'mongodb://production:production$@172.26.60.61:27017/registro?authSource=admin', {
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

moment.locale('es-mx');

const getFolio = async(folio, tomo) => {

    // if (tomo)
    return await Folio.find({ folio, tomo })
        .then(consult => {
            if(consult.length > 1) {
                fs.appendFileSync(path.resolve('reporteDuplicados.csv'), `${folio},${tomo ? 'Tomo ' + tomo : ''}\n`, 'utf8')
                consult[0] = {}
                consult[0].notProcess = true;
                return consult[0];
            } else {
                if (consult.length == 0){
                    fs.appendFileSync(path.resolve(os.homedir(), 'LOG.txt'), `${folio} ${tomo ? 'Tomo ' + tomo : ''} no se encontró en la BD de registro.\t [${moment().format('ddd, D MMM Y, HH:mm:ss')}]\n`, 'utf8')
                    consult[0] = {}
                    consult[0].encontrado = false;
                    return consult[0];
                } else if (consult[0] && !consult[0].rep && consult[0].validado === true && consult[0].procesado !== false) {
                    return consult[0]
                } else {
                    consult[0] = {}
                    consult[0].notProcess = true;
                    return consult[0];
                }
        }
        })
        // await Folio.findOne({ folio })
        //     .then(consult[0] => {
        //         console.log(consult[0]);
        //     })
};

// getFolio(6090323, null);

module.exports = getFolio;