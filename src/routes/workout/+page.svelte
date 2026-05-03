<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import {
		listPrograms,
		recentSessions,
		activeSession,
		startSession,
		templatesForProgram
	} from '$lib/db/repositories/workouts';
	import { uid } from '$lib/utils/id';
	import { t } from '$lib/i18n';
	import type { Program, WorkoutSession, WorkoutTemplate } from '$lib/types';

	let programs = $state<Program[]>([]);
	let history = $state<WorkoutSession[]>([]);
	let active = $state<WorkoutSession | undefined>(undefined);
	let expandedProgram = $state<string | null>(null);
	let templatesForExpanded = $state<WorkoutTemplate[]>([]);

	async function load(): Promise<void> {
		programs = await listPrograms();
		history = await recentSessions(10);
		active = await activeSession();
	}

	async function toggleProgram(id: string): Promise<void> {
		if (expandedProgram === id) {
			expandedProgram = null;
			templatesForExpanded = [];
		} else {
			expandedProgram = id;
			templatesForExpanded = await templatesForProgram(id);
		}
	}

	async function startEmpty(): Promise<void> {
		const id = uid('ws');
		await startSession({
			id,
			name: 'Hızlı antrenman',
			started_at: Date.now()
		});
		await goto(`/workout/active?id=${id}`);
	}

	async function startFromTemplate(tpl: WorkoutTemplate): Promise<void> {
		const id = uid('ws');
		await startSession({
			id,
			template_id: tpl.id,
			name: tpl.name_tr,
			started_at: Date.now()
		});
		await goto(`/workout/active?id=${id}`);
	}

	function fmtDate(ts: number): string {
		const d = new Date(ts);
		return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
	}

	onMount(() => {
		if (browser) void load();
	});
</script>

<div class="space-y-4 p-4 pt-6">
	<h1 class="text-2xl font-bold text-slate-100">{t('workout.title')}</h1>

	{#if active}
		<a href="/workout/active?id={active.id}" class="card block bg-cyan-950 ring-2 ring-cyan-700">
			<p class="text-xs text-cyan-300">Aktif antrenman</p>
			<p class="font-medium text-slate-100">{active.name}</p>
			<p class="text-xs text-slate-400">
				Başlangıç: {new Date(active.started_at).toLocaleTimeString('tr-TR', {
					hour: '2-digit',
					minute: '2-digit'
				})}
			</p>
		</a>
	{:else}
		<button class="btn-primary w-full" onclick={startEmpty}>
			{t('workout.start_empty')}
		</button>
	{/if}

	<section class="space-y-3">
		<h2 class="text-sm font-semibold uppercase tracking-wider text-slate-400">
			{t('workout.programs')}
		</h2>
		{#each programs as p (p.id)}
			<div class="card space-y-3">
				<button class="flex w-full items-start justify-between text-left" onclick={() => toggleProgram(p.id)}>
					<div class="min-w-0 flex-1">
						<p class="font-semibold text-slate-100">{p.name_tr}</p>
						<p class="text-xs text-slate-400">{p.description_tr}</p>
						<p class="mt-1 text-xs text-slate-500">
							{p.frequency_per_week}x/hafta · {p.level}
						</p>
					</div>
					<span class="text-slate-500">{expandedProgram === p.id ? '▾' : '▸'}</span>
				</button>

				{#if expandedProgram === p.id}
					<ul class="space-y-2">
						{#each templatesForExpanded as tpl (tpl.id)}
							<li>
								<button
									class="flex w-full items-center justify-between rounded-xl bg-slate-800 px-3 py-2 active:bg-slate-700"
									onclick={() => startFromTemplate(tpl)}
								>
									<span class="font-medium text-slate-100">{tpl.name_tr}</span>
									<span class="text-xs text-slate-400">{tpl.exercises.length} egzersiz →</span>
								</button>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/each}
	</section>

	{#if history.length > 0}
		<section class="space-y-2">
			<h2 class="text-sm font-semibold uppercase tracking-wider text-slate-400">
				{t('workout.history')}
			</h2>
			<ul class="card divide-y divide-slate-800">
				{#each history as s (s.id)}
					<li class="flex items-center justify-between py-3 first:pt-0 last:pb-0">
						<div>
							<p class="font-medium text-slate-100">{s.name}</p>
							<p class="text-xs text-slate-500">
								{fmtDate(s.started_at)}{s.ended_at
									? ` · ${Math.round((s.ended_at - s.started_at) / 60000)} dk`
									: ' · sürüyor'}
							</p>
						</div>
						<span class="text-xs text-slate-500">{s.ended_at ? '✓' : '⏱'}</span>
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</div>
