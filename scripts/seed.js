// data/ klasöründeki JSON dosyalarını örnek verilerle sıfırlar: npm run seed
const store = require('../src/utils/jsonStore');

const now = new Date().toISOString();
const stamp = (item) => ({ ...item, createdAt: now, updatedAt: now });

const users = [
  { id: 1, name: 'Ayşe Yılmaz', email: 'ayse@taskflow.dev', role: 'developer' },
  { id: 2, name: 'Mehmet Kaya', email: 'mehmet@taskflow.dev', role: 'designer' },
  { id: 3, name: 'Zeynep Demir', email: 'zeynep@taskflow.dev', role: 'manager' },
].map(stamp);

const projects = [
  { id: 1, name: 'Mobil Uygulama v2', description: 'Müşteri mobil uygulamasının yeni sürümü', status: 'active' },
  { id: 2, name: 'Kurumsal Web Sitesi', description: 'Şirket web sitesinin yenilenmesi', status: 'active' },
].map(stamp);

const tasks = [
  {
    id: 1,
    title: 'Giriş ekranı tasarımı',
    description: 'Login ve kayıt ekranlarının arayüz tasarımı',
    status: 'in_progress',
    priority: 'high',
    assigneeId: 2,
    projectId: 1,
    dueDate: '2026-10-15',
  },
  {
    id: 2,
    title: 'Kimlik doğrulama servisi',
    description: 'Mobil uygulama için login API entegrasyonu',
    status: 'todo',
    priority: 'high',
    assigneeId: 1,
    projectId: 1,
    dueDate: '2026-10-20',
  },
  {
    id: 3,
    title: 'Sprint planlama toplantısı',
    description: 'Web sitesi projesi için ilk sprint planı',
    status: 'done',
    priority: 'medium',
    assigneeId: 3,
    projectId: 2,
    dueDate: '2026-10-03',
  },
  {
    id: 4,
    title: 'Footer bileşeni',
    description: 'Web sitesi alt bilgi alanı',
    status: 'todo',
    priority: 'low',
    assigneeId: null,
    projectId: 2,
    dueDate: null,
  },
].map(stamp);

(async () => {
  await store.users.writeAll(users);
  await store.projects.writeAll(projects);
  await store.tasks.writeAll(tasks);
  console.log(`Örnek veriler yüklendi: ${users.length} çalışan, ${projects.length} proje, ${tasks.length} görev`);
})();
