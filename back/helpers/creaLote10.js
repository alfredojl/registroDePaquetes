const mongoose = require("mongoose");
const xlsx = require("xlsx");
const moment = require("moment");
const Folio = require("../server/models/Folios");
const Paquete = require("../server/models/Paquetes");
const colors = require("colors");
const axios = require("axios");
const fs = require("fs");

const lote = async () => {
    try {
        let bd = await mongoose.connect(
            "mongodb://production:production$@172.26.60.61:27017/registro?authSource=admin", {
            // "mongodb://localhost:27017/registro", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        }
        );
        console.log("Mongo connected...");
        // const lote10 = require("./lote10.json");
        // * Crea a partir de lista Paquete-FolioInicio-FolioFin
        let lote10 = xlsx.readFile('./lote10.xlsx');
        let heads = lote10.SheetNames;
        let temp = xlsx.utils.sheet_to_json(lote10.Sheets[heads[0]], {
            skipHeader: false,
        });
        temp.forEach(el => el.Paquete = parseInt(el.Paquete));
        let index = 0;
        for (el of temp) {
            console.log(colors.magenta.underline(el.FolioInicio), colors.magenta.underline(el.FolioFin))
            for (let i = el.FolioInicio; i <= el.FolioFin; i++, ++index) {
                let folioFinded = await Folio.find({ folio: i });
                if (folioFinded.length == 0) {
                    console.log('Not finded. Searching...'.red.underline);
                    let f = {};
                    let m = await axios.get(
                        "http://digitalizacion.pjcdmx.gob.mx/consulta_folio.php",
                        {
                            params: {
                                f: i,
                            },
                        }
                    );
                    // await Folio.create({})
                    if (m.data.encontrado) {
                        f.folio = i;
                        f.expediente = m.data.expediente;
                        f.noPaquete = el.Paquete || null;
                        f.juzgado = m.data.juzgado;
                        f.instanciaJ = m.data.insJuz;
                        f.instanciaS = m.data.insSal;
                        f.dependencia = m.data.dependencia;
                        f.toca = m.data.toca;
                        f.actor = m.data.actor;
                        f.demandado = m.data.demandado;
                        f.juicio = m.data.juicio;
                        f.sala = m.data.Sala;
                        f.observaciones = null;
                        f.validado = true;
                    }
                    console.log('Creating...')
                    await Folio.create(f)
                    console.log('Created succesfully.')
                    console.log(f)
                }
                else {
                    console.log(`Folio ${i} finded.`.green);
                    console.log(colors.cyan(folioFinded.length));
                }
            }
        }
        // * * * * * * * * * * * * * * FIN * * * * * * * *

        // * Verifica que esté en Lote 10 lista con lista.
        // let lote10 = xlsx.readFile('./lote10.xlsx');
        // let heads = lote10.SheetNames;
        // let temp = xlsx.utils.sheet_to_json(lote10.Sheets[heads[0]], {
        //     skipHeader: false,
        // });
        // let lote10pdf = xlsx.readFile('./lote10WPDF.xlsx');
        // let heads2 = lote10pdf.SheetNames;
        // let temp2 = xlsx.utils.sheet_to_json(lote10pdf.Sheets[heads2[0]], {
        //     skipHeader: false,
        // });
        // temp2.forEach(el => {
        //     el.PDF = el.PDF.slice(0, el.PDF.indexOf('.pdf'));
        // })
        // let folios = temp2.map(el => {
        //     let partes = el.PDF.split('_');
        //     return {
        //         folio: parseInt(partes[0]),
        //         tomo: parseInt(partes[1]) || null
        //     }
        // })
        // let foliosSinTomo = folios.map(el => el.folio);
        // foliosSinTomo = [...new Set(foliosSinTomo)];
        // let index = 0;
        // temp.forEach(el => {
        //     for(let i = el.FolioInicio; i < el.FolioFin; i++) {
        //         if(foliosSinTomo.includes(i))
        //             console.log(++index,`\t${i} Sí está.\t${el.Paquete}`.green);
        //         else
        //             console.log(++index,`\t${i} No está.\t${el.Paquete}`.red)
        //     }
        // })
        // * * * * * * * * * * FIN * * * * * *

        // * Crea los folios en BD a partir de archivos.pdf
        // let lote10 = xlsx.readFile('./lote10WPDF.xlsx');
        // let heads = lote10.SheetNames;
        // let temp = xlsx.utils.sheet_to_json(lote10.Sheets[heads[0]], {
        //     skipHeader: false,
        // });
        // temp.forEach(el => {
        //     el.PDF = el.PDF.slice(0, el.PDF.indexOf('.pdf'));
        // })
        // let folios = temp.map(el => {
        //     let partes = el.PDF.split('_');
        //     if(partes.length > 2)
        //         return {
        //             folio: parseInt(partes[0]),
        //             tomo: parseInt(partes[1]) || null
        //         }
        //     else
        //         return {
        //             folio: parseInt(partes[0]),
        //             tomo: null
        //         }
        // })
        // for(var [index, el] of folios.entries()) {
        //     let folioFinded = await Folio.find({ folio: el.folio, tomo: el.tomo })
        //     if(folioFinded.length > 0)
        //     console.log(index, 'Finded.'.green, el.folio, el.tomo);
        //     else{
        //         console.log('Not finded.'.red, el.folio, el.tomo)
        //         folioFinded = await Folio.find({ folio: el.folio, tomo: null })

        //         let newFolio = {};
        //         newFolio.folio = el.folio;
        //         newFolio.tomo = el.tomo;
        //         newFolio.expediente = folioFinded[0].expediente;
        //         newFolio.noPaquete = folioFinded[0].noPaquete;
        //         newFolio.bis = folioFinded[0].bis;
        //         newFolio.juzgado = folioFinded[0].juzgado;
        //         newFolio.instanciaJ = folioFinded[0].instanciaJ;
        //         newFolio.instanciaS = folioFinded[0].instanciaS;
        //         newFolio.dependencia = folioFinded[0].dependencia;
        //         newFolio.toca = folioFinded[0].toca;
        //         newFolio.actor = folioFinded[0].actor;
        //         newFolio.demandado = folioFinded[0].demandado;
        //         newFolio.juicio = folioFinded[0].juicio;
        //         newFolio.sala = folioFinded[0].sala;
        //         newFolio.observaciones = folioFinded[0].observaciones;
        //         newFolio.validado = folioFinded[0].validado;
        //         await Folio.create(newFolio);
        //         folioFinded = await Folio.find({ folio: el.folio, tomo: el.tomo })
        //         if(folioFinded.length > 0)
        //             console.log('Creado!'.cyan)
        //     }
        // }
        // // console.log(folios)
        // * * * * * * * * * * * FIN * * * * * *
        process.exit();
    } catch (e) {
        console.log(e);
    }
    process.exit();
};

lote();