const fs = require('fs');
const ruta = "/home/alima/Documents/Prueba"
const getFolio = require('./getFolio');
const path = require('path');

const getList = async() => {
    fs.readdir(ruta, async(err, archs) => {
        if (err)
            return console.log("¡Error!", err);
        if (archs.length == 0)
            return console.log('Nada por procesar');
        else {
            console.log(`Procesando ${archs.length}`);
        }
        console.log(archs);

        // let nameArchivos = archs.filter(el => el.split('.')[1] == 'txt')
        // let folios = nameArchivos.map((el, index) => {
        //     return [el.split('_')[0], el.split('_')[1].split('.')[0], index]
        // });
        // for (folio of folios) {
        //     console.log(folio);
        //     await getFolio(folio[0], folio[1]);
        // }
        process.exit();
    })
};

getList();