const fs = require('fs');
const ruta = "/home/alima/Documents/Prueba"
const getFolio = require('./getFolio');
const path = require('path');
const sube = require('./subeSICE');
const cron = require('node-cron');
const moment = require('moment');
const symbols = require('log-symbols');

let data = [];
const getList = async() => {
    var archs = fs.readdirSync(ruta);
    // async(err, archs) => {
    // if (err)
    //     return console.log("¡Error!", err);
    archs = archs.filter(el => path.parse(path.join(ruta, el)).ext == '.pdf')
    if (archs.length == 0)
        return console.log(symbols.info, 'Nada por procesar'.bold.cyan);
    else {
        console.log(symbols.info, `Procesando ${archs.length}`.bold.bgCyan);
    }

    for (file of archs) {
        let imp = folio = tomo = direc = base = sep = nh = null;
        sep = path.parse(path.join(ruta, file)).name.split('_');
        folio = sep[0];
        if (sep.length === 3) {
            tomo = sep[1];
            nh = sep[2]
        } else {
            nh = sep[1]
        }
        imp = await getFolio(folio, tomo);
        direc = path.parse(path.join(ruta, file)).dir;
        base = path.parse(path.join(ruta, file)).base;
        imp = imp.toJSON();
        imp.path = path.join(direc, base);
        imp.archivo = base;
        imp.numeroImagenes = nh;
        imp = JSON.stringify(imp);
        imp = JSON.parse(imp);
        // console.log(imp);
        data.push(imp);
    }

    // process.exit();

    // })
    sube(data);
    // console.log(data);
    console.log(symbols.success, 'Se procesaron', data.length, ' archivos.'.bgGreen);
    data = [];
};

const task = cron.schedule('*/1 * * * *', async() => {
    console.log(symbols.info, `Procesando... [${moment().format('hh:mm:ss')}]`.italic.underline.cyan);
    await getList();
    console.log(symbols.info, `Terminado. Esperando siguiente ciclo... [${moment().format('hh:mm:ss')}]`.italic.underline.cyan);
})

task.start()