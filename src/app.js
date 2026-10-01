const express = require('express');
const routes = require('./routes');
const logger = require('./middlewares/logger');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Yanıtlarda kullanılan framework'ü (X-Powered-By: Express) ifşa etme
app.disable('x-powered-by');

// En başta olmalı: bozuk JSON ve 404 dahil tüm istekler loglansın
app.use(logger);

// Gelen JSON gövdelerini req.body içine çevirir
app.use(express.json());

app.use('/api', routes);

// Hiçbir route eşleşmezse 404, bir hata fırlatılırsa 500 döner
app.use(notFound);
app.use(errorHandler);

module.exports = app;
