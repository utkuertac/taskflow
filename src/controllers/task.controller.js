const store = require('../utils/jsonStore');
const { parseId, pick, isNonEmptyString } = require('../utils/helpers');

const STATUSES = ['todo', 'in_progress', 'done'];
const PRIORITIES = ['low', 'medium', 'high'];
const FIELDS = ['title', 'description', 'status', 'priority', 'assigneeId', 'projectId', 'dueDate'];

function isValidDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value);
  // 2026-02-31 gibi takvimde olmayan tarihleri de yakalar
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

// Hata varsa mesajını, yoksa null döner. Güncellemede yalnızca gönderilen alanlar kontrol edilir.
async function validate(data, isCreate) {
  if (isCreate || data.title !== undefined) {
    if (!isNonEmptyString(data.title)) return 'title alanı zorunludur';
  }
  if (data.description !== undefined && typeof data.description !== 'string') {
    return 'description metin olmalıdır';
  }
  if (data.status !== undefined && !STATUSES.includes(data.status)) {
    return `status şunlardan biri olmalıdır: ${STATUSES.join(', ')}`;
  }
  if (data.priority !== undefined && !PRIORITIES.includes(data.priority)) {
    return `priority şunlardan biri olmalıdır: ${PRIORITIES.join(', ')}`;
  }
  if (data.assigneeId !== undefined && data.assigneeId !== null) {
    if (!Number.isInteger(data.assigneeId)) return 'assigneeId sayı veya null olmalıdır';
    if (!(await store.users.findById(data.assigneeId))) {
      return `assigneeId ${data.assigneeId} olan çalışan bulunamadı`;
    }
  }
  if (data.projectId !== undefined && data.projectId !== null) {
    if (!Number.isInteger(data.projectId)) return 'projectId sayı veya null olmalıdır';
    if (!(await store.projects.findById(data.projectId))) {
      return `projectId ${data.projectId} olan proje bulunamadı`;
    }
  }
  if (data.dueDate !== undefined && data.dueDate !== null && !isValidDate(data.dueDate)) {
    return 'dueDate YYYY-AA-GG biçiminde geçerli bir tarih olmalıdır';
  }
  return null;
}

async function getAll(req, res) {
  const tasks = await store.tasks.readAll();
  res.json(tasks);
}

async function getById(req, res) {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Geçersiz görev id' });

  const task = await store.tasks.findById(id);
  if (!task) return res.status(404).json({ error: 'Görev bulunamadı' });

  res.json(task);
}

async function create(req, res) {
  const data = pick(req.body, FIELDS);
  const error = await validate(data, true);
  if (error) return res.status(400).json({ error });

  const task = await store.tasks.insert({
    title: data.title.trim(),
    description: data.description ?? '',
    status: data.status ?? 'todo',
    priority: data.priority ?? 'medium',
    assigneeId: data.assigneeId ?? null,
    projectId: data.projectId ?? null,
    dueDate: data.dueDate ?? null,
  });
  res.status(201).json(task);
}

async function update(req, res) {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Geçersiz görev id' });

  if (!(await store.tasks.findById(id))) {
    return res.status(404).json({ error: 'Görev bulunamadı' });
  }

  const changes = pick(req.body, FIELDS);
  if (Object.keys(changes).length === 0) {
    return res.status(400).json({ error: `Güncellenecek alan yok. Geçerli alanlar: ${FIELDS.join(', ')}` });
  }

  const error = await validate(changes, false);
  if (error) return res.status(400).json({ error });
  if (changes.title) changes.title = changes.title.trim();

  const task = await store.tasks.update(id, changes);
  res.json(task);
}

async function remove(req, res) {
  const id = parseId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Geçersiz görev id' });

  const deleted = await store.tasks.remove(id);
  if (!deleted) return res.status(404).json({ error: 'Görev bulunamadı' });

  res.status(204).end();
}

module.exports = { getAll, getById, create, update, remove };
