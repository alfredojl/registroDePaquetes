const fs = require('fs');
const ruta = "/home/alima/Documents/Prueba"
const getFolio = require('./getFolio');
const path = require('path');
const sube = require('./subeSICE');

let data = [];
const getList = async() => {
    var archs = fs.readdirSync(ruta);
    // async(err, archs) => {
    // if (err)
    //     return console.log("¡Error!", err);
    archs = archs.filter(el => path.parse(path.join(ruta, el)).ext == '.pdf')
    if (archs.length == 0)
        return console.log('Nada por procesar');
    else {
        console.log(`Procesando ${archs.length}`);
    }

    for (file of archs) {
        let imp = folio = tomo = direc = base = null;
        folio = path.parse(path.join(ruta, file)).name.split('_')[0];
        tomo = path.parse(path.join(ruta, file)).name.split('_')[1] || null;
        imp = await getFolio(folio, tomo);
        direc = path.parse(path.join(ruta, file)).dir;
        base = path.parse(path.join(ruta, file)).base;
        imp = imp.toJSON();
        imp.path = path.join(direc, base);
        imp.archivo = base;
        imp = JSON.stringify(imp);
        imp = JSON.parse(imp);
        // imp = JSON.parse(imp)
        // console.log(imp);
        data.push(imp);
    }

    // process.exit();

    // })
    sube(data);
    // console.log(data);
};

getList();