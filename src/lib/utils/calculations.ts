import {
	ACTIVITY_MULTIPLIERS,
	GOAL_CALORIE_DELTA,
	PROTEIN_G_PER_KG_BY_GOAL,
	FAT_G_PER_KG_BY_GOAL,
	KCAL_PER_GRAM_PROTEIN,
	KCAL_PER_GRAM_CARBS,
	KCAL_PER_GRAM_FAT
} from '$lib/constants';
import type { ActivityLevel, Goal, MacroTargets, Sex } from '$lib/types';

export type BmrInput = {
	sex: Sex;
	age: number;
	height_cm: number;
	weight_kg: number;
};

export function mifflinStJeor({ sex, age, height_cm, weight_kg }: BmrInput): number {
	const base = 10 * weight_kg + 6.25 * height_cm - 5 * age;
	return Math.round(sex === 'male' ? base + 5 : base - 161);
}

export function tdee(bmr: number, activity: ActivityLevel): number {
	return Math.round(bmr * ACTIVITY_MULTIPLIERS[activity]);
}

export function ageFromBirthYear(birth_year: number, today: Date = new Date()): number {
	return today.getFullYear() - birth_year;
}

export type MacroInput = {
	sex: Sex;
	age: number;
	height_cm: number;
	weight_kg: number;
	activity: ActivityLevel;
	goal: Goal;
};

export function computeMacroTargets(input: MacroInput): MacroTargets {
	const bmr = mifflinStJeor(input);
	const maintenance = tdee(bmr, input.activity);
	const calories = Math.max(1200, maintenance + GOAL_CALORIE_DELTA[input.goal]);

	const protein_g = Math.round(input.weight_kg * PROTEIN_G_PER_KG_BY_GOAL[input.goal]);
	const fat_g = Math.round(input.weight_kg * FAT_G_PER_KG_BY_GOAL[input.goal]);

	const protein_kcal = protein_g * KCAL_PER_GRAM_PROTEIN;
	const fat_kcal = fat_g * KCAL_PER_GRAM_FAT;
	const carbs_kcal = Math.max(0, calories - protein_kcal - fat_kcal);
	const carbs_g = Math.round(carbs_kcal / KCAL_PER_GRAM_CARBS);

	return { calories, protein_g, carbs_g, fat_g };
}

export function epley1RM(weight_kg: number, reps: number): number {
	if (reps <= 0) return 0;
	if (reps === 1) return weight_kg;
	return Math.round(weight_kg * (1 + reps / 30) * 10) / 10;
}

export function brzycki1RM(weight_kg: number, reps: number): number {
	if (reps <= 0 || reps >= 37) return 0;
	if (reps === 1) return weight_kg;
	return Math.round(((weight_kg * 36) / (37 - reps)) * 10) / 10;
}

export function nutritionForGrams(per100g: number, grams: number): number {
	return Math.round((per100g * grams) / 100);
}

export function nutritionForGramsExact(per100g: number, grams: number): number {
	return (per100g * grams) / 100;
}
