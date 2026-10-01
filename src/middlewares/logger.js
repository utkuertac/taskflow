const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '..', '..', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'requests.log');

fs.mkdirSync(LOG_DIR, { recursive: true });

// Her isteği method, endpoint ve zaman damgası ile konsola ve logs/requests.log dosyasına yazar.
// Durum kodu yanıt gönderildiğinde belli olduğu için kayıt 'finish' olayında yapılır.
function logger(req, res, next) {
  const timestamp = new Date().toISOString();
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const line = `[${timestamp}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

    console.log(line);
    fs.appendFile(LOG_FILE, line + '\n', (err) => {
      if (err) console.error('Log dosyasına yazılamadı:', err.message);
    });
  });

  next();
}

module.exports = logger;
