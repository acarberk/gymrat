import { db } from '$lib/db/schema';
import { FoodSchema, type Food } from '$lib/types';

export async function getFood(id: string): Promise<Food | undefined> {
	return db.foods.get(id);
}

export async function getFoodByBarcode(barcode: string): Promise<Food | undefined> {
	return db.foods.where('barcode').equals(barcode).first();
}

export async function searchFoods(query: string, limit = 30): Promise<Food[]> {
	const q = query.trim().toLowerCase();
	if (!q) {
		return db.foods.orderBy('name_tr').limit(limit).toArray();
	}
	const all = await db.foods.toArray();
	return all
		.filter(
			(f) =>
				f.name_tr.toLowerCase().includes(q) ||
				(f.name_en?.toLowerCase().includes(q) ?? false) ||
				(f.brand?.toLowerCase().includes(q) ?? false)
		)
		.slice(0, limit);
}

export async function favoriteFoods(): Promise<Food[]> {
	return db.foods.filter((f) => f.is_favorite === true).toArray();
}

export async function saveFood(food: Food): Promise<void> {
	const valid = FoodSchema.parse(food);
	await db.foods.put(valid);
}

export async function bulkUpsertFoods(foods: Food[]): Promise<void> {
	const valid = foods.map((f) => FoodSchema.parse(f));
	await db.foods.bulkPut(valid);
}

export async function toggleFavorite(id: string): Promise<void> {
	const f = await db.foods.get(id);
	if (!f) return;
	await db.foods.update(id, { is_favorite: !f.is_favorite });
}

export async function deleteFood(id: string): Promise<void> {
	await db.foods.delete(id);
}

export async function countFoods(): Promise<number> {
	return db.foods.count();
}
