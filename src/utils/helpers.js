// URL'deki :id değerini sayıya çevirir. Geçerli bir pozitif tam sayı değilse null döner.
function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// İstek gövdesinden yalnızca izin verilen alanları alır, diğerlerini yok sayar.
// (id, createdAt, updatedAt gibi sistem alanlarının istemci tarafından değiştirilmesini engeller.)
function pick(body, allowedFields) {
  const result = {};
  for (const field of allowedFields) {
    if (body && body[field] !== undefined) result[field] = body[field];
  }
  return result;
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim() !== '';
}

module.exports = { parseId, pick, isNonEmptyString };
