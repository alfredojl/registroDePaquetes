const fs = require('fs');
const path = require('path');
const os = require('os');
const getFolio = require('./getFolio');
const sube = require('./subeSICE');
const cron = require('node-cron');
const moment = require('moment');
const symbols = require('log-symbols');

const ruta = path.join(os.homedir(), "SICE");

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
        // archs = archs.slice(0,1);
        console.log(symbols.info, `Procesando ${archs.length} folios...`.bold.bgCyan);
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
        if(folio.length != 7){
            console.log(`Folio ${folio} ${tomo ? 'Tomo ' + tomo : ''} erróneo, no se va a procesar.`.bgRed);
            fs.appendFileSync(path.resolve(os.homedir(), 'LOG.txt'), `${folio} ${tomo ? 'Tomo ' + tomo : ''} folio erróneo, se moverá a la carpeta de 'Error'.\t\t [${moment().format('ddd, D MMM Y, HH:mm:ss')}]\n`, 'utf8')
            fs.renameSync(path.join(ruta, file), path.join(ruta, `Error/${file}`));
            fs.appendFileSync(path.resolve(os.homedir(), 'reporte.csv'), `${folio.folio},${folio.tomo ? folio.tomo : ''},${folio.numeroImagenes},false\n`);
        }
        else{
            imp = await getFolio(folio, tomo);
            if (imp.notProcess) {
                console.log(symbols.error, `Folio ${folio} ${tomo ? 'Tomo ' + tomo : ''} sin validar, no se va a procesar.`.bgRed);
                fs.renameSync(path.join(ruta, file), path.join(ruta, `NoProcesar/${file}`));
                fs.appendFileSync(path.resolve(os.homedir(), 'reporte.csv'), `${folio},${tomo ? tomo : ''},${nh},false\n`);
                fs.appendFileSync(path.resolve(os.homedir(), 'LOG.txt'), `${folio} ${tomo ? 'Tomo ' + tomo : ''} no validado, se moverá a la carpeta de 'NoProcesar.\t\t [${moment().format('ddd, D MMM Y, HH:mm:ss')}]\n`, 'utf8')
            } else if (imp.encontrado === false) {
                console.log(symbols.error, `Folio ${folio} ${tomo ? 'Tomo ' + tomo : ''} no encontrado en la base de datos. No se procesará.`.bgRed);
                fs.renameSync(path.join(ruta, file), path.join(ruta, `NoEncontrados/${file}`));
                fs.appendFileSync(path.resolve(os.homedir(), 'reporte.csv'), `${folio},${tomo ? tomo : ''},${nh},false\n`);
                fs.appendFileSync(path.resolve(os.homedir(), 'LOG.txt'), `${folio} ${tomo ? 'Tomo ' + tomo : ''} no validado, se moverá a la carpeta de 'NoProcesar'.\t\t [${moment().format('ddd, D MMM Y, HH:mm:ss')}]\n`, 'utf8')
            } else {
                direc = path.parse(path.join(ruta, file)).dir;
                base = path.parse(path.join(ruta, file)).base;
                imp.path = path.join(direc, base);
                imp.archivo = base;
                imp.numeroImagenes = nh;
                imp = JSON.stringify(imp);
                imp = JSON.parse(imp);
                // console.log(imp);
                data.push(imp);
        }
        }
    }

    // process.exit();

    // })
    await sube(data);
    // console.log(data);
    console.log(symbols.success, `Se procesaron ${data.length} archivos.`.bgGreen);
    data = [];
};

// const task = cron.schedule('0 19 * * *', async() => {
//     console.log(symbols.info, `Procesando... [${moment().format('HH:mm:ss')}]`.underline.cyan);
//     await getList();
//     console.log(symbols.info, `Terminado. Esperando siguiente ciclo... [${moment().format('HH:mm:ss')}]`.underline.cyan);
// })

// task.start()
getList();