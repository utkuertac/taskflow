const fs = require('fs/promises');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');

// Oku-değiştir-yaz işlemleri aynı anda çalışırsa birbirinin yazdığını ezer.
// Tüm değişiklikler bu kuyrukta sırayla çalıştırılır (tek süreçli uygulama için yeterli).
let queue = Promise.resolve();
function withLock(fn) {
  const run = queue.then(fn, fn);
  queue = run.catch(() => {});
  return run;
}

// Her kaynak (tasks, users, projects) data/ altında kendi JSON dosyasında bir dizi olarak tutulur.
function createStore(name) {
  const filePath = path.join(DATA_DIR, `${name}.json`);

  async function readAll() {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (err) {
      // Dosya henüz yoksa boş liste ile başla
      if (err.code === 'ENOENT') return [];
      throw err;
    }
  }

  // Önce geçici dosyaya yazıp sonra yeniden adlandırır; böylece okuyanlar hiçbir zaman
  // yarım yazılmış bir dosya görmez ve yazma sırasında çökme dosyayı bozmaz.
  async function writeAll(items) {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const tempPath = `${filePath}.${process.pid}.tmp`;
    await fs.writeFile(tempPath, JSON.stringify(items, null, 2) + '\n');
    await fs.rename(tempPath, filePath);
  }

  async function findById(id) {
    const items = await readAll();
    return items.find((item) => item.id === id);
  }

  function insert(data) {
    return withLock(async () => {
      const items = await readAll();
      const nextId = items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
      const now = new Date().toISOString();
      const item = { id: nextId, ...data, createdAt: now, updatedAt: now };
      items.push(item);
      await writeAll(items);
      return item;
    });
  }

  function update(id, changes) {
    return withLock(async () => {
      const items = await readAll();
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) return null;
      items[index] = { ...items[index], ...changes, id, updatedAt: new Date().toISOString() };
      await writeAll(items);
      return items[index];
    });
  }

  // Koşula uyan tüm kayıtlara aynı değişikliği uygular, değişen kayıt sayısını döner.
  function updateWhere(predicate, changes) {
    return withLock(async () => {
      const items = await readAll();
      const now = new Date().toISOString();
      let count = 0;
      const updated = items.map((item) => {
        if (!predicate(item)) return item;
        count++;
        return { ...item, ...changes, updatedAt: now };
      });
      if (count > 0) await writeAll(updated);
      return count;
    });
  }

  function remove(id) {
    return withLock(async () => {
      const items = await readAll();
      const remaining = items.filter((item) => item.id !== id);
      if (remaining.length === items.length) return false;
      await writeAll(remaining);
      return true;
    });
  }

  return { readAll, writeAll, findById, insert, update, updateWhere, remove };
}

module.exports = {
  tasks: createStore('tasks'),
  users: createStore('users'),
  projects: createStore('projects'),
};
