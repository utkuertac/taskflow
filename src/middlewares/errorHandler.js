// Express, 4 parametreli middleware'i hata yakalayıcı olarak tanır
module.exports = (err, req, res, next) => {
  // express.json() bozuk JSON gövdesinde 400 durumlu bir hata fırlatır
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Geçersiz JSON gövdesi' });
  }

  // express.json() gövde 100 KB'tan büyükse 413 fırlatır
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'İstek gövdesi çok büyük' });
  }

  // Diğer istemci hataları (ör. desteklenmeyen karakter kodlaması) kendi durum koduyla döner
  if (err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ error: 'Geçersiz istek' });
  }

  console.error(err);
  res.status(500).json({ error: 'Sunucu hatası' });
};
