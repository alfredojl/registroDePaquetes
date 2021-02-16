const Folio = require("../../server/models/Folios");
const fs = require('fs');
const mongoose = require("mongoose");
require("../../server/config/config");
mongoose.connect(
    "mongodb://localhost:27017/registro", {
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


const getFolio = async(folio, tomo) => {

    // if (tomo)
    return await Folio.findOne({ folio, tomo })
        .then(consult => {
            if (consult && !consult.rep && consult.validado === true && !consult.procesado)
                return consult
            else if (!consult) {
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