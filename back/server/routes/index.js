const express = require('express');

const app = express();

app.use(require('./usuario'));
app.use(require('./Folios'));
app.use(require('./Paquetes'));
app.use(require('./Preparadores'));
app.use(require('./Digitalizadores'));
app.use(require('./Estados'));
app.use(require('./Verificadores'));
app.use(require('./Lotes'));
app.use(require('./reporte'));

module.exports = app;