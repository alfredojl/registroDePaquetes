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
    return await Folio.findOne({ folio, tomo })
        .then(consult => {
            if (consult && !consult.rep && consult.validado === true && consult.procesado !== false)
                return consult
            else if (!consult) {
                fs.appendFileSync(path.resolve(os.homedir(), 'LOG.txt'), `${folio} ${tomo ? 'Tomo ' + tomo : ''} no se encontró en la BD de registro.\t [${moment().format('ddd, D MMM Y, HH:mm:ss')}]\n`, 'utf8')
                consult = {}
                consult.encontrado = false;
                return consult;
            } else {
                consult = {}
                consult.notProcess = true;
                return consult;
            }
        })
        // await Folio.findOne({ folio })
        //     .then(consult => {
        //         console.log(consult);
        //     })
};

// getFolio(6090323, null);

module.exports = getFolio;