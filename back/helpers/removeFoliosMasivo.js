const Folio = require("../server/models/Folios");
const mongoose = require("mongoose");
const config = require("./procesoSICE/config");
const fs = require("fs");
const path = require("path");
const { parse } = require("querystring");

const removeFolios = async () => {
  await mongoose
    .connect(
      "mongodb://production:production$@172.26.60.61:27017/registro?authSource=admin",
      {
        // 'mongodb://localhost:27017/registro', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        // useFindAndModify: false,
      }
      // (err, res) => {
      //   if (err) throw err;
      //   console.log("Mongo connected...");
      // }
    )
    .then(async () => {
      console.log("Mongo connected...");
      let lista = fs.readFileSync(
        path.resolve("reporteDuplicados.csv"),
        "utf-8"
      );
      lista = lista.split(/\r?\n/);
      lista = lista.splice(0, lista.length - 1);
      let foliosDuplicated = [],
        foliosUnique = [],
        foliosDeleted = [],
        foliosToCreate = [],
        countDu = 0,
        countUnique = 0,
        countDel = 0;
      for (el of lista) {
        let folio = el.split(",");
        let tomo = folio[1] ? folio[1].split(" ")[1] : null;
        folio = folio[0];
        folio = parseInt(folio) || 0;
        // console.log({
        //   folio,
        //   tomo,
        // });
        await Folio.find({ folio, tomo }).then(async (folioDB) => {
          if (folioDB.length > 1) {
            foliosDuplicated.push(folioDB);
            countDu++;
          } else if (folioDB.length == 1) {
            foliosUnique.push(folioDB);
            countUnique++;
            return;
          } else {
            foliosToCreate.push({ folio, tomo });
            return;
          }
          if (folioDB[0].dependencia) {
            let folioDeleted = await Folio.findByIdAndDelete(folioDB[1]._id);
            foliosDeleted.push(folioDeleted);
            countDel++;
          } else {
            let folioDeleted = await Folio.findByIdAndDelete(folioDB[0]._id);
            foliosDeleted.push(folioDeleted);
            countDel++;
          }
          console.log(folioDB[0].procesado ? true : false);
        });
      }
      console.log("Dup:\t", countDu);
      console.log("Unique:\t", countUnique);
      console.log(foliosToCreate.length, foliosToCreate);
      // console.log(foliosDuplicated.map((el) => el));
    })
    .catch((err) => {
      console.log(err);
    });
};

removeFolios();
