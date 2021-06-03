const path = require("path");
const xlsx = require("xlsx");
const fs = require("fs");
const os = require("os");

const getList = () => {
    const ruta = path.join(os.homedir(), 'SICE')
    let list = fs.readdirSync(ruta);
    list = list.filter(el => path.parse(path.join(ruta, el)).ext == '.pdf');
    let final = list.map(el => {
        return {
            name: el
        }
    });
    // console.log(list);
    // console.log(final);
    let doc, libro;
    doc = xlsx.utils.json_to_sheet(final);
    libro = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(libro, doc, 'listaSICEBillie');
    xlsx.writeFile(libro, `./listaSICEBillie.xlsx`);
    console.log('Excel created');
    process.exit();
}

getList();