const xlsx = require("xlsx");
const colors = require("colors");

const compara = () => {
    let karen = xlsx.readFile("./reporteKaren.xlsx");
    let junio = xlsx.readFile("./reporteJunio.xlsx");
    let sice = xlsx.readFile("./reporteSICE.xlsx");
    let headsKaren = karen.SheetNames;
    let headsJunio = junio.SheetNames;
    let headsSICE = sice.SheetNames;

    sice = xlsx.utils.sheet_to_json(sice.Sheets[headsSICE[0]], {
        skipHeader: true
    });

    karen = xlsx.utils.sheet_to_json(karen.Sheets[headsKaren[0]], {
        skipHeader: true
    });

    junio = xlsx.utils.sheet_to_json(junio.Sheets[headsJunio[0]], {
        skipHeader: true
    });

    let karenFolios = karen.map(el => {
        return el.Folio;
    })

    let junioFolios = junio.map(el => {
        return el.Folio;
    })

    let folios = [...karenFolios, ...junioFolios]

    let resultado = sice.filter(el => {
        return !folios.includes(el.Folio)
    });
    // let resultado = sice.map(el => {
    //     if (folios.includes(el.Folio))
    //         console.log('Este ya estaba...'.cyan)
    //     else {
    //         console.log('Este no estaba...'.red)
    //         return {
    //             Paquete: el.Paquete,
    //             Folio: el.Folio,
    //             Tomo: el.Tomo,
    //             'Imágenes': el.Imágenes
    //         };
    //     }
    // })

    let doc, libro;
    doc = xlsx.utils.json_to_sheet(resultado);
    libro = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(libro, doc, "Hoja 1");
    xlsx.writeFile(libro, `./siceSinKarenYJunio.xlsx`);
    console.log(`[ siceSinKarenYJunio ] created.`);

    // console.log(folios)
    // karen.slice(0, 5).forEach(el => {
    //     console.log('karen', el)
    // });
    // junio.slice(0, 5).forEach(el => {
    //     console.log('junio', el)
    // })
};

compara();