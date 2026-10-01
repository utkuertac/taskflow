module.exports = (req, res) => {
  res.status(404).json({ error: `Endpoint bulunamadı: ${req.method} ${req.originalUrl}` });
};
