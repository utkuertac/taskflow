# Taskflow — Veri Modeli Tasarımı

Sistemde üç temel varlık vardır: **Çalışan (User)**, **Proje (Project)** ve **Görev (Task)**. Her varlık `data/` klasöründe kendi JSON dosyasında bir dizi olarak saklanır.

```
data/
├── users.json
├── projects.json
└── tasks.json
```

## İlişkiler

```
User (1) ─────< (N) Task (N) >───── (1) Project
       assigneeId          projectId
```

- Bir çalışana birden fazla görev atanabilir. Bir görevin en fazla bir sorumlusu olur.
- Bir projede birden fazla görev olabilir. Bir görev en fazla bir projeye bağlıdır.
- `assigneeId` ve `projectId` alanları isteğe bağlıdır (`null` olabilir). Böylece henüz atanmamış ya da bir projeye bağlı olmayan görevler de oluşturulabilir.

## 1. User (Çalışan)

| Alan | Tip | Zorunlu | Açıklama |
|---|---|---|---|
| `id` | number | otomatik | Benzersiz kimlik, sistem tarafından verilir |
| `name` | string | evet | Ad soyad |
| `email` | string | evet | E-posta adresi, benzersiz olmalı |
| `role` | string | hayır | Ekipteki rolü (ör. `developer`, `designer`, `manager`) |
| `createdAt` | string (ISO 8601) | otomatik | Oluşturulma zamanı |
| `updatedAt` | string (ISO 8601) | otomatik | Son güncelleme zamanı |

```json
{
  "id": 1,
  "name": "Ayşe Yılmaz",
  "email": "ayse@taskflow.dev",
  "role": "developer",
  "createdAt": "2026-10-01T09:00:00.000Z",
  "updatedAt": "2026-10-01T09:00:00.000Z"
}
```

## 2. Project (Proje)

| Alan | Tip | Zorunlu | Açıklama |
|---|---|---|---|
| `id` | number | otomatik | Benzersiz kimlik |
| `name` | string | evet | Proje adı |
| `description` | string | hayır | Proje açıklaması |
| `status` | string | hayır | `active` (varsayılan), `completed`, `archived` |
| `createdAt` | string (ISO 8601) | otomatik | Oluşturulma zamanı |
| `updatedAt` | string (ISO 8601) | otomatik | Son güncelleme zamanı |

```json
{
  "id": 1,
  "name": "Mobil Uygulama v2",
  "description": "Müşteri mobil uygulamasının yeni sürümü",
  "status": "active",
  "createdAt": "2026-10-01T09:00:00.000Z",
  "updatedAt": "2026-10-01T09:00:00.000Z"
}
```

## 3. Task (Görev)

| Alan | Tip | Zorunlu | Açıklama |
|---|---|---|---|
| `id` | number | otomatik | Benzersiz kimlik |
| `title` | string | evet | Görev başlığı |
| `description` | string | hayır | Görev açıklaması |
| `status` | string | hayır | `todo` (varsayılan), `in_progress`, `done` |
| `priority` | string | hayır | `low`, `medium` (varsayılan), `high` |
| `assigneeId` | number \| null | hayır | Görevin atandığı çalışanın `id` değeri |
| `projectId` | number \| null | hayır | Görevin bağlı olduğu projenin `id` değeri |
| `dueDate` | string (YYYY-MM-DD) \| null | hayır | Teslim tarihi |
| `createdAt` | string (ISO 8601) | otomatik | Oluşturulma zamanı |
| `updatedAt` | string (ISO 8601) | otomatik | Son güncelleme zamanı |

```json
{
  "id": 1,
  "title": "Giriş ekranı tasarımı",
  "description": "Login ve kayıt ekranlarının arayüz tasarımı",
  "status": "in_progress",
  "priority": "high",
  "assigneeId": 1,
  "projectId": 1,
  "dueDate": "2026-10-15",
  "createdAt": "2026-10-01T09:00:00.000Z",
  "updatedAt": "2026-10-02T14:30:00.000Z"
}
```

## Kurallar

- **ID üretimi:** Yeni kaydın `id` değeri, dosyadaki en büyük `id` + 1 olarak belirlenir.
- **Zaman damgaları:** `createdAt` ve `updatedAt` alanlarını sistem yönetir. İstemciden gelen değerler dikkate alınmaz.
- **İlişki kontrolü:** Görev oluşturulurken veya güncellenirken verilen `assigneeId` ve `projectId` değerlerinin karşılığı olan bir kayıt bulunmalıdır. Bulunmazsa istek `400` ile reddedilir.
- **Silme davranışı:** Bir çalışan veya proje silindiğinde ona bağlı görevler silinmez. Bu görevlerin `assigneeId` / `projectId` alanı `null` yapılır.
