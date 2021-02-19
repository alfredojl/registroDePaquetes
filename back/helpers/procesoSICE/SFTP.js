const client = require("ssh2-sftp-client");
const config = require('./config');
const fs = require('fs');
const path = require('path');
const os = require('os');
const moment = require('moment');
const colors = require('colors');
const symbols = require('log-symbols');
const { CLIENT_RENEG_LIMIT } = require("tls");

let dest = path.resolve(os.homedir(), 'Desktop/SFTPSimulado');
let pathHecho = path.resolve(os.homedir(), 'SICE/Hecho/');
moment.locale('es-mx');
// const path = config.pathUpload;
const configSFTP = {
    host: config.hostSFTP,
    user: config.usernameSFTP,
    password: config.pwdSFTP
};

const subirSFTP = async(folio) => {
    let sftp = new client;
    console.log(symbols.info, `Subiendo a SFTP folio ${folio.folio}...`.cyan);
    // let sftp = new client();

    // fs.copyFileSync(folio.path, dest + '/' + folio.Id + '.pdf');
    return await sftp
    .connect(configSFTP)
    .then(async() => {
        // console.log(folio.path, config.pathUpload + folio.Id + '.pdf')
        await sftp.put(folio.path, config.pathUpload + folio.Id + '.pdf');
    })
    .then(async(data) => {
        console.log('¡Subido a SFTP!');
        fs.renameSync(folio.path, pathHecho + '/' + folio.archivo);
        fs.appendFileSync(path.resolve(os.homedir(), 'LOG.txt'), ` Subido correctamente a servidor SFTP.\t\t [${moment().format('ddd, D MMM Y, HH:mm:ss')}]\n`, 'utf8')
        return console.log(symbols.success, '¡Subido!'.green);
    })
    .then(() => {
        sftp.end();
    })
    .catch((err) => {
        fs.appendFileSync(path.resolve(os.homedir(), 'LOG.txt'), ` No logró subir a servidor SFTP. Error: ${err.message}\t [${moment().format('ddd, D MMM Y, HH:mm:ss')}]\n`, 'utf8')
            console.error(err.message);
        });
};

module.exports = subirSFTP;