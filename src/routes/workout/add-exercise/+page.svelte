<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { searchExercises } from '$lib/db/repositories/exercises';
	import { addSet, setsForSession } from '$lib/db/repositories/workouts';
	import { uid } from '$lib/utils/id';
	import { t } from '$lib/i18n';
	import type { Exercise, MuscleGroup } from '$lib/types';

	const sessionId = $derived(page.url.searchParams.get('session') ?? '');

	let query = $state('');
	let muscleFilter = $state<MuscleGroup | 'all'>('all');
	let results = $state<Exercise[]>([]);
	let loading = $state(true);

	const muscles: { value: MuscleGroup | 'all'; label: string }[] = [
		{ value: 'all', label: 'Hepsi' },
		{ value: 'chest', label: 'Göğüs' },
		{ value: 'back', label: 'Sırt' },
		{ value: 'shoulders', label: 'Omuz' },
		{ value: 'biceps', label: 'Biceps' },
		{ value: 'triceps', label: 'Triceps' },
		{ value: 'quads', label: 'Quad' },
		{ value: 'hamstrings', label: 'Hamstring' },
		{ value: 'glutes', label: 'Kalça' },
		{ value: 'calves', label: 'Baldır' },
		{ value: 'core', label: 'Karın' }
	];

	async function load(): Promise<void> {
		loading = true;
		const all = await searchExercises(query, 200);
		results =
			muscleFilter === 'all'
				? all.slice(0, 80)
				: all.filter((e) => e.primary_muscle === muscleFilter).slice(0, 80);
		loading = false;
	}

	$effect(() => {
		const q = query;
		const f = muscleFilter;
		untrack(() => {
			void load();
			void q;
			void f;
		});
	});

	async function pick(ex: Exercise): Promise<void> {
		const existing = await setsForSession(sessionId);
		const existingForEx = existing.filter((s) => s.exercise_id === ex.id);
		await addSet({
			id: uid('set'),
			session_id: sessionId,
			exercise_id: ex.id,
			set_type: 'working',
			order: existingForEx.length,
			reps: 0,
			weight_kg: 0,
			completed: false
		});
		await goto(`/workout/active?id=${sessionId}`);
	}

	onMount(() => {
		if (browser) void load();
	});
</script>

<div class="space-y-4 p-4 pt-6 pb-24">
	<header class="flex items-center gap-3">
		<button class="btn-ghost px-3 py-2 text-sm" onclick={() => goto(`/workout/active?id=${sessionId}`)}>
			{t('common.back')}
		</button>
		<h1 class="flex-1 text-xl font-bold text-slate-100">{t('workout.add_exercise')}</h1>
	</header>

	<input class="input" placeholder={t('common.search')} bind:value={query} />

	<div class="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
		{#each muscles as m (m.value)}
			<button
				class="shrink-0 rounded-full px-3 py-1 text-xs transition-colors"
				class:bg-cyan-500={muscleFilter === m.value}
				class:text-slate-950={muscleFilter === m.value}
				class:bg-slate-800={muscleFilter !== m.value}
				class:text-slate-300={muscleFilter !== m.value}
				onclick={() => (muscleFilter = m.value)}
			>
				{m.label}
			</button>
		{/each}
	</div>

	{#if loading}
		<p class="text-center text-slate-500">{t('common.loading')}</p>
	{:else}
		<ul class="divide-y divide-slate-800 rounded-2xl bg-slate-900 ring-1 ring-slate-800">
			{#each results as ex (ex.id)}
				<li>
					<button
						class="flex w-full items-center justify-between px-4 py-3 text-left active:bg-slate-800"
						onclick={() => pick(ex)}
					>
						<div class="min-w-0 flex-1">
							<p class="truncate font-medium text-slate-100">{ex.name_tr}</p>
							<p class="text-xs text-slate-500">
								{ex.primary_muscle} · {ex.equipment}
							</p>
						</div>
						<span class="text-slate-500">+</span>
					</button>
				</li>
			{:else}
				<li class="p-4 text-center text-sm text-slate-500">{t('common.search')}</li>
			{/each}
		</ul>
	{/if}
</div>
