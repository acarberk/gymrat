<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { logEntriesForDate, removeLogEntry } from '$lib/db/repositories/foodLog';
	import { getFood } from '$lib/db/repositories/foods';
	import { todayIso } from '$lib/utils/id';
	import { nutritionForGramsExact } from '$lib/utils/calculations';
	import { userStore } from '$lib/state/userStore.svelte';
	import { t } from '$lib/i18n';
	import type { Food, FoodLogEntry, MealType } from '$lib/types';
	import MacroRing from '$lib/components/MacroRing.svelte';

	type EntryWithFood = FoodLogEntry & { food: Food };

	let date = $state(todayIso());
	let entries = $state<EntryWithFood[]>([]);
	let loading = $state(true);

	const meals: { key: MealType; labelKey: 'nutrition.breakfast' | 'nutrition.lunch' | 'nutrition.dinner' | 'nutrition.snack' }[] = [
		{ key: 'breakfast', labelKey: 'nutrition.breakfast' },
		{ key: 'lunch', labelKey: 'nutrition.lunch' },
		{ key: 'dinner', labelKey: 'nutrition.dinner' },
		{ key: 'snack', labelKey: 'nutrition.snack' }
	];

	const totals = $derived.by(() => {
		const acc = { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 };
		for (const e of entries) {
			acc.calories += nutritionForGramsExact(e.food.per_100g.calories, e.grams);
			acc.protein_g += nutritionForGramsExact(e.food.per_100g.protein_g, e.grams);
			acc.carbs_g += nutritionForGramsExact(e.food.per_100g.carbs_g, e.grams);
			acc.fat_g += nutritionForGramsExact(e.food.per_100g.fat_g, e.grams);
		}
		return acc;
	});

	async function load(): Promise<void> {
		loading = true;
		await userStore.load();
		const raw = await logEntriesForDate(date);
		const enriched: EntryWithFood[] = [];
		for (const e of raw) {
			const f = await getFood(e.food_id);
			if (f) enriched.push({ ...e, food: f });
		}
		enriched.sort((a, b) => a.created_at - b.created_at);
		entries = enriched;
		loading = false;
	}

	function entriesFor(meal: MealType): EntryWithFood[] {
		return entries.filter((e) => e.meal === meal);
	}

	function mealCalories(meal: MealType): number {
		return entriesFor(meal).reduce(
			(s, e) => s + nutritionForGramsExact(e.food.per_100g.calories, e.grams),
			0
		);
	}

	async function remove(id: string): Promise<void> {
		await removeLogEntry(id);
		await load();
	}

	function add(meal: MealType): void {
		void goto(`/nutrition/add?meal=${meal}&date=${date}`);
	}

	onMount(() => {
		if (browser) void load();
	});

	const profile = $derived(userStore.profile);
	const target = $derived(profile?.macro_targets);
</script>

<div class="space-y-4 p-4 pt-6">
	<header>
		<h1 class="text-2xl font-bold text-slate-100">{t('nutrition.title')}</h1>
		<p class="text-xs text-slate-500">{date}</p>
	</header>

	{#if target}
		<section class="card">
			<div class="grid grid-cols-4 gap-2">
				<MacroRing
					value={totals.calories}
					target={target.calories}
					label={t('onboarding.summary.calories')}
					unit=""
				/>
				<MacroRing
					value={totals.protein_g}
					target={target.protein_g}
					label={t('onboarding.summary.protein')}
					color="#a78bfa"
				/>
				<MacroRing
					value={totals.carbs_g}
					target={target.carbs_g}
					label={t('onboarding.summary.carbs')}
					color="#fbbf24"
				/>
				<MacroRing
					value={totals.fat_g}
					target={target.fat_g}
					label={t('onboarding.summary.fat')}
					color="#f472b6"
				/>
			</div>
		</section>
	{/if}

	{#if loading}
		<p class="text-center text-slate-500">{t('common.loading')}</p>
	{:else}
		{#each meals as meal (meal.key)}
			<section class="card space-y-3">
				<div class="flex items-center justify-between">
					<div>
						<h2 class="font-semibold text-slate-100">{t(meal.labelKey)}</h2>
						<p class="text-xs text-slate-500">{Math.round(mealCalories(meal.key))} kcal</p>
					</div>
					<button class="btn-ghost text-sm" onclick={() => add(meal.key)}>
						+ {t('nutrition.add_food')}
					</button>
				</div>

				{#if entriesFor(meal.key).length === 0}
					<p class="text-sm text-slate-500">{t('nutrition.empty_meal')}</p>
				{:else}
					<ul class="divide-y divide-slate-800">
						{#each entriesFor(meal.key) as entry (entry.id)}
							{@const cal = nutritionForGramsExact(entry.food.per_100g.calories, entry.grams)}
							{@const pro = nutritionForGramsExact(entry.food.per_100g.protein_g, entry.grams)}
							<li class="flex items-center justify-between py-2">
								<div class="min-w-0 flex-1">
									<p class="truncate font-medium text-slate-100">{entry.food.name_tr}</p>
									<p class="text-xs text-slate-500">
										{entry.grams}g · {Math.round(cal)} kcal · {Math.round(pro)}g P
									</p>
								</div>
								<button
									class="ml-2 text-xs text-slate-500 active:text-rose-400"
									onclick={() => remove(entry.id)}
									aria-label={t('common.delete')}
								>
									✕
								</button>
							</li>
						{/each}
					</ul>
				{/if}
			</section>
		{/each}
	{/if}
</div>
