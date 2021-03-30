const fs = require('fs');
const path = require('path');
const os = require('os');
const cron = require('node-cron');
const moment = require('moment');
const client = require("ssh2-sftp-client");
const colors = require('colors');

const config = require('./config');
const ruta = path.resolve(os.homedir(), "SICE/reemplazarSFTP");

const configSFTP = {
    host: config.hostSFTP,
    user: config.usernameSFTP,
    password: config.pwdSFTP
};

const pathSFTP = '/HD4/repository7/documentos/digitalizacion/'

const reproceso = async() => {
    var archs = fs.readdirSync(ruta);
    let sftp = new client;

    await sftp.connect(configSFTP)
        .then(async() => {
            for (file of archs) {
                let folio = null,
                    tomo = null,
                    sep = null;
                sep = path.parse(path.join(ruta, file)).name.split('_');
                // console.log(file);
                folio = sep[0];
                if (sep.length === 2) {
                    tomo = sep[1];
                }
                console.log(`Subiendo ${file}: \t\t${folio} ${tomo ? 'Tomo ' + tomo : ''}`.cyan);
                await sftp.list(pathSFTP, 'pdf' || 'safe')
                    .then(() => console.log('¡Reemplazado!'.green))
            }
        })
        .then(() => sftp.end())
        .catch(err => console.log(err))

    // console.log(archs);
    // console.log(folio, tomo);
    // await sftp
    //     .connect(configSFTP)
    //     .then(async() => {
    //         return await sftp.list(pathSFTP, 'pdf' || 'safe')
    //     })
    //     .then(data => console.log(data.length))
    //     .then(() => sftp.end())
    //     .catch(err => console.log(err))
};

reproceso();