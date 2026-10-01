# Taskflow — Proje Tanıtım Dokümanı

**Görev ve Proje Yönetim Sistemi API'si**
Node.js ile Backend Programlama — Bitirme Projesi

## 1. Projenin Amacı

Taskflow, bir yazılım şirketinin ekip içindeki görevleri, projeleri ve çalışanların sorumluluklarını takip edebilmesi için geliştirilmiş bir **REST API**'dir. Proje, eğitim süresince öğrenilen Node.js, Express.js, routing, middleware, CRUD operasyonları ve JSON veri yönetimi konularını gerçek hayata yakın bir senaryo üzerinde uygulamalı olarak göstermeyi amaçlar.

## 2. Senaryo

Orta ölçekli bir yazılım şirketinde birden fazla proje aynı anda yürütülmektedir. Proje yöneticileri:

- her proje için görevler oluşturmak,
- bu görevleri ekipteki çalışanlara atamak,
- görevlerin hangi aşamada olduğunu (yapılacak / devam ediyor / tamamlandı) takip etmek,
- görevleri önem derecesine göre önceliklendirmek

istemektedir. Bugüne kadar bu takip tablolar ve mesajlaşma uygulamaları üzerinden yapıldığı için bilgi dağınık kalmaktadır. Taskflow, bu bilgileri tek bir merkezde toplayan ve web, mobil ya da masaüstü herhangi bir istemcinin kullanabileceği bir API sunar.

## 3. Temel Sistem Özellikleri

| Özellik | Açıklama |
|---|---|
| Görev yönetimi | Görev ekleme, listeleme, detay görüntüleme, güncelleme ve silme (CRUD) |
| Görev atama | Her görev bir çalışana atanabilir (`assigneeId`) |
| Durum takibi | Görev durumu: `todo` → `in_progress` → `done` |
| Öncelik yönetimi | Görev önceliği: `low`, `medium`, `high` |
| Çalışan yönetimi | Çalışanlar için CRUD işlemleri |
| Proje yönetimi | Projeler için CRUD işlemleri, görevlerin projelere bağlanması (`projectId`) |
| İstek kaydı (Logger) | Her API isteğinin method, endpoint ve zaman damgası bilgisiyle konsola ve log dosyasına yazılması |
| Kalıcı veri | Veriler JSON dosyalarında saklanır, sunucu yeniden başlatıldığında kaybolmaz |

## 4. Kullanılan Teknolojiler

- **Node.js**: JavaScript çalışma ortamı
- **Express.js**: HTTP sunucusu ve routing
- **fs/promises**: JSON dosyalarına okuma/yazma
- **Postman**: API testleri

## 5. Kapsam Dışı

Bu sürümde kimlik doğrulama (login/JWT), yetkilendirme, veritabanı ve kullanıcı arayüzü bulunmamaktadır. Sistem yalnızca bir backend API olarak tasarlanmıştır.

## 6. İlgili Dokümanlar

- [Veri Modeli Tasarımı](02-veri-modeli.md)
- [API Tasarım Dokümanı](03-api-tasarim.md)
- [Kurulum Notu (README)](../README.md)
