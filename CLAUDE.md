# Gymrat — Proje Kılavuzu

PWA ile çalışan, offline-first, ücretsiz beslenme + antrenman takip uygulaması.
Hedef: MyFitnessPal'ın paywall'ından bıkmış, Hevy'nin beslenme yokluğundan rahatsız,
Türk yemeklerini doğru tanıyan tek bir uygulama isteyen kullanıcılar.

Bu doküman her geliştirmede uyulması zorunlu kuralları içerir.

---

## Konuşma + Geliştirme Tarzı

- **Sohbet havasında, eğitici** — robotik liste değil, fikir alışverişi
- **Sessizce uyma — sorgula** — kullanıcı yanlış istiyor olabilir, alternatif öner
- **Eksik gördüğünü söyle** — yan etki, kayıp, risk fark edersen mutlaka belirt
- **5N1K her kararda** — Ne / Neden / Nasıl / Nerede / Ne zaman / Alternatifler

### Geliştirme Sonrası Sohbet Review (3-4 madde)

1. Ne yapıldı (1 cümle)
2. Neden bu yaklaşım, alternatifi neydi
3. Risk / gözden kaçabilecek
4. Sonraki adım önerisi

---

## Kodlama Standartları

### TypeScript

- **`any` yasak** — `unknown` kullan, sonra daralt
- **Strict mode açık** — `strict: true` tsconfig'de
- **Type alias > interface** — sadelik için (sadece extend gerekirse interface)
- **Zod ile runtime validation** — IndexedDB okuma, API yanıtı, kullanıcı input'unda
- **Discriminated union** ile state machine'ler (loading/success/error)

### Svelte 5 (Runes)

- **`$state`, `$derived`, `$effect`** kullan — eski `$:` yasak
- **Props**: `$props()` ile destructure
- **Two-way binding sınırlı** — input'larda OK, business logic'te yasak
- **Component dosyası 200 satırı geçerse** → split sinyali
- **Logic'i `.svelte.ts` rune dosyalarına çıkar** — view-only `.svelte` kalsın

### Mimari Kurallar

- **SOLID** — özellikle Single Responsibility (200+ satır = refactor sinyali)
- **Constructor injection** — global singleton yasak (i18n store hariç tek istisna)
- **Magic number yasak** — `src/lib/constants.ts` veya config'e
- **Repository pattern** — Dexie erişimi UI'dan izole, `$lib/db/repositories/`
- **Pure utility'ler `.ts`** — Svelte rune ihtiyacı yoksa rune dosyası kullanma

### Stil

- **Tailwind utility-first** — özel CSS'i `@layer components`'e koy
- **Mobil-first breakpoint'ler** — varsayılan mobil, `md:` üstüne ekle
- **Touch targets ≥ 44px** — Apple HIG ve Material guideline
- **Safe-area** — `env(safe-area-inset-*)` kullan, çentik/home indicator desteği

### Performans

- **Bundle hedefi** — initial load < 200 KB gz
- **Lazy route'lar** — büyük sayfalar (workout logger, nutrition log) dynamic import
- **IndexedDB query** — index üzerinden, full-scan yasak

### Test

- **Vitest** birim testler — pure utility'ler (BMR, TDEE, makro hesabı), repository fonksiyonları
- **Playwright** E2E — onboarding akışı, workout başlat, makro ekle
- **Test edilmemiş kritik path = bug fix kuralı**: bug bulunca önce test, sonra fix

### Yasak Listesi

- ❌ `console.log` production'da (sadece dev, build aşamasında strip)
- ❌ `as any`, `@ts-ignore` (gerçekten gerekirse `@ts-expect-error` + neden yorumu)
- ❌ Inline style (`style="..."`) — Tailwind class'a çevir
- ❌ HTML/JS/CSS dosyaya gömme — ayrı dosya
- ❌ Türkçe + İngilizce string'i kodda hard-code (her zaman `t('key')`)

---

## Mimari

### Katmanlar

```
┌─────────────────────────────────┐
│  routes/  (Svelte sayfalar)     │   ← UI, view logic
├─────────────────────────────────┤
│  lib/components/                │   ← yeniden kullanılabilir UI
├─────────────────────────────────┤
│  lib/state/                     │   ← Svelte rune store'ları
├─────────────────────────────────┤
│  lib/services/                  │   ← iş mantığı (öğün ekle, set logla)
├─────────────────────────────────┤
│  lib/db/                        │   ← Dexie schema + repository
├─────────────────────────────────┤
│  lib/api/                       │   ← Open Food Facts, USDA fetch
├─────────────────────────────────┤
│  lib/utils/                     │   ← pure fn (BMR, TDEE, 1RM, format)
├─────────────────────────────────┤
│  lib/data/                      │   ← seed JSON (TR foods, exercises, programs)
├─────────────────────────────────┤
│  lib/i18n/                      │   ← çeviri katmanı
└─────────────────────────────────┘
```

**Bağımlılık yönü** — yukarıdan aşağı sadece. UI bilir service'i, service bilir
repository'yi, repository bilir db'yi. Tersine bağımlılık yasak.

### Veri Modeli (özet)

- **User** — profil (yaş, boy, kilo, aktivite, hedef, makro hedefi)
- **Food** — yemek (id, isim, makrolar/100g, porsiyon birimi, kaynak)
- **FoodLogEntry** — günlük log (food_id, gram, öğün, tarih)
- **Exercise** — egzersiz (id, isim, kas grubu, ekipman, görsel)
- **WorkoutTemplate** — antrenman şablonu (PPL Day A vb.)
- **WorkoutSession** — log (egzersizler + setler)
- **WorkoutSet** — set (egzersiz_id, reps, weight, RPE, completed)

Detaylı şema `src/lib/db/schema.ts`'te Dexie + Zod ile.

### Veri Kaynakları

| Kaynak | Lisans | Kullanım |
|--------|--------|----------|
| Open Food Facts | ODbL share-alike | Barkod + paketli ürün |
| USDA FoodData Central | Public domain | Raw food fallback |
| free-exercise-db | Unlicense | Egzersiz kütüphanesi |
| wger | CC-BY-SA | Türkçe çeviri zenginleştirme |
| Curated TR foods | Kendi veri | Türk ev yemekleri |

**Attribution sayfası** zorunlu — Open Food Facts ODbL ve wger CC-BY-SA için.

---

## i18n

- **Varsayılan dil**: tr
- **Desteklenen**: tr, en
- **Çeviri dosyaları**: `src/lib/i18n/locales/{tr,en}.ts`
- **Anahtar formatı**: `nokta.notasyonu` (`onboarding.welcome.title`)
- **String literal yasak** — her görünür metin `t('...')` üzerinden
- **Sayı/tarih formatı** — `Intl.NumberFormat`, `Intl.DateTimeFormat`

---

## PWA Kuralları

- **Offline-first** — IndexedDB primary store, network ikincil
- **Service Worker** — Workbox, build-time generated
- **Network-first cache** sadece Open Food Facts API'sine
- **App shell** — kritik route'lar precache
- **Install prompt** — kullanıcıya doğru zamanda göster (3+ visit sonrası)

---

## Commit + Push Kuralları

- Her anlamlı geliştirmeden sonra commit (kullanıcı tekrar istemeden)
- Tetikleyici: yeni feature, bug fix + test, refactor + test, CLAUDE.md güncellemesi
- Tetiklemez: yarım iş (test fail), tek satır env, format/lint
- Mesaj formatı: `<tip>: <ne> (<neden>)` — örn `feat(nutrition): barkod tarama (offline cache + Open Food Facts)`
- Co-Authored-By footer her commit'te

### Commit Öncesi Code Review Checklist

- [ ] Type hints tüm fonksiyon param + return'larda
- [ ] `any`, `as any`, `@ts-ignore` yok
- [ ] `console.log` yok (sadece logger)
- [ ] Magic number yok
- [ ] Inline style yok
- [ ] Hard-coded TR/EN string yok
- [ ] 200+ satır component yok
- [ ] Yeni davranış için test eklendi
- [ ] `npm run check` geçiyor (svelte-check)
- [ ] `npm test` geçiyor

---

## Sonraki Fazlar

### Faz 1 — MVP (şu an)
- Onboarding + BMR/TDEE/makro
- Beslenme: manuel ekle, Open Food Facts barkod, TR yemek seed (100)
- Workout: free-exercise-db, set/rep/weight log, PPL şablonu
- PWA (offline, install)

### Faz 2 — Derinlik
- Daha fazla program (StrongLifts 5x5, 5/3/1, GZCLP, Full Body)
- Progress grafikleri (1RM trendi, kilo trendi, makro tutturma)
- Su takibi
- Workout şablonu kaydet
- Export/import JSON

### Faz 3 — Akıl + Sosyal
- "Bugün ne yiyeyim" (rule-based)
- "Bugün ne çalışayım" (programdaki sıradaki gün)
- Opsiyonel sync (Supabase free tier)
- Paylaşım, beğeni opsiyonel
