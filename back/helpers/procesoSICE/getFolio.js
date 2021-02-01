const Folio = require("../../server/models/Folios");
const mongoose = require("mongoose");
const { json } = require("body-parser");
require("../../server/config/config");
mongoose.connect(
    "mongodb://billie:adminMongo$@172.26.60.61:27017/registro?authSource=admin", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    },
    (err, res) => {
        if (err) throw err;
        console.log("Pruebita getFolio...");
    }
);


const getFolio = async(folio, tomo) => {

    // if (tomo)
    tomo = JSON.parse(tomo);
    await Folio.findOne({ folio, tomo })
        .then(consult => {
            console.log(consult || 'No se pudo obtener información del folio');
        })
        // await Folio.findOne({ folio })
        //     .then(consult => {
        //         console.log(consult);
        //     })
};

module.exports = getFolio;