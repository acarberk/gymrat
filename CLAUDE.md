# Gymrat — CLAUDE.md

Bu dosya Claude Code'un proje hafizasidir. Her oturumda otomatik okunur.

---

## Proje Vizyonu

**Gymrat**, beslenme ve antrenmanı tek profilde birleştiren PWA. MyFitnessPal +
Hevy boşluğunu doldurur — paywall yok, reklam yok, veri satışı yok.

**Neden "Gymrat"?**

- Salon ratları kültürüne selam — disiplinli, takipçi, geliştiren
- Tek platform: makro + workout (tek seçen rakip yok, MFP nutrition only, Hevy workout only)
- Türk yemekleri curated DB — rakiplerde ya yok ya hatalı (lahmacun "5 portion" gibi)

**Temel fark yaratacak özellikler:**

- Beslenme + workout tek profilde — MFP nutrition only, Hevy workout only
- Türk yemekleri doğru — curated database, kullanıcı katkısı, OFF entegrasyonu
- Free tier'da barkod + makro + program şablonu — rakipler bunu paywalled yaptı
- Cross-domain gamification — makro hedef tutturma + workout streak = retention
- PWA-first — Android/iOS native app store şartı yok, telefonda install + offline
- Türkçe dil desteği — 80M Türk pazarında hiçbir global rakipte yetkin TR yok

**Domain Modülleri (Faz bazlı):**

- **Faz 1 (MVP):** Beslenme + workout temel takip — pazardaki gap noktası
- **Faz 2:** Progress grafikleri + body weight log + ek programlar (5/3/1, SL5x5, GZCLP)
- **Faz 3:** "Bugün ne yiyeyim/çalışayım" rule-based öneriler, sosyal feed
- **Faz 4:** Cardio (Strava-lite), su takibi, uyku, akıllı saat entegrasyonu
- **Faz 5:** AI-destekli yemek tarifi + program kişiselleştirme

**Multi-domain Rakip Haritası:**

| Domain      | Lider        | Kullanıcı | Eksik                                                    |
| ----------- | ------------ | --------- | -------------------------------------------------------- |
| Beslenme    | MyFitnessPal | 200M+     | 2024'te barkod paywalled, TR yemek hatalı, workout zayıf |
| Workout     | Hevy         | 5M+       | Beslenme yok, gamification minimal                       |
| Tek pakette | Yok          | —         | **Gymrat'ın fırsatı**                                    |

---

## Tech Stack

### Frontend

- **Next.js 16 + React 19**
- App Router + Server Components ile az client JS
- PWA: manifest + service worker (next-pwa veya custom Workbox)
- React Native ile mobil geçiş kolaylığı (Faz 5+)
- **Data Fetching:** TanStack Query (cache, retry, optimistic)
- **State:** Zustand (minimal, Provider-free)
- **Forms:** React Hook Form + Zod (zodResolver)
- **Validation:** Zod (BE ile shared schema)

### Backend

- **NestJS 11 + TypeScript + Fastify adapter**
- Full-stack TypeScript (shared types with FE)
- Modüler: Guard, Interceptor, Pipe, Filter
- Built-in WebSocket (gamification real-time)
- Bull Queue (gelecekte: Open Food Facts cache refresh, ek API sync'ler)
- Swagger/OpenAPI otomatik docs (@nestjs/swagger)
- Test: Jest + Supertest + DI mock
- **Validation:** Zod (FE ile shared)
- **Logging:** Pino (Fastify native, JSON log)
- **Config:** @nestjs/config + Zod env validation

### Veritabanı

- **PostgreSQL** — Ana DB (ilişkisel + JSONB esnek metadata)
- **Redis** — Cache, session, leaderboard (sorted sets), Bull Queue, Pub/Sub

### Deployment

- **Vercel** — Next.js frontend (free tier, git push = deploy)
- **Railway** — NestJS + PostgreSQL + Redis (~$5-15/ay)

### Auth

- **JWT + Passport.js** — Access (15dk) + Refresh (rotation, httpOnly cookie)
- OAuth: Google, Apple (Steam yok — bizim domain'imiz değil)
- NestJS Guard sistemi ile route bazlı yetkilendirme
- **Bot koruma:** Cloudflare Turnstile (kayıt + login + şifre sıfırlama)

### Mobil

- MVP kapsamında değil. PWA install yeterli. İleride React Native + Expo (Faz 5+)

### Styling

- **Tailwind CSS 4 + shadcn/ui** — Utility-first + erişilebilir Radix UI base
- Dark/light mode default

### ORM

- **Prisma** — Type-safe, otomatik migration, Prisma Studio

### Test

- **Backend:** Jest + Supertest — her modül unit + integration
- **Frontend:** Vitest + Testing Library — hook + component
- **Shared:** Zod şema unit testleri
- **E2E:** Playwright — kritik akışlar (register → onboarding → ilk öğün + workout)
- Strateji: Kapsamlı — ~%70 coverage hedefi

### Monorepo

- **pnpm + Turborepo** — Workspace + cache + paralel task
- Yapı: `apps/` (web, api) + `packages/` (shared, ui, config)

### Git & CI/CD

- **Branching:** Trunk-Based Development (kısa ömürlü feature branch, sık merge)
- **CI/CD:** GitHub Actions — public repo'da sınırsız, PR'larda: lint, type check, test, build
- **Deploy:** Main'e merge = otomatik deploy (Vercel + Railway)
- **Commit:** Conventional Commits (commitlint + Husky pre-commit hook)
- **Branch naming:** `feature/`, `fix/`, `chore/`, `docs/`, `refactor/` + kebab-case
- **Commit'lerde Co-Authored-By satırı OLMAYACAK**
- **Repo:** GitHub Public — https://github.com/acarberk/gymrat

### Kod Yazım Kuralları (ZORUNLU — İstisnasız)

**Dil:**

- Kod içinde **HİÇBİR Türkçe karakter/kelime OLMAYACAK**
- Kapsam: değişken isimleri, fonksiyon isimleri, class isimleri, dosya isimleri, string literal'lar, enum değerleri, log mesajları, error mesajları, test açıklamaları, README (kod kısımları), commit mesajları, PR açıklamaları, branch isimleri
- İstisna yok. Kullanıcıya döndürülen i18n mesajları kod içinde `en` anahtarıyla yazılır, Türkçe çeviri `locales/tr.json` (veya benzer i18n dosyası) içine gider

**Yorum Satırları:**

- **Kod içinde yorum YAZMAYACAĞIM** (`//`, `/* */`, `<!-- -->`)
- Kod kendini anlatmalı — anlamlı isim + küçük fonksiyon + net tip imzası
- İstisna (sadece bunlar):
  - JSDoc/TSDoc — **public API** için (library export'ları, shared util'ler)
  - `// @ts-expect-error` / `// eslint-disable-next-line` — teknik zorunluluk
  - Config dosyalarında zorunlu syntax (shebang `#!/usr/bin/env`)
  - Üçüncü parti kütüphane gerektirdiğinde (`/// <reference types="..." />`)
- Bir şeyi "açıklamak" ihtiyacı hissedilirse → **fonksiyona ayır**, adıyla anlat

**Commit & PR Yazım:**

- Commit mesajları ve PR açıklamaları **İngilizce**
- **CLAUDE.md referansı yasak** — commit'lerde, PR'larda, kodda bahsedilmez
- **AI-written görünümü yasak:**
  - Emoji yok (teknik çıktı + badge hariç)
  - Abartılı başlık yok
  - Gereksiz markdown süsü yok
  - "Generated with Claude" imzası yok
- Commit mesaj stili: Kısa, teknik, doğrudan. Conventional Commits formatı
- PR body stili: "Ne" + "neden" + test plan, kısa

### İnternal Dokümantasyon Kuralı (ZORUNLU)

- **Design doc'lar, ADR'ler, architecture notları KOMMİT EDİLMEZ**
- Public repo'ya sadece **user-facing** dökümantasyon girer: README, SECURITY.md, LICENSE, CONTRIBUTING.md, API reference (varsa)
- İnternal teknik kararlar, mimari tartışmalar, threat model, rate limit detayları, endpoint spec'leri → `docs/internal/` (gitignored)
- Rationale:
  - Güvenlik: saldırgan için bilgi sızıntısı
  - Rekabet: teknik stratejinin public olması gerekmiyor
  - Değişkenlik: design doc'lar sürekli değişir, kod PR'larından izole yaşamalı
- **Claude'un sorumluluğu:** design doc yazmadan önce kullanıcıya sorar. Cevap public kalmalı mı, internal mi?

### Main Branch Koruma Sözü (ZORUNLU — Claude'un Kendi Kuralı)

> GitHub personal repo'larda server-side branch protection enforce edilmiyor.
> Bu yüzden main branch koruması **Claude'un disipline uymasına** bağlı.

**Claude olarak söz veriyorum:**

- ❌ **ASLA** `main` branch'ine doğrudan commit atmayacağım
- ❌ **ASLA** `git push origin main` komutunu çalıştırmayacağım
- ❌ **ASLA** `git push --force` kullanmayacağım (kullanıcı açıkça istemezse)
- ✅ **Her değişiklik** için önce feature branch: `git checkout -b <type>/<kebab>`
- ✅ Branch'i push edip **PR açacağım** (gh CLI veya manuel)
- ✅ CI + CodeQL geçtikten sonra **kullanıcıdan onay** alıp merge edeceğim
- ✅ Merge sonrası **feature branch'i sileceğim** (lokal + remote)

**İstisna — Açık kullanıcı talimatı:**
Kullanıcı "acil, doğrudan main'e commit at" derse bu kural geçici olarak gevşer.
Ama varsayılan olarak HER ZAMAN feature branch + PR akışı.

**Ek savunma katmanı:**
`.husky/pre-push` hook'u main'e push'u lokal olarak da engeller.

### Code Review Ritüeli (ZORUNLU — İki Seviye)

Claude, kod kalitesi için **iki seviyeli** review ritmi tutar.

---

#### Seviye 1 — Günlük Review (Her Çalışılan Gün Sonu)

**Tetikleyici:** Kullanıcı "gün bitti", "bugünü kapatalım", "daily review" dediğinde.

**Kapsam:** O gün merge olan / açık olan PR'lar (1-3 PR).

**Hafif ama yapılandırılmış:**

- Bugün merge olan PR özetleri
- Açık kalan PR'lar, beklemedeki CI
- **Quick drift check** — bugünkü kodlar dünkü pattern'lere uyuyor mu?
- Yeni eklenen dep'ler (şişme sinyali)
- Yeni tech debt notları
- "Bugün öğrendim" — mimari veya teknik öğrenme

**Süre:** 5-10 dakikalık özet. Ayrı PR açmaz (önemliyse not al, sprint-end'de değerlendir).

**Çıktı:**

1. Bugün bitenler (PR listesi)
2. Açık kalanlar (merge bekleyen / CI çalışan)
3. Drift uyarıları (varsa)
4. Yarına taşınan
5. Günün öğrenmesi

---

#### Seviye 2 — Sprint-End Review

**Tetikleyici:** Sprint demo günü veya "sprint bitti" dendiğinde.

**Kapsam:** Sprint boyunca merge olan cumulative değişiklikler.

**Derinlemesine:**

- **Architectural drift** — design doc kararlarından sapma var mı?
- **Cross-PR tutarlılık** — aynı pattern iki PR'da farklı uygulanmış mı?
- **Dependency bloat** — sprint boyunca ne kadar yeni dep? Hepsi gerekli mi?
- **Tech debt accumulation** — TODO durumu ne?
- **Security posture** — yeni attack surface? CVE'ler?
- **Doc currency** — internal design doc'lar kodla aynı mı?
- **Performance** — N+1, unindexed queries, memory leak?
- **Test coverage trajectory** — nereden nereye?
- **Daily review bulguları** — kapatıldı mı?

**Çıktı:**

1. Sprint scope özeti (kaç PR, hangi feature)
2. Güçlü yanlar
3. Bulgular tablosu (🔴 Critical / 🟡 Important / 🟢 Nit)
4. Action item'lar (gelecek sprint tech debt)
5. Retrospektif notu (mimari öğrenme)

**Aksiyon:**

- Bulgular için ayrı PR (🔴/🟡/🟢 etiketli)
- Gelecek sprint planlamasında retrospektif girdi
- Internal design doc güncel değilse `docs/internal/` revize

---

#### Farklılıklar — Tek Bakışta

| Boyut  | Günlük            | Sprint-End          |
| ------ | ----------------- | ------------------- |
| Sıklık | Her çalışılan gün | Her 2 haftada bir   |
| Süre   | 5-10 dk özet      | 30-60 dk analiz     |
| Scope  | O günkü PR        | 14 gün cumulative   |
| Output | Markdown özet     | Action item + PR    |
| Action | Not al, sonra     | Hemen PR'a dönüştür |

**İlke:** Günlük review **küçük sapmaları erken yakalar**, sprint-end **büyük resme bakar**.

### Kurulum Sırası (config & tooling)

1. ~~TypeScript Config~~ ✅ (`packages/config/tsconfig/` — base, nextjs, nestjs, library)
2. ~~ESLint + Prettier~~ ✅ (`packages/config/eslint/` — base, nextjs, nestjs, library preset)
3. ~~Husky + lint-staged~~ ✅ (pre-commit: eslint+prettier, commit-msg: commitlint, pre-push: main koruma)
4. ~~Commitlint~~ ✅ (Conventional Commits)
5. ~~Semantic Versioning + Changelog~~ ✅ (Changesets)
6. ~~GitHub Actions CI/CD~~ ✅ (`.github/workflows/ci.yml`)
7. ~~CodeQL~~ ✅ (`.github/workflows/codeql.yml` — haftalık SAST)
8. ~~Dependabot~~ ✅ (`.github/dependabot.yml`)
9. ~~Security Policy~~ ✅ (`SECURITY.md`)
10. GitHub Security Features — Private vuln reporting, Dependabot alerts, Secret scanning + push protection (manuel aktivasyon)

### İleride (İhtiyaç Olunca)

- **Codecov** — ilk test modülü yazıldığında
- **OWASP ZAP** — production deploy sonrası (DAST runtime güvenlik)
- **SonarCloud** — takım 3+ kişi olunca

---

## Veri Kaynakları

| Kaynak                                                          | Lisans           | Kullanım                     | Attribution                     |
| --------------------------------------------------------------- | ---------------- | ---------------------------- | ------------------------------- |
| [Open Food Facts](https://world.openfoodfacts.org)              | ODbL share-alike | Barkod + paketli ürün        | Zorunlu (footer + ürün sayfası) |
| [USDA FoodData Central](https://fdc.nal.usda.gov)               | Public domain    | Raw food fallback            | İsteğe bağlı (best practice)    |
| [free-exercise-db](https://github.com/yuhonas/free-exercise-db) | Unlicense        | Egzersiz kütüphanesi         | İsteğe bağlı                    |
| [wger](https://wger.de)                                         | CC-BY-SA 4.0     | Türkçe çeviri zenginleştirme | Zorunlu                         |
| Curated TR foods                                                | Kendi veri       | Türk ev yemekleri            | —                               |

**Attribution sayfası** zorunlu — `apps/web/app/about/data-sources/`.

---

## MVP Kapsamı — Dengeli MVP (v1.0)

### Auth & Kullanıcı

Email + Google OAuth + Apple OAuth + JWT (access 15dk + refresh rotation httpOnly) + Email verification + Şifre sıfırlama + Cloudflare Turnstile + Profil sayfası/düzenleme

### Onboarding

5 adımlı: profil (cinsiyet, doğum yılı) → vücut (boy, kilo) → aktivite seviyesi → hedef (cut/maintain/lean_bulk/bulk) → makro hesabı (Mifflin-St Jeor + TDEE multiplier + goal delta)

### Beslenme (Nutrition)

Yemek arama (curated TR + USDA fallback) + Open Food Facts barkod + manuel yemek ekleme + günlük log (4 öğün) + makro dashboard + favori yemekler

### Antrenman (Workout)

Egzersiz kütüphanesi (free-exercise-db, 796 hareket) + boş workout başlatma + 2 hazır program (PPL 6-day, Full Body 3-day) + set/rep/weight/RPE log + workout geçmişi + 1RM tahmini (Epley + Brzycki)

### Gamification

XP + Level (logaritmik) + Streak (freeze + milestone) — workout tamamlama, makro hedef tutturma, günlük log streak'i hep XP verir

### Stats

Temel istatistikler: haftalık makro hit oranı, 1RM trendi, workout volume, kilo trendi

### Sayfalar

Ana sayfa (giriş yok: hero + CTA / giriş var: bugün özet + streak + kısayollar) — Beslenme (öğün bazlı log) — Workout (program listesi + aktif workout + geçmiş) — Profil (public) — Ayarlar

### Altyapı

i18n (TR/EN) + dark/light mode + SEO (SSG public sayfalar) + rate limiting + error handling + PWA manifest + service worker (offline cache)

### Yol Haritası

- **v1.1** (MVP+1-2 ay): Ek programlar (5/3/1 BBB, StrongLifts 5x5, GZCLP, Upper/Lower), progress grafikleri (chart.js veya recharts), body weight log, su takibi, Premium/Stripe, Strava-lite cardio
- **v1.2** (v1.1+2-3 ay): Sosyal feed (kim ne yaptı), arkadaş takip, akıllı saat entegrasyonu (Apple Health, Google Fit), AI yemek öneri rule-based
- **v1.3** (v1.2+3-4 ay): React Native mobil (Expo), Year in Review, kozmetik mağaza

---

## Monetization

### Free vs Premium

**Gymrat Free (Ücretsiz, KALICI):**

- Sınırsız yemek/öğün log, makro takibi
- Open Food Facts barkod (sınırsız)
- Hazır 2 program (PPL + Full Body)
- Tüm gamification (streak, XP, level, rozet)
- Workout geçmişi, basic istatistikler
- Reklamsız (MVP'de, ileride çok minimal banner)

**Gymrat Pro ($2.99/ay veya $19.99/yıl):**

- Tüm programlar (10+ — 5/3/1 BBB, SL5x5, GZCLP, Upper/Lower, vb.)
- Gelişmiş istatistikler + yıllık özet (Wrapped)
- Sınırsız özel program + şablon
- Progress grafikleri (zaman serisi, periodization)
- AI yemek/program önerisi (Faz 3+)
- Veri export (CSV/JSON)
- Özel rozet seti + profil teması (kozmetik)
- Streak Shield (hafta 3 gün koruma)
- Apple Health + Google Fit sync (Faz 2+)

### Kırmızı Çizgi

- **Gamification HER ZAMAN ücretsiz** (retention = büyüme = premium dönüşüm)
- **Barkod tarama HER ZAMAN ücretsiz** (MFP'nin yaptığı hata)
- **Türk yemek DB HER ZAMAN ücretsiz** (TR pazarına söz)

### Ek Gelir Kaynakları

- **Affiliate** — Whey protein, eğitim ekipmanı yönlendirme komisyonu (sınırlı, etik)
- **Cosmetic Store** — Profil temaları, çerçeveler ($0.99-$1.99)
- **Year in Review Sponsorluk** — Wrapped görsellerde sponsor logosu
- **B2B Diyetisyen/PT Tools** — v2+ için PT'nin müşteri yönetimi (Diyetkolik B2B modeli)

---

## UI/UX Tasarımı

### Sayfalar

- Ana Sayfa (giriş yok: hero + CTA / giriş var: streak + bugün makro + kısayol + aktif workout)
- Beslenme (4 öğün listesi, makro halka grafiği, hızlı ekle + barkod)
- Yemek Ekle (arama, barkod tara, yeni yemek oluştur, favori)
- Workout (program kütüphanesi, başlat, geçmiş, aktif)
- Aktif Workout (egzersiz + set log, 1RM tahmini, dinlenme zamanlayıcı)
- Egzersiz Ekle (arama + kas grubu filtresi)
- Progress (makro hit haftalık, kilo grafiği, 1RM trendi, workout count)
- Profil (public: avatar, level, streak, rozet, top egzersiz, top yemek)
- Ayarlar (profil, makro hedefleri, dil, tema, dışa aktar, hesap, premium)
- Giriş/Kayıt (Email + Google + Apple, Turnstile)

### Mobil Navigasyon: Bottom Tab Bar

- 🏠 Bugün | 🍎 Beslenme | 🏋️ Antrenman | 📈 Gelişim | 👤 Profil
- Hızlı ekle FAB (öğün + workout başlat)

### Kritik Akışlar

1. **Kayıt → Onboarding** (profil → vücut → aktivite → hedef → makro özet) → Streak başlar
2. **Günlük kullanım:** Aç → bugün makro gör → yemek ekle (barkod/arama) → workout başlat → XP
3. **Workout:** Program seç → set/rep/weight gir → bitir → XP + streak güncellenir
4. **Yemek:** Barkod tara → OFF cache → makro ekle → öğün → günlük makro halkası dolar

---

## Uygulama Sahibi İsteği

### Öğretme Yaklaşımı (HER KOD YAZIMINDA UYGULANACAK)

- **Adım adım ilerle** — küçük, anlaşılır parçalar
- **5N1K açıklaması** — her kod bloğu için:
  - **Ne:** Bu kod ne yapıyor?
  - **Neden:** Neden bu şekilde yazdık?
  - **Nasıl:** Nasıl çalışıyor (mekanizma)?
  - **Nerede:** Projede nereye oturuyor?
  - **Ne zaman:** Ne zaman çalışır/tetiklenir?
  - **Alternatifler:** Başka nasıl yazılabilirdi? Neden bu yöntemi?
- **Terim açıklaması** — her yeni teknik terimi ilk kullanımda açıkla
- **Kısa kod blokları** — büyük dosyaları parça parça yaz, her parçayı açıkla
- **Mülakat soruları** — her konunun sonunda 1-2 adet senior teknik soru:
  - Gerçek mülakat tarzında, açık uçlu, düşündürücü
  - "Neden X yerine Y?", "Trade-off'lar?", "Production'da nasıl ölçeklenir?"
  - Cevap basit "evet/hayır" değil, kendi kelimelerinle açıklayan
  - Proje bağlamına oturtulmuş
- **Sessizce uyma — sorgula** — kullanıcı yanlış istiyor olabilir, alternatif öner, riski belirt
- Proje amacı: hem ürün çıkarmak hem öğrenmek — ikisi birlikte

### Kod Kalitesi Standartları (ZORUNLU)

#### SOLID Prensipleri

- **S — Single Responsibility:** Her dosya, fonksiyon, class TEK iş
- **O — Open/Closed:** Yeni özellik = genişlet, mevcut kodu değiştirme
- **L — Liskov Substitution:** Alt tipler üst tip yerine geçebilmeli
- **I — Interface Segregation:** Küçük, spesifik interface (büyük şişkin yok)
- **D — Dependency Inversion:** Soyutlamaya bağlan, somut sınıfa değil

#### React / Next.js Best Practices

- **Thinking in React:** UI → component hierarchy → minimal state → data top-down
- **Server Components öncelikli:** "use client" sadece gerektiğinde
- **Composition over Inheritance**
- **Custom Hook'lar:** Tekrarlanan logic → custom hook
- **Colocate related code:** Feature-based folder structure
- **Key prop:** Unique + stable
- **useCallback/useMemo:** Gerektiğinde — premature optimization yok
- **Error Boundary**

#### NestJS Best Practices

- **Modüler:** Her domain (auth, food, nutrition-log, exercise, workout, gamification) ayrı modül
- **DTO pattern:** Gelen/giden veri için her zaman DTO
- **Guard/Interceptor/Pipe:** Cross-cutting concern → decorator
- **Repository pattern:** DB erişimi service'te, controller'da query yok
- **Exception Filter:** Global hata, tutarlı format
- **Config validation:** Env → Zod

#### Güvenlik (EN ÖNCELİKLİ)

- **Input validation:** ASLA kullanıcı girdisine güven, her şey Zod
- **SQL Injection:** Prisma parameterized, raw SQL'den kaç
- **XSS:** Kullanıcı girdisi render etmeden sanitize
- **CSRF:** State-changing isteklerde token
- **Rate limiting:** Tüm endpoint'lerde
- **Helmet:** HTTP header güvenliği
- **CORS:** Sadece izinli origin
- **Password hashing:** bcrypt minimum 12 salt round (2026 standardı)
- **JWT güvenliği:** Access 15dk, refresh rotation, httpOnly + Secure + SameSite=Strict
- **Environment secrets:** `.env` asla commit edilmez
- **Dependency audit:** `pnpm audit` düzenli
- **Least privilege:** Servis/kullanıcı sadece ihtiyaç yetkisi
- **Bot koruma:** Turnstile kayıt + login + şifre sıfırlama

### Paket Versiyon Politikası (ZORUNLU)

**Her paket kurulumundan önce npm'den güncel versiyon kontrol edilmeli.**

```sh
npm show <paket-adi> version              # tek paket
npm show <paket1> <paket2> version        # birden fazla
pnpm dlx npm-check-updates --workspaces   # tüm workspace
```

#### Kurallar

- `package.json` versiyon: `^X.Y.Z` (caret — minor/patch otomatik)
- Major (v8 → v9) değişikliklerinde breaking change kontrol
- `pnpm-lock.yaml` source of truth
- **`latest` veya `*` yasak** — her zaman explicit versiyon

#### Genel Kod Standartları

- **TypeScript strict mode:** `strict: true`, `noImplicitAny: true`
- **ESLint + Prettier:** Tutarlı stil, otomatik format
- **Naming:** camelCase (var/fn), PascalCase (component/class/type), UPPER_SNAKE_CASE (sabit)
- **Meaningful names:** `getUserMacroTargets()` ✅, `getData()` ❌
- **DRY**
- **YAGNI**
- **Early return:** Derin nesting yerine
- **Immutability:** State mutate etme, yeni obje
- **Error handling:** try/catch + anlamlı mesaj
- **No "magic numbers":** Constants veya config

---

## Faz Yol Haritası — Mevcut Durum

### Faz 0 — Arşiv (TAMAMLANDI)

- ~~SvelteKit prototype `archive/sveltekit-prototype` branch'ine alındı~~
- ~~Repo public yapıldı~~

### Faz 1 — Monorepo İskelet + Tooling (DEVAM EDİYOR)

- ✅ pnpm workspace + Turborepo
- ✅ apps/web + apps/api placeholder
- ✅ packages/{config, shared, ui}
- ✅ tsconfig + eslint + prettier preset'leri
- ✅ Husky + lint-staged + commitlint
- ✅ GitHub Actions CI + CodeQL
- ✅ Dependabot
- ✅ SECURITY.md + CONTRIBUTING.md + README.md
- ✅ pre-push hook (main koruma)

### Faz 2 — Backend Base (SIRADA)

- NestJS scaffolding (Fastify adapter, Pino, Helmet, CORS, Throttler)
- Prisma + Postgres + Redis (docker-compose dev)
- Auth modülü (Email + Google + Apple + JWT + refresh rotation + Turnstile)
- User modülü
- Health modülü
- Mailer modülü
- Swagger/OpenAPI

### Faz 3 — Frontend Base

- Next.js 16 App Router + Tailwind 4 + shadcn/ui
- TanStack Query + Zustand + RHF + Zod
- i18n (TR/EN), dark/light mode
- Auth flow (register/login/forgot pw/email verify)
- PWA manifest + service worker

### Faz 4 — Domain Modülleri (gymrat'ın özü)

- `food` modülü (curated TR DB, OFF proxy, user food)
- `nutrition-log` modülü (öğün, makro takibi)
- `exercise` modülü (free-exercise-db seed)
- `workout` modülü (session, set, template, program)
- `gamification` modülü (XP, level, streak)

### Faz 5 — Deploy + Polish

- Vercel (web) + Railway (api + db + redis)
- E2E (Playwright)
- Mobile install QR + PWA cilası
- Lighthouse + axe-core a11y

---

## Hızlı Komutlar

```sh
pnpm install                              # workspace install
pnpm dev                                  # turbo run dev (paralel)
pnpm build                                # turbo run build
pnpm lint                                 # turbo run lint
pnpm test                                 # turbo run test
pnpm type-check                           # turbo run type-check

pnpm --filter @gymrat/web dev             # sadece web
pnpm --filter @gymrat/api dev             # sadece api
pnpm --filter @gymrat/shared build        # shared paket build

pnpm changeset                            # changeset oluştur
pnpm version-packages                     # changesets'i versiyonlara işle
```
