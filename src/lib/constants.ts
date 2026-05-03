export const KCAL_PER_GRAM_PROTEIN = 4;
export const KCAL_PER_GRAM_CARBS = 4;
export const KCAL_PER_GRAM_FAT = 9;
export const KCAL_PER_GRAM_FIBER = 2;
export const KCAL_PER_GRAM_ALCOHOL = 7;

export const ACTIVITY_MULTIPLIERS = {
	sedentary: 1.2,
	light: 1.375,
	moderate: 1.55,
	active: 1.725,
	very_active: 1.9
} as const;

export const GOAL_CALORIE_DELTA = {
	cut: -500,
	maintain: 0,
	lean_bulk: 250,
	bulk: 500
} as const;

export const PROTEIN_G_PER_KG_BY_GOAL = {
	cut: 2.2,
	maintain: 1.8,
	lean_bulk: 2.0,
	bulk: 1.8
} as const;

export const FAT_G_PER_KG_BY_GOAL = {
	cut: 0.8,
	maintain: 1.0,
	lean_bulk: 1.0,
	bulk: 1.0
} as const;

export const RPE_LABELS_TR: Record<number, string> = {
	6: 'Çok kolay',
	7: 'Kolay',
	8: 'Orta',
	9: 'Zor',
	10: 'Maksimum'
};

export const DEFAULT_SET_REST_SECONDS = 120;
export const DEFAULT_LOCALE = 'tr';
export const SUPPORTED_LOCALES = ['tr', 'en'] as const;
