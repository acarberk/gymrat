<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import {
		getSession,
		setsForSession,
		addSet,
		updateSet,
		removeSet,
		endSession,
		getTemplate,
		setsForExercise
	} from '$lib/db/repositories/workouts';
	import { getExercise } from '$lib/db/repositories/exercises';
	import { uid } from '$lib/utils/id';
	import { epley1RM } from '$lib/utils/calculations';
	import { t } from '$lib/i18n';
	import type { Exercise, WorkoutSession, WorkoutSet, WorkoutTemplate } from '$lib/types';

	const sessionId = $derived(page.url.searchParams.get('id') ?? '');

	let session = $state<WorkoutSession | undefined>(undefined);
	let template = $state<WorkoutTemplate | undefined>(undefined);
	let sets = $state<WorkoutSet[]>([]);
	let exerciseCache = $state<Record<string, Exercise>>({});
	let lastSetCache = $state<Record<string, WorkoutSet | undefined>>({});
	let busy = $state(false);

	async function load(): Promise<void> {
		if (!sessionId) {
			await goto('/workout');
			return;
		}
		const s = await getSession(sessionId);
		if (!s) {
			await goto('/workout');
			return;
		}
		session = s;
		if (s.template_id) {
			template = await getTemplate(s.template_id);
		}
		await refreshSets();

		const exerciseIds = new Set<string>();
		for (const set of sets) exerciseIds.add(set.exercise_id);
		if (template) for (const e of template.exercises) exerciseIds.add(e.exercise_id);

		const cache: Record<string, Exercise> = {};
		const lastCache: Record<string, WorkoutSet | undefined> = {};
		for (const id of exerciseIds) {
			const ex = await getExercise(id);
			if (ex) cache[id] = ex;
			const history = await setsForExercise(id, 50);
			const completed = history
				.filter((h) => h.completed && h.session_id !== sessionId)
				.sort((a, b) => b.session_id.localeCompare(a.session_id));
			lastCache[id] = completed[0];
		}
		exerciseCache = cache;
		lastSetCache = lastCache;
	}

	async function refreshSets(): Promise<void> {
		sets = await setsForSession(sessionId);
	}

	function exerciseIdsOnPage(): string[] {
		const ordered: string[] = [];
		const seen = new Set<string>();
		if (template) {
			for (const e of template.exercises) {
				if (!seen.has(e.exercise_id)) {
					seen.add(e.exercise_id);
					ordered.push(e.exercise_id);
				}
			}
		}
		for (const set of sets) {
			if (!seen.has(set.exercise_id)) {
				seen.add(set.exercise_id);
				ordered.push(set.exercise_id);
			}
		}
		return ordered;
	}

	function setsForExerciseOnSession(exerciseId: string): WorkoutSet[] {
		return sets
			.filter((s) => s.exercise_id === exerciseId)
			.sort((a, b) => a.order - b.order);
	}

	async function addSetFor(exerciseId: string): Promise<void> {
		const existing = setsForExerciseOnSession(exerciseId);
		const previous = existing.at(-1) ?? lastSetCache[exerciseId];
		const newSet: WorkoutSet = {
			id: uid('set'),
			session_id: sessionId,
			exercise_id: exerciseId,
			set_type: 'working',
			order: existing.length,
			reps: previous?.reps ?? 0,
			weight_kg: previous?.weight_kg ?? 0,
			completed: false
		};
		await addSet(newSet);
		await refreshSets();
	}

	async function patchSet(id: string, patch: Partial<WorkoutSet>): Promise<void> {
		await updateSet(id, patch);
		await refreshSets();
	}

	async function deleteSet(id: string): Promise<void> {
		await removeSet(id);
		await refreshSets();
	}

	async function finish(): Promise<void> {
		busy = true;
		try {
			await endSession(sessionId);
			await goto('/workout');
		} finally {
			busy = false;
		}
	}

	onMount(() => {
		if (browser) void load();
	});

	const elapsed = $derived(
		session ? Math.max(0, Math.round((Date.now() - session.started_at) / 60000)) : 0
	);
</script>

<div class="space-y-4 p-4 pt-6 pb-32">
	{#if session}
		<header class="flex items-baseline justify-between">
			<div>
				<h1 class="text-xl font-bold text-slate-100">{session.name}</h1>
				<p class="text-xs text-slate-500">{elapsed} dk · {sets.filter((s) => s.completed).length} set tamamlandı</p>
			</div>
			<button class="text-xs text-slate-500 active:text-rose-400" onclick={() => goto('/workout')}>
				kapat
			</button>
		</header>

		{#each exerciseIdsOnPage() as exId (exId)}
			{@const ex = exerciseCache[exId]}
			{@const exSets = setsForExerciseOnSession(exId)}
			{@const tplEx = template?.exercises.find((e) => e.exercise_id === exId)}
			{@const last = lastSetCache[exId]}
			<section class="card space-y-3">
				<div class="flex items-baseline justify-between">
					<div class="min-w-0 flex-1">
						<p class="truncate font-semibold text-slate-100">
							{ex?.name_tr ?? exId}
						</p>
						{#if tplEx}
							<p class="text-xs text-slate-400">
								Hedef {tplEx.target_sets}x{tplEx.target_reps_min}-{tplEx.target_reps_max}
							</p>
						{/if}
						{#if last}
							<p class="text-xs text-slate-500">
								{t('workout.previous')}: {last.weight_kg}kg × {last.reps} (1RM ≈ {epley1RM(last.weight_kg, last.reps)})
							</p>
						{/if}
					</div>
				</div>

				{#if exSets.length > 0}
					<table class="w-full text-sm">
						<thead>
							<tr class="text-xs text-slate-500">
								<th class="w-8 text-left">#</th>
								<th class="text-left">{t('workout.weight')} (kg)</th>
								<th class="text-left">{t('workout.reps')}</th>
								<th class="w-12"></th>
								<th class="w-8"></th>
							</tr>
						</thead>
						<tbody>
							{#each exSets as set, i (set.id)}
								<tr class="align-middle">
									<td class="py-1 text-slate-500">{i + 1}</td>
									<td class="py-1 pr-2">
										<input
											type="number"
											inputmode="decimal"
											step="0.5"
											class="w-full rounded-lg bg-slate-800 px-2 py-2 text-slate-100 ring-1 ring-slate-700 focus:ring-cyan-500 focus:outline-none"
											value={set.weight_kg}
											onchange={(e) => patchSet(set.id, { weight_kg: Number((e.target as HTMLInputElement).value) || 0 })}
										/>
									</td>
									<td class="py-1 pr-2">
										<input
											type="number"
											inputmode="numeric"
											class="w-full rounded-lg bg-slate-800 px-2 py-2 text-slate-100 ring-1 ring-slate-700 focus:ring-cyan-500 focus:outline-none"
											value={set.reps}
											onchange={(e) => patchSet(set.id, { reps: Number((e.target as HTMLInputElement).value) || 0 })}
										/>
									</td>
									<td class="py-1">
										<button
											class="rounded-lg px-2 py-2 text-lg transition-colors"
											class:bg-emerald-500={set.completed}
											class:text-slate-950={set.completed}
											class:bg-slate-800={!set.completed}
											class:text-slate-400={!set.completed}
											onclick={() => patchSet(set.id, { completed: !set.completed })}
											aria-label="Tamamla"
										>
											✓
										</button>
									</td>
									<td class="py-1 text-right">
										<button class="text-slate-500 active:text-rose-400" onclick={() => deleteSet(set.id)}>
											✕
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				{/if}

				<button class="btn-ghost w-full text-sm" onclick={() => addSetFor(exId)}>
					+ {t('workout.set')}
				</button>
			</section>
		{/each}

		<a href="/workout/add-exercise?session={sessionId}" class="btn-ghost block w-full text-center">
			+ {t('workout.add_exercise')}
		</a>
	{/if}
</div>

{#if session}
	<div
		class="fixed inset-x-0 bottom-0 z-50 border-t border-slate-800 bg-slate-950/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur"
	>
		<button class="btn-primary w-full" disabled={busy} onclick={finish}>
			{t('workout.finish_workout')}
		</button>
	</div>
{/if}
