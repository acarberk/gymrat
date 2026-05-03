<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { userStore } from '$lib/state/userStore.svelte';
	import { logEntriesForDate } from '$lib/db/repositories/foodLog';
	import { getFood } from '$lib/db/repositories/foods';
	import { activeSession, recentSessions } from '$lib/db/repositories/workouts';
	import { todayIso } from '$lib/utils/id';
	import { nutritionForGramsExact } from '$lib/utils/calculations';
	import { t } from '$lib/i18n';
	import MacroRing from '$lib/components/MacroRing.svelte';
	import type { WorkoutSession } from '$lib/types';

	let totals = $state({ calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 });
	let active = $state<WorkoutSession | undefined>(undefined);
	let weeklyCount = $state(0);

	function greeting(): string {
		const h = new Date().getHours();
		if (h < 11) return t('home.greeting_morning');
		if (h < 18) return t('home.greeting_day');
		return t('home.greeting_evening');
	}

	async function load(): Promise<void> {
		await userStore.load();
		if (!userStore.profile) {
			await goto('/onboarding');
			return;
		}

		const entries = await logEntriesForDate(todayIso());
		const acc = { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 };
		for (const e of entries) {
			const f = await getFood(e.food_id);
			if (!f) continue;
			acc.calories += nutritionForGramsExact(f.per_100g.calories, e.grams);
			acc.protein_g += nutritionForGramsExact(f.per_100g.protein_g, e.grams);
			acc.carbs_g += nutritionForGramsExact(f.per_100g.carbs_g, e.grams);
			acc.fat_g += nutritionForGramsExact(f.per_100g.fat_g, e.grams);
		}
		totals = acc;

		active = await activeSession();

		const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
		const recent = await recentSessions(20);
		weeklyCount = recent.filter((s) => s.started_at >= sevenDaysAgo && s.ended_at).length;
	}

	onMount(() => {
		if (browser) void load();
	});

	const profile = $derived(userStore.profile);
	const target = $derived(profile?.macro_targets);
	const remaining = $derived(target ? Math.max(0, target.calories - totals.calories) : 0);
</script>

{#if !userStore.loaded}
	<div class="flex h-screen items-center justify-center text-slate-400">
		{t('common.loading')}
	</div>
{:else if profile && target}
	<div class="space-y-4 p-4 pt-6">
		<header class="flex items-baseline justify-between">
			<div>
				<p class="text-sm text-slate-400">{greeting()}</p>
				<h1 class="text-2xl font-bold text-slate-100">{profile.name ?? 'Gymrat'}</h1>
			</div>
			<div class="text-right">
				<p class="text-xs uppercase tracking-wide text-slate-500">{t('home.today_summary')}</p>
				<p class="text-3xl font-bold text-cyan-400">{Math.round(remaining)}</p>
				<p class="text-xs text-slate-400">{t('home.calories_remaining')}</p>
			</div>
		</header>

		<section class="card">
			<div class="grid grid-cols-4 gap-2">
				<MacroRing
					value={totals.calories}
					target={target.calories}
					label={t('onboarding.summary.calories')}
					unit=""
					color="#22d3ee"
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

		<section class="grid grid-cols-2 gap-3">
			<a href="/nutrition" class="card flex flex-col gap-1 text-left">
				<span class="text-2xl">🍎</span>
				<span class="font-medium text-slate-100">{t('home.quick_add_food')}</span>
				<span class="text-xs text-slate-400">{t('nutrition.title')}</span>
			</a>
			<a href="/workout" class="card flex flex-col gap-1 text-left">
				<span class="text-2xl">🏋️</span>
				<span class="font-medium text-slate-100">
					{active ? t('workout.finish_workout') : t('home.start_workout')}
				</span>
				<span class="text-xs text-slate-400">
					{weeklyCount} / {profile.weekly_workout_target} {t('common.sets')}
				</span>
			</a>
		</section>

		{#if active}
			<a href="/workout/active" class="card block bg-cyan-950 ring-cyan-700">
				<p class="text-xs text-cyan-300">Aktif antrenman</p>
				<p class="font-medium text-slate-100">{active.name}</p>
			</a>
		{/if}
	</div>
{/if}
