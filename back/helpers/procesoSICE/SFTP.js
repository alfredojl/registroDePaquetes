const client = require("ssh2-sftp-client");
const config = require('./config');
const fs = require('fs');
const colors = require('colors');
const symbols = require('log-symbols');

let dest = '/home/alima/Desktop/SFTPSimulado/'
let pathHecho = '/home/alima/Documents/Prueba/Hecho/'

const path = config.pathUpload;
const configSFTP = {
    host: config.hostSFTP,
    user: config.usernameSFTP,
    password: config.pwdSFTP
};

const subirSFTP = async(folio) => {
    console.log(symbols.info, `Subiendo a SFTP folio ${folio.folio}...`.cyan);
    // let sftp = new client();

    fs.copyFileSync(folio.path, dest + folio.Id + '.pdf');
    fs.renameSync(folio.path, pathHecho + folio.archivo);
    return console.log(symbols.success, '¡Subido!'.green);
    // return await sftp
    //     .connect(configSFTP)
    //     .then(() => {
    //         return sftp.list(path, /.pdf|.safe/);
    //     })
    //     .then(async(data) => {
    //         console.log('¡Subido a SFTP!');
    //         // data = data.map((el) => {
    //         //     // return {
    //         //     //     name: el.name.split('.')[0],
    //         //     //     size: el.size / (1024 * 1024),
    //         //     //     // type: el.type
    //         //     // }
    //         //     resSFTP.push(el.name.split(".")[0]);
    //         // });
    //         // let x = [];
    //         // let y = [];
    //         // data.forEach(el => {
    //         //     if (el.size > 100) {
    //         //         x.push(el.name)
    //         //         y.push({
    //         //             Id: el.name,
    //         //             Tamaño: el.size.toFixed(2)
    //         //         })
    //         //     }
    //         // });
    //         // await creaListas(x, y);
    //     })
    //     .then(() => {
    //         sftp.end();
    //     })
    //     .catch((err) => {
    //         console.error(err.message);
    //     });
};

module.exports = subirSFTP;