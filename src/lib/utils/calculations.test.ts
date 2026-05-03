import { describe, expect, it } from 'vitest';
import {
	mifflinStJeor,
	tdee,
	computeMacroTargets,
	epley1RM,
	brzycki1RM,
	ageFromBirthYear,
	nutritionForGrams
} from './calculations';

describe('mifflinStJeor', () => {
	it('hesaplar erkek BMR', () => {
		const bmr = mifflinStJeor({ sex: 'male', age: 30, height_cm: 180, weight_kg: 80 });
		expect(bmr).toBe(1780);
	});

	it('hesaplar kadın BMR', () => {
		const bmr = mifflinStJeor({ sex: 'female', age: 30, height_cm: 165, weight_kg: 60 });
		expect(bmr).toBe(1320);
	});
});

describe('tdee', () => {
	it('sedanter çarpan uygular', () => {
		expect(tdee(1800, 'sedentary')).toBe(2160);
	});
	it('çok aktif çarpan uygular', () => {
		expect(tdee(1800, 'very_active')).toBe(3420);
	});
});

describe('computeMacroTargets', () => {
	it('cut hedefinde 500 kcal düşer', () => {
		const t = computeMacroTargets({
			sex: 'male',
			age: 30,
			height_cm: 180,
			weight_kg: 80,
			activity: 'moderate',
			goal: 'cut'
		});
		expect(t.calories).toBeLessThan(2900);
		expect(t.protein_g).toBe(176);
		expect(t.fat_g).toBe(64);
	});

	it('bulk hedefinde 500 kcal artar', () => {
		const cut = computeMacroTargets({
			sex: 'male',
			age: 30,
			height_cm: 180,
			weight_kg: 80,
			activity: 'moderate',
			goal: 'cut'
		});
		const bulk = computeMacroTargets({
			sex: 'male',
			age: 30,
			height_cm: 180,
			weight_kg: 80,
			activity: 'moderate',
			goal: 'bulk'
		});
		expect(bulk.calories - cut.calories).toBe(1000);
	});

	it('kalori toplamı protein + karb + yağ ile uyumlu', () => {
		const t = computeMacroTargets({
			sex: 'female',
			age: 28,
			height_cm: 165,
			weight_kg: 60,
			activity: 'light',
			goal: 'maintain'
		});
		const reconstructed = t.protein_g * 4 + t.carbs_g * 4 + t.fat_g * 9;
		expect(Math.abs(reconstructed - t.calories)).toBeLessThan(10);
	});

	it('kaloriyi 1200 alt sınırının altına düşürmez', () => {
		const t = computeMacroTargets({
			sex: 'female',
			age: 60,
			height_cm: 150,
			weight_kg: 45,
			activity: 'sedentary',
			goal: 'cut'
		});
		expect(t.calories).toBeGreaterThanOrEqual(1200);
	});
});

describe('1RM formülleri', () => {
	it('Epley: 100kg x 5 reps ≈ 116.7', () => {
		expect(epley1RM(100, 5)).toBeCloseTo(116.7, 0);
	});

	it('Brzycki: 100kg x 5 reps ≈ 112.5', () => {
		expect(brzycki1RM(100, 5)).toBeGreaterThan(110);
		expect(brzycki1RM(100, 5)).toBeLessThan(115);
	});

	it('1 rep = ağırlığın kendisi', () => {
		expect(epley1RM(120, 1)).toBe(120);
		expect(brzycki1RM(120, 1)).toBe(120);
	});

	it('0 rep = 0', () => {
		expect(epley1RM(120, 0)).toBe(0);
	});
});

describe('ageFromBirthYear', () => {
	it('hesaplar yıl farkını', () => {
		expect(ageFromBirthYear(1995, new Date('2026-05-01'))).toBe(31);
	});
});

describe('nutritionForGrams', () => {
	it('100g referans için 150g doğru', () => {
		expect(nutritionForGrams(200, 150)).toBe(300);
	});
});
