const store = require('../utils/jsonStore');
const { parseId, pick, isNonEmptyString } = require('../utils/helpers');

const STATUSES = ['active', 'completed', 'archived'];
const FIELDS = ['name', 'description', 'status'];

// Hata varsa mesajını, yoksa null döner. Güncellemede yalnızca gönderilen alanlar kontrol edilir.
function validate(data, isCreate) {
  if (isCreate || data.name !== undefined) {
    if (!isNonEmptyString(data.name)) return 'name alanı zorunludur';
  }
  if (data.description !== undefined && typeof data.description !== 'string') {
    return 'description metin olmalıdır';
  }
  if (data.status !== undefined && !STATUSES.includes(data.status)) {
    return `status şunlardan biri olmalıdır: ${STATUSES.join(', ')}`;
  }
  return null;
}

async function getAll(req, res) {
  const projects = await store.projects.readAll();
  res.json(projects);
}

async function getById(req, res) {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Geçersiz proje id' });

  const project = await store.projects.findById(id);
  if (!project) return res.status(404).json({ error: 'Proje bulunamadı' });

  res.json(project);
}

async function create(req, res) {
  const data = pick(req.body, FIELDS);
  const error = validate(data, true);
  if (error) return res.status(400).json({ error });

  const project = await store.projects.insert({
    name: data.name.trim(),
    description: data.description ?? '',
    status: data.status ?? 'active',
  });
  res.status(201).json(project);
}

async function update(req, res) {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Geçersiz proje id' });

  if (!(await store.projects.findById(id))) {
    return res.status(404).json({ error: 'Proje bulunamadı' });
  }

  const changes = pick(req.body, FIELDS);
  if (Object.keys(changes).length === 0) {
    return res.status(400).json({ error: `Güncellenecek alan yok. Geçerli alanlar: ${FIELDS.join(', ')}` });
  }

  const error = validate(changes, false);
  if (error) return res.status(400).json({ error });
  if (changes.name) changes.name = changes.name.trim();

  const project = await store.projects.update(id, changes);
  res.json(project);
}

async function remove(req, res) {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Geçersiz proje id' });

  const deleted = await store.projects.remove(id);
  if (!deleted) return res.status(404).json({ error: 'Proje bulunamadı' });

  // Silinen projeye bağlı görevler silinmez, proje bağlantıları kaldırılır
  await store.tasks.updateWhere((task) => task.projectId === id, { projectId: null });

  res.status(204).end();
}

module.exports = { getAll, getById, create, update, remove };
