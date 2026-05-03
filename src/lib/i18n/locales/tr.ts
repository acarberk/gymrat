export const tr = {
	common: {
		save: 'Kaydet',
		cancel: 'İptal',
		delete: 'Sil',
		edit: 'Düzenle',
		add: 'Ekle',
		search: 'Ara',
		loading: 'Yükleniyor…',
		next: 'Devam',
		back: 'Geri',
		done: 'Bitti',
		yes: 'Evet',
		no: 'Hayır',
		grams: 'gram',
		kg: 'kg',
		cm: 'cm',
		reps: 'tekrar',
		sets: 'set',
		minutes: 'dakika'
	},
	tabs: {
		home: 'Bugün',
		nutrition: 'Beslenme',
		workout: 'Antrenman',
		progress: 'Gelişim',
		settings: 'Ayarlar'
	},
	onboarding: {
		welcome: {
			title: 'Gymrat\'a hoş geldin',
			subtitle:
				'Beslenme ve antrenmanını tek yerde takip et. Reklam yok, abonelik yok, verin senin.',
			cta: 'Başlayalım'
		},
		steps: {
			profile: 'Profil',
			body: 'Vücut',
			activity: 'Aktivite',
			goal: 'Hedef',
			summary: 'Özet'
		},
		profile: {
			title: 'Sana nasıl hitap edeyim?',
			name_label: 'İsim (opsiyonel)',
			name_placeholder: 'Ahmet',
			sex_label: 'Cinsiyet',
			sex_male: 'Erkek',
			sex_female: 'Kadın',
			birth_year_label: 'Doğum yılı'
		},
		body: {
			title: 'Vücut ölçüleri',
			height_label: 'Boy',
			weight_label: 'Kilo'
		},
		activity: {
			title: 'Günlük aktivite seviyen',
			sedentary: 'Hareketsiz',
			sedentary_desc: 'Masa başı, çok az yürüyüş',
			light: 'Hafif',
			light_desc: 'Haftada 1-3 kez egzersiz',
			moderate: 'Orta',
			moderate_desc: 'Haftada 3-5 kez egzersiz',
			active: 'Aktif',
			active_desc: 'Haftada 6-7 kez egzersiz',
			very_active: 'Çok aktif',
			very_active_desc: 'Yoğun antrenman + fiziksel iş'
		},
		goal: {
			title: 'Hedefin ne?',
			cut: 'Yağ yakmak',
			cut_desc: 'Haftada ~0.5 kg ver',
			maintain: 'Korumak',
			maintain_desc: 'Mevcut formu sürdür',
			lean_bulk: 'Temiz kas',
			lean_bulk_desc: 'Yavaş kas yapımı',
			bulk: 'Kas yapmak',
			bulk_desc: 'Haftada ~0.25 kg al',
			weekly_workout: 'Haftalık antrenman hedefi'
		},
		summary: {
			title: 'Hedef makroların',
			calories: 'Kalori',
			protein: 'Protein',
			carbs: 'Karbonhidrat',
			fat: 'Yağ',
			explanation:
				'Mifflin-St Jeor BMR + aktivite çarpanı + hedef kalori farkı. Ayarlardan değiştirebilirsin.',
			finish: 'Bitir'
		}
	},
	home: {
		greeting_morning: 'Günaydın',
		greeting_day: 'Selam',
		greeting_evening: 'İyi akşamlar',
		today_summary: 'Bugün',
		calories_remaining: 'Kalan kalori',
		quick_add_food: 'Hızlı yemek ekle',
		start_workout: 'Antrenman başlat',
		log_weight: 'Kilo kaydet'
	},
	nutrition: {
		title: 'Beslenme',
		breakfast: 'Kahvaltı',
		lunch: 'Öğle',
		dinner: 'Akşam',
		snack: 'Atıştırma',
		add_food: 'Yemek ekle',
		scan_barcode: 'Barkod tara',
		search_food: 'Yemek ara',
		gram_label: 'Miktar (gr)',
		serving_label: 'Porsiyon',
		empty_meal: 'Henüz bir şey eklemedin',
		not_found: 'Yemek bulunamadı',
		create_food: 'Yeni yemek oluştur',
		macros: 'Makrolar'
	},
	workout: {
		title: 'Antrenman',
		programs: 'Programlar',
		templates: 'Şablonlar',
		history: 'Geçmiş',
		start_empty: 'Boş antrenman başlat',
		exercises: 'Egzersizler',
		add_exercise: 'Egzersiz ekle',
		set: 'Set',
		weight: 'Ağırlık',
		reps: 'Tekrar',
		rpe: 'RPE',
		rest: 'Dinlenme',
		finish_workout: 'Antrenmanı bitir',
		previous: 'Önceki',
		empty_session: 'Henüz egzersiz yok'
	},
	settings: {
		title: 'Ayarlar',
		profile: 'Profil',
		macros: 'Makro hedefleri',
		language: 'Dil',
		units: 'Birim sistemi',
		export: 'Verileri dışa aktar',
		import: 'Verileri içe aktar',
		about: 'Hakkında',
		data_sources: 'Veri kaynakları',
		reset: 'Tüm verileri sil',
		reset_confirm: 'Tüm verilerin silinecek. Emin misin?'
	}
} as const;

type Widen<T> = T extends string
	? string
	: T extends ReadonlyArray<infer U>
		? Array<Widen<U>>
		: T extends object
			? { [K in keyof T]: Widen<T[K]> }
			: T;

export type TranslationDict = Widen<typeof tr>;
export type TranslationDictReadonly = typeof tr;
