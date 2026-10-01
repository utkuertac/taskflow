# Taskflow — API Tasarım Dokümanı

## Genel Bilgiler

| | |
|---|---|
| Temel URL | `http://localhost:3000/api` |
| Veri formatı | JSON (`Content-Type: application/json`) |
| Mimari | REST: kaynak odaklı URL'ler, HTTP metotları ile işlem |

## Mimari

İstek, uygulama içinde katmanlar halinde ilerler:

```
İstek → Logger middleware → Router → Controller → JSON veri katmanı (data/*.json)
                                         ↓
                                      Yanıt (JSON)
```

| Katman | Klasör | Görevi |
|---|---|---|
| Middleware | `src/middlewares/` | Her isteği loglar, bulunamayan adresler ve hatalar için yanıt üretir |
| Routes | `src/routes/` | URL ve HTTP metodunu ilgili controller fonksiyonuna bağlar |
| Controllers | `src/controllers/` | İsteği işler, kontrolleri yapar, yanıtı döner |
| Veri katmanı | `src/utils/jsonStore.js` | JSON dosyalarını okur ve yazar |

## Endpoint Listesi

### Görevler (Tasks)

| Metot | Endpoint | Açıklama | Başarılı yanıt |
|---|---|---|---|
| `GET` | `/api/tasks` | Tüm görevleri listeler | `200` |
| `GET` | `/api/tasks/:id` | Belirli bir görevin detayını getirir | `200` |
| `POST` | `/api/tasks` | Yeni görev oluşturur | `201` |
| `PUT` | `/api/tasks/:id` | Görevi günceller (gönderilen alanlar değişir) | `200` |
| `DELETE` | `/api/tasks/:id` | Görevi siler | `204` |

### Çalışanlar (Users)

| Metot | Endpoint | Açıklama | Başarılı yanıt |
|---|---|---|---|
| `GET` | `/api/users` | Tüm çalışanları listeler | `200` |
| `GET` | `/api/users/:id` | Çalışan detayını getirir | `200` |
| `POST` | `/api/users` | Yeni çalışan ekler | `201` |
| `PUT` | `/api/users/:id` | Çalışan bilgilerini günceller | `200` |
| `DELETE` | `/api/users/:id` | Çalışanı siler, görevlerindeki atamayı kaldırır | `204` |

### Projeler (Projects)

| Metot | Endpoint | Açıklama | Başarılı yanıt |
|---|---|---|---|
| `GET` | `/api/projects` | Tüm projeleri listeler | `200` |
| `GET` | `/api/projects/:id` | Proje detayını getirir | `200` |
| `POST` | `/api/projects` | Yeni proje oluşturur | `201` |
| `PUT` | `/api/projects/:id` | Proje bilgilerini günceller | `200` |
| `DELETE` | `/api/projects/:id` | Projeyi siler, görevlerdeki proje bağlantısını kaldırır | `204` |

## Örnek İstekler

### Görev oluşturma

```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Giriş ekranı tasarımı",
  "description": "Login ve kayıt ekranlarının arayüz tasarımı",
  "priority": "high",
  "assigneeId": 1,
  "projectId": 1,
  "dueDate": "2026-10-15"
}
```

Yanıt `201 Created`:

```json
{
  "id": 1,
  "title": "Giriş ekranı tasarımı",
  "description": "Login ve kayıt ekranlarının arayüz tasarımı",
  "status": "todo",
  "priority": "high",
  "assigneeId": 1,
  "projectId": 1,
  "dueDate": "2026-10-15",
  "createdAt": "2026-10-01T09:00:00.000Z",
  "updatedAt": "2026-10-01T09:00:00.000Z"
}
```

### Görev durumunu güncelleme

```http
PUT /api/tasks/1
Content-Type: application/json

{ "status": "in_progress" }
```

Yanıt `200 OK`: güncellenmiş görev nesnesi.

## Hata Yanıtları

Tüm hatalar aynı biçimde döner:

```json
{ "error": "Görev bulunamadı" }
```

| Kod | Ne zaman |
|---|---|
| `400 Bad Request` | Geçersiz `id` (ör. `/api/tasks/abc`), zorunlu alan eksik, geçersiz `status`/`priority` değeri, var olmayan `assigneeId`/`projectId` |
| `404 Not Found` | İstenen `id` ile kayıt yok veya endpoint tanımlı değil |
| `409 Conflict` | Aynı e-posta ile ikinci bir çalışan eklenmeye çalışıldı |
| `500 Internal Server Error` | Beklenmeyen sunucu hatası |

## Logger Middleware

Her istek, yanıt tamamlandığında aşağıdaki biçimde hem konsola hem de `logs/requests.log` dosyasına yazılır:

```
[2026-10-01T09:00:00.000Z] POST /api/tasks 201 - 12ms
```

| Alan | Açıklama |
|---|---|
| Zaman damgası | İsteğin geldiği an (ISO 8601) |
| Method | `GET`, `POST`, `PUT`, `DELETE` |
| Endpoint | İstenen URL |
| Durum kodu | Dönen HTTP kodu |
| Süre | İsteğin işlenme süresi |
