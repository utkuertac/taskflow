const store = require('../utils/jsonStore');
const { parseId, pick, isNonEmptyString } = require('../utils/helpers');

const FIELDS = ['name', 'email', 'role'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Hata varsa { status, error }, yoksa null döner. Güncellemede yalnızca gönderilen alanlar kontrol edilir.
async function validate(data, isCreate, currentId = null) {
  if (isCreate || data.name !== undefined) {
    if (!isNonEmptyString(data.name)) return { status: 400, error: 'name alanı zorunludur' };
  }
  if (isCreate || data.email !== undefined) {
    if (typeof data.email !== 'string' || !EMAIL_PATTERN.test(data.email)) {
      return { status: 400, error: 'Geçerli bir email adresi zorunludur' };
    }
    const users = await store.users.readAll();
    const email = data.email.toLowerCase();
    if (users.some((user) => user.email === email && user.id !== currentId)) {
      return { status: 409, error: 'Bu email adresi ile kayıtlı bir çalışan zaten var' };
    }
  }
  if (data.role !== undefined && typeof data.role !== 'string') {
    return { status: 400, error: 'role metin olmalıdır' };
  }
  return null;
}

async function getAll(req, res) {
  const users = await store.users.readAll();
  res.json(users);
}

async function getById(req, res) {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Geçersiz çalışan id' });

  const user = await store.users.findById(id);
  if (!user) return res.status(404).json({ error: 'Çalışan bulunamadı' });

  res.json(user);
}

async function create(req, res) {
  const data = pick(req.body, FIELDS);
  const invalid = await validate(data, true);
  if (invalid) return res.status(invalid.status).json({ error: invalid.error });

  const user = await store.users.insert({
    name: data.name.trim(),
    email: data.email.toLowerCase(),
    role: data.role ?? 'developer',
  });
  res.status(201).json(user);
}

async function update(req, res) {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Geçersiz çalışan id' });

  if (!(await store.users.findById(id))) {
    return res.status(404).json({ error: 'Çalışan bulunamadı' });
  }

  const changes = pick(req.body, FIELDS);
  if (Object.keys(changes).length === 0) {
    return res.status(400).json({ error: `Güncellenecek alan yok. Geçerli alanlar: ${FIELDS.join(', ')}` });
  }

  const invalid = await validate(changes, false, id);
  if (invalid) return res.status(invalid.status).json({ error: invalid.error });
  if (changes.name) changes.name = changes.name.trim();
  if (changes.email) changes.email = changes.email.toLowerCase();

  const user = await store.users.update(id, changes);
  res.json(user);
}

async function remove(req, res) {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Geçersiz çalışan id' });

  const deleted = await store.users.remove(id);
  if (!deleted) return res.status(404).json({ error: 'Çalışan bulunamadı' });

  // Silinen çalışana atanmış görevler silinmez, atamaları kaldırılır
  await store.tasks.updateWhere((task) => task.assigneeId === id, { assigneeId: null });

  res.status(204).end();
}

module.exports = { getAll, getById, create, update, remove };
