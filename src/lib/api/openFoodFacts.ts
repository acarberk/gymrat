import { z } from 'zod';
import type { Food } from '$lib/types';
import { uid } from '$lib/utils/id';

const NutrimentsSchema = z
	.object({
		'energy-kcal_100g': z.number().nullish(),
		energy_100g: z.number().nullish(),
		proteins_100g: z.number().nullish(),
		carbohydrates_100g: z.number().nullish(),
		fat_100g: z.number().nullish(),
		fiber_100g: z.number().nullish(),
		sugars_100g: z.number().nullish(),
		sodium_100g: z.number().nullish()
	})
	.passthrough();

const ProductSchema = z.object({
	code: z.string().optional(),
	product_name: z.string().nullish(),
	product_name_tr: z.string().nullish(),
	product_name_en: z.string().nullish(),
	brands: z.string().nullish(),
	serving_quantity: z.union([z.string(), z.number()]).nullish(),
	serving_size: z.string().nullish(),
	nutriments: NutrimentsSchema.nullish()
});

const ResponseSchema = z.object({
	status: z.number().optional(),
	status_verbose: z.string().optional(),
	code: z.string().optional(),
	product: ProductSchema.optional()
});

const BASE = 'https://world.openfoodfacts.org/api/v2/product';
const FIELDS =
	'code,product_name,product_name_tr,product_name_en,brands,serving_quantity,serving_size,nutriments';

function toNumber(v: string | number | null | undefined): number | undefined {
	if (v === null || v === undefined) return undefined;
	const n = typeof v === 'number' ? v : parseFloat(v);
	return Number.isFinite(n) ? n : undefined;
}

export async function fetchFoodByBarcode(barcode: string): Promise<Food | null> {
	const url = `${BASE}/${encodeURIComponent(barcode)}.json?fields=${FIELDS}`;
	const res = await fetch(url, { headers: { 'User-Agent': 'Gymrat/0.1 PWA' } });
	if (!res.ok) return null;
	const json = await res.json();
	const parsed = ResponseSchema.safeParse(json);
	if (!parsed.success) return null;
	const p = parsed.data.product;
	if (!p || parsed.data.status !== 1) return null;

	const n = p.nutriments ?? {};
	const calories =
		toNumber(n['energy-kcal_100g']) ??
		(toNumber(n.energy_100g) !== undefined ? Math.round(toNumber(n.energy_100g)! / 4.184) : undefined);

	if (calories === undefined) return null;

	const name = p.product_name_tr || p.product_name || p.product_name_en || 'Bilinmeyen ürün';
	const servingGrams = toNumber(p.serving_quantity);

	const food: Food = {
		id: uid('off'),
		name_tr: name,
		name_en: p.product_name_en ?? undefined,
		brand: p.brands ?? undefined,
		barcode: p.code ?? barcode,
		source: 'open_food_facts',
		per_100g: {
			calories: Math.round(calories),
			protein_g: toNumber(n.proteins_100g) ?? 0,
			carbs_g: toNumber(n.carbohydrates_100g) ?? 0,
			fat_g: toNumber(n.fat_100g) ?? 0,
			fiber_g: toNumber(n.fiber_100g),
			sugar_g: toNumber(n.sugars_100g),
			sodium_mg:
				toNumber(n.sodium_100g) !== undefined
					? Math.round(toNumber(n.sodium_100g)! * 1000)
					: undefined
		},
		default_serving:
			servingGrams && servingGrams > 0
				? { label: p.serving_size ?? '1 porsiyon', grams: servingGrams }
				: { label: '100 g', grams: 100 },
		servings: [],
		tags: ['barcode'],
		created_at: Date.now(),
		is_favorite: false
	};

	return food;
}
