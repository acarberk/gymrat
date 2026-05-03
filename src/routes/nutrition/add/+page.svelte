<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { searchFoods, saveFood, getFoodByBarcode } from '$lib/db/repositories/foods';
	import { addLogEntry } from '$lib/db/repositories/foodLog';
	import { fetchFoodByBarcode } from '$lib/api/openFoodFacts';
	import { uid, todayIso } from '$lib/utils/id';
	import { t } from '$lib/i18n';
	import type { Food, MealType } from '$lib/types';
	import { MealTypeSchema } from '$lib/types';

	const meal = $derived<MealType>(MealTypeSchema.parse(page.url.searchParams.get('meal') ?? 'snack'));
	const date = $derived(page.url.searchParams.get('date') ?? todayIso());

	let query = $state('');
	let results = $state<Food[]>([]);
	let selected = $state<Food | null>(null);
	let grams = $state<number>(100);
	let scanning = $state(false);
	let scanError = $state<string | null>(null);
	let busy = $state(false);

	async function runSearch(): Promise<void> {
		results = await searchFoods(query, 30);
	}

	$effect(() => {
		const q = query;
		untrack(() => {
			void runSearch();
			void q;
		});
	});

	function pick(food: Food): void {
		selected = food;
		grams = food.default_serving.grams;
	}

	async function confirm(): Promise<void> {
		if (!selected || grams <= 0) return;
		busy = true;
		try {
			await addLogEntry({
				id: uid('log'),
				date,
				meal,
				food_id: selected.id,
				grams,
				created_at: Date.now()
			});
			await goto('/nutrition');
		} finally {
			busy = false;
		}
	}

	async function startScan(): Promise<void> {
		scanError = null;
		const { Html5Qrcode } = await import('html5-qrcode');
		const id = 'scanner-region';
		const el = document.getElementById(id);
		if (!el) return;
		scanning = true;
		const scanner = new Html5Qrcode(id);
		try {
			await scanner.start(
				{ facingMode: 'environment' },
				{ fps: 10, qrbox: { width: 250, height: 150 } },
				async (decoded) => {
					await scanner.stop();
					scanning = false;
					await handleBarcode(decoded);
				},
				() => {}
			);
		} catch (e) {
			scanError = e instanceof Error ? e.message : 'Kamera açılamadı';
			scanning = false;
		}
	}

	async function handleBarcode(code: string): Promise<void> {
		busy = true;
		try {
			let food = await getFoodByBarcode(code);
			if (!food) {
				const fetched = await fetchFoodByBarcode(code);
				if (!fetched) {
					scanError = `Barkod bulunamadı: ${code}`;
					return;
				}
				await saveFood(fetched);
				food = fetched;
			}
			pick(food);
		} finally {
			busy = false;
		}
	}

	onMount(() => {
		if (browser) void runSearch();
	});
</script>

<div class="space-y-4 p-4 pt-6 pb-32">
	<header class="flex items-center gap-3">
		<button class="btn-ghost px-3 py-2 text-sm" onclick={() => goto('/nutrition')}>
			{t('common.back')}
		</button>
		<h1 class="flex-1 text-xl font-bold text-slate-100">{t('nutrition.add_food')}</h1>
	</header>

	<div class="flex gap-2">
		<input
			class="input flex-1"
			placeholder={t('nutrition.search_food')}
			bind:value={query}
		/>
		<button class="btn-ghost px-3" onclick={startScan} aria-label={t('nutrition.scan_barcode')}>
			📷
		</button>
	</div>

	{#if scanning}
		<div id="scanner-region" class="overflow-hidden rounded-2xl bg-black"></div>
	{/if}
	{#if scanError}
		<p class="rounded-lg bg-rose-950 p-3 text-sm text-rose-300">{scanError}</p>
	{/if}

	{#if !selected}
		<ul class="divide-y divide-slate-800 rounded-2xl bg-slate-900 ring-1 ring-slate-800">
			{#each results as food (food.id)}
				<li>
					<button
						class="flex w-full items-center justify-between px-4 py-3 text-left active:bg-slate-800"
						onclick={() => pick(food)}
					>
						<div class="min-w-0 flex-1">
							<p class="truncate font-medium text-slate-100">{food.name_tr}</p>
							<p class="text-xs text-slate-500">
								{food.brand ? `${food.brand} · ` : ''}{food.per_100g.calories} kcal/100g · {food.per_100g.protein_g}g P
							</p>
						</div>
						<span class="text-xs text-slate-500">{food.default_serving.label}</span>
					</button>
				</li>
			{:else}
				<li class="p-4 text-sm text-slate-500">{t('nutrition.not_found')}</li>
			{/each}
		</ul>
	{:else}
		<section class="card space-y-4">
			<div>
				<p class="font-semibold text-slate-100">{selected.name_tr}</p>
				{#if selected.brand}
					<p class="text-xs text-slate-500">{selected.brand}</p>
				{/if}
			</div>

			<div class="space-y-2">
				<label class="label" for="grams">{t('nutrition.gram_label')}</label>
				<input
					id="grams"
					type="number"
					inputmode="decimal"
					class="input"
					min="1"
					bind:value={grams}
				/>
				<div class="flex flex-wrap gap-2">
					<button
						class="btn-ghost px-3 py-1 text-xs"
						onclick={() => (grams = selected!.default_serving.grams)}
					>
						{selected.default_serving.label} ({selected.default_serving.grams}g)
					</button>
					<button class="btn-ghost px-3 py-1 text-xs" onclick={() => (grams = 50)}>50g</button>
					<button class="btn-ghost px-3 py-1 text-xs" onclick={() => (grams = 100)}>100g</button>
					<button class="btn-ghost px-3 py-1 text-xs" onclick={() => (grams = 200)}>200g</button>
				</div>
			</div>

			{#if selected}
				{@const ratio = grams / 100}
				<div class="grid grid-cols-4 gap-2 text-center">
					<div class="card">
						<p class="text-xs text-slate-500">kcal</p>
						<p class="font-bold text-cyan-400">{Math.round(selected.per_100g.calories * ratio)}</p>
					</div>
					<div class="card">
						<p class="text-xs text-slate-500">P</p>
						<p class="font-bold text-violet-400">{Math.round(selected.per_100g.protein_g * ratio)}g</p>
					</div>
					<div class="card">
						<p class="text-xs text-slate-500">C</p>
						<p class="font-bold text-amber-400">{Math.round(selected.per_100g.carbs_g * ratio)}g</p>
					</div>
					<div class="card">
						<p class="text-xs text-slate-500">F</p>
						<p class="font-bold text-pink-400">{Math.round(selected.per_100g.fat_g * ratio)}g</p>
					</div>
				</div>
			{/if}
		</section>
	{/if}
</div>

{#if selected}
	<div
		class="fixed inset-x-0 bottom-0 z-50 border-t border-slate-800 bg-slate-950/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur"
	>
		<div class="flex gap-2">
			<button class="btn-ghost flex-1" onclick={() => (selected = null)}>
				{t('common.cancel')}
			</button>
			<button class="btn-primary flex-1" disabled={busy} onclick={confirm}>
				{t('common.add')}
			</button>
		</div>
	</div>
{/if}
