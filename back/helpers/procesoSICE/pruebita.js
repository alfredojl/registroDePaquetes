const fs = require('fs');
const path = "/home/alima/Documents"
const getFolio = require('./getFolio');

const getList = async() => {
    fs.readdir(path, async(err, archs) => {
        if (err)
            return console.log("¡Error!", err);
        let nameArchivos = archs.filter(el => el.split('.')[1] == 'txt')
        let folios = nameArchivos.map((el, index) => { return [el.split('_')[0], el.split('_')[1].split('.')[0], index] });
        for (folio of folios) {
            console.log(folio);
            await getFolio(folio[0], folio[1]);
        }
        process.exit();
    })
};

getList();