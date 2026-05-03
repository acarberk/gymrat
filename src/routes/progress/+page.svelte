<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { recentSessions } from '$lib/db/repositories/workouts';
	import { logEntriesBetween } from '$lib/db/repositories/foodLog';
	import { getFood } from '$lib/db/repositories/foods';
	import { userStore } from '$lib/state/userStore.svelte';
	import { nutritionForGramsExact } from '$lib/utils/calculations';
	import { todayIso, isoDate } from '$lib/utils/id';
	import { t } from '$lib/i18n';

	type DayTotal = {
		date: string;
		calories: number;
		protein_g: number;
		hit: boolean;
	};

	let weeklyMacros = $state<DayTotal[]>([]);
	let weeklyWorkouts = $state(0);
	let totalSessions = $state(0);

	async function load(): Promise<void> {
		await userStore.load();
		const target = userStore.profile?.macro_targets;

		const today = new Date();
		const start = new Date(today);
		start.setDate(today.getDate() - 6);

		const startIso = isoDate(start);
		const endIso = todayIso();

		const entries = await logEntriesBetween(startIso, endIso);
		const byDate = new Map<string, { calories: number; protein_g: number }>();
		for (const e of entries) {
			const food = await getFood(e.food_id);
			if (!food) continue;
			const cur = byDate.get(e.date) ?? { calories: 0, protein_g: 0 };
			cur.calories += nutritionForGramsExact(food.per_100g.calories, e.grams);
			cur.protein_g += nutritionForGramsExact(food.per_100g.protein_g, e.grams);
			byDate.set(e.date, cur);
		}

		const days: DayTotal[] = [];
		for (let i = 6; i >= 0; i--) {
			const d = new Date(today);
			d.setDate(today.getDate() - i);
			const iso = isoDate(d);
			const t = byDate.get(iso) ?? { calories: 0, protein_g: 0 };
			days.push({
				date: iso,
				calories: t.calories,
				protein_g: t.protein_g,
				hit: target ? t.calories >= target.calories * 0.8 && t.calories <= target.calories * 1.1 : false
			});
		}
		weeklyMacros = days;

		const sessions = await recentSessions(50);
		const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
		weeklyWorkouts = sessions.filter((s) => s.started_at >= sevenDaysAgo && s.ended_at).length;
		totalSessions = sessions.filter((s) => s.ended_at).length;
	}

	function dayLabel(iso: string): string {
		const d = new Date(iso);
		return d.toLocaleDateString('tr-TR', { weekday: 'short' }).slice(0, 2).toUpperCase();
	}

	onMount(() => {
		if (browser) void load();
	});

	const target = $derived(userStore.profile?.macro_targets);
	const maxCal = $derived(Math.max(...weeklyMacros.map((d) => d.calories), target?.calories ?? 1));
</script>

<div class="space-y-4 p-4 pt-6">
	<h1 class="text-2xl font-bold text-slate-100">Gelişim</h1>

	<section class="card space-y-3">
		<div class="flex items-center justify-between">
			<h2 class="font-semibold text-slate-100">Son 7 gün — kalori</h2>
			{#if target}
				<span class="text-xs text-slate-400">Hedef {target.calories}</span>
			{/if}
		</div>
		<div class="flex h-32 items-end justify-between gap-1">
			{#each weeklyMacros as d (d.date)}
				{@const h = (d.calories / maxCal) * 100}
				<div class="flex flex-1 flex-col items-center gap-1">
					<div class="flex h-full w-full items-end">
						<div
							class="w-full rounded-t-md transition-all"
							class:bg-cyan-500={d.hit}
							class:bg-slate-700={!d.hit}
							style="height: {h}%"
						></div>
					</div>
					<span class="text-[10px] text-slate-500">{dayLabel(d.date)}</span>
				</div>
			{/each}
		</div>
	</section>

	<section class="grid grid-cols-2 gap-3">
		<div class="card">
			<p class="text-xs text-slate-500">Bu hafta antrenman</p>
			<p class="text-3xl font-bold text-cyan-400">{weeklyWorkouts}</p>
			<p class="text-xs text-slate-500">
				/ {userStore.profile?.weekly_workout_target ?? 4} hedef
			</p>
		</div>
		<div class="card">
			<p class="text-xs text-slate-500">Toplam antrenman</p>
			<p class="text-3xl font-bold text-slate-100">{totalSessions}</p>
		</div>
	</section>
</div>
