const xlsx = require("xlsx");
const colors = require("colors");

const compara = () => {
    let todo = xlsx.readFile("./reporteTodoGT.xlsx");
    // let karen = xlsx.readFile("./reporteKaren.xlsx");
    // let junio = xlsx.readFile("./reporteJunio.xlsx");
    // let julio = xlsx.readFile("./reporteJulio.xlsx");
    // let agosto = xlsx.readFile("./reporteAgosto.xlsx");
    let sice = xlsx.readFile("./reporteSICE.xlsx");
    // let validados = xlsx.readFile("./validados.xls");
    let todoHeads = todo.SheetNames;
    // let headsKaren = karen.SheetNames;
    // let headsJunio = junio.SheetNames;
    // let headsJulio = julio.SheetNames;
    // let headsAgosto = agosto.SheetNames;
    let headsSICE = sice.SheetNames;
    // let headsValidados = validados.SheetNames;

    sice = xlsx.utils.sheet_to_json(sice.Sheets[headsSICE[0]], {
        skipHeader: true
    });

    let mayo = xlsx.utils.sheet_to_json(todo.Sheets[todoHeads[0]], {
        skipHeader: true
    });

    let junio = xlsx.utils.sheet_to_json(todo.Sheets[todoHeads[1]], {
        skipHeader: true
    });

    let julio = xlsx.utils.sheet_to_json(todo.Sheets[todoHeads[2]], {
        skipHeader: true
    });

    let agosto = xlsx.utils.sheet_to_json(todo.Sheets[todoHeads[3]], {
        skipHeader: true
    });

    mayo = mayo.map(el => {
        return el.Folio;
    });
    junio = junio.map(el => {
        return el.Folio;
    });
    julio = julio.map(el => {
        return el.Folio;
    });
    agosto = agosto.map(el => {
        return el.Folio;
    });
    // karen = xlsx.utils.sheet_to_json(karen.Sheets[headsKaren[0]], {
    //     skipHeader: true
    // });

    // junio = xlsx.utils.sheet_to_json(junio.Sheets[headsJunio[0]], {
    //     skipHeader: true
    // });

    // julio = xlsx.utils.sheet_to_json(julio.Sheets[headsJulio[0]], {
    //     skipHeader: true
    // });

    // agosto = xlsx.utils.sheet_to_json(agosto.Sheets[headsAgosto[0]], {
    //     skipHeader: true
    // });


    // validados = xlsx.utils.sheet_to_json(validados.Sheets[headsValidados[0]], {
    //     skipHeader: true
    // });

    // let karenFolios = karen.map(el => {
    //     return el.Folio;
    // });

    // let junioFolios = junio.map(el => {
    //     return el.Folio;
    // });

    // let julioFolios = julio.map(el => {
    //     return el.Folio;
    // });

    // let agostoFolios = agosto.map(el => {
    //     return el.Folio;
    // });

    let folios = [ ...new Set(mayo), ...new Set(junio), ...new Set(julio), ...new Set(agosto) ];

    // let resultado = sice.filter(el => {
    //     return !folios.includes(el.Folio)
    // });
    
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

    // let doc, libro;
    // doc = xlsx.utils.json_to_sheet(resultado);
    // libro = xlsx.utils.book_new();
    // xlsx.utils.book_append_sheet(libro, doc, "Hoja 1");
    // xlsx.writeFile(libro, `./paraOctubre.xlsx`);
    // console.log(`[ paraOctubre ] created.`);

    // console.log(folios)
    // karen.slice(0, 5).forEach(el => {
    //     console.log('karen', el)
    // });
    // junio.slice(0, 5).forEach(el => {
    //     console.log('junio', el)
    // })
};

compara();