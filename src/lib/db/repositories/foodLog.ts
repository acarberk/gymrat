import { db } from '$lib/db/schema';
import { FoodLogEntrySchema, type FoodLogEntry, type MealType } from '$lib/types';

export async function logEntriesForDate(date: string): Promise<FoodLogEntry[]> {
	return db.food_log.where('date').equals(date).toArray();
}

export async function logEntriesForMeal(date: string, meal: MealType): Promise<FoodLogEntry[]> {
	return db.food_log.where('[date+meal]').equals([date, meal]).toArray();
}

export async function addLogEntry(entry: FoodLogEntry): Promise<void> {
	const valid = FoodLogEntrySchema.parse(entry);
	await db.food_log.add(valid);
}

export async function updateLogEntry(id: string, patch: Partial<FoodLogEntry>): Promise<void> {
	await db.food_log.update(id, patch);
}

export async function removeLogEntry(id: string): Promise<void> {
	await db.food_log.delete(id);
}

export async function logEntriesBetween(start: string, end: string): Promise<FoodLogEntry[]> {
	return db.food_log.where('date').between(start, end, true, true).toArray();
}
