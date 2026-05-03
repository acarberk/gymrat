<script lang="ts">
	import { goto } from '$app/navigation';
	import { onboarding } from '$lib/state/onboarding.svelte';
	import { userStore } from '$lib/state/userStore.svelte';
	import { computeMacroTargets, ageFromBirthYear } from '$lib/utils/calculations';
	import { t } from '$lib/i18n';
	import { UserProfileSchema } from '$lib/types';
	import type { ActivityLevel, Goal, Sex } from '$lib/types';

	type Step = 'welcome' | 'profile' | 'body' | 'activity' | 'goal' | 'summary';

	let step = $state<Step>('welcome');
	const order: Step[] = ['welcome', 'profile', 'body', 'activity', 'goal', 'summary'];
	const stepIndex = $derived(order.indexOf(step));

	const sexOptions: { value: Sex; labelKey: 'onboarding.profile.sex_male' | 'onboarding.profile.sex_female' }[] = [
		{ value: 'male', labelKey: 'onboarding.profile.sex_male' },
		{ value: 'female', labelKey: 'onboarding.profile.sex_female' }
	];

	const activityOptions: {
		value: ActivityLevel;
		labelKey:
			| 'onboarding.activity.sedentary'
			| 'onboarding.activity.light'
			| 'onboarding.activity.moderate'
			| 'onboarding.activity.active'
			| 'onboarding.activity.very_active';
		descKey:
			| 'onboarding.activity.sedentary_desc'
			| 'onboarding.activity.light_desc'
			| 'onboarding.activity.moderate_desc'
			| 'onboarding.activity.active_desc'
			| 'onboarding.activity.very_active_desc';
	}[] = [
		{
			value: 'sedentary',
			labelKey: 'onboarding.activity.sedentary',
			descKey: 'onboarding.activity.sedentary_desc'
		},
		{
			value: 'light',
			labelKey: 'onboarding.activity.light',
			descKey: 'onboarding.activity.light_desc'
		},
		{
			value: 'moderate',
			labelKey: 'onboarding.activity.moderate',
			descKey: 'onboarding.activity.moderate_desc'
		},
		{
			value: 'active',
			labelKey: 'onboarding.activity.active',
			descKey: 'onboarding.activity.active_desc'
		},
		{
			value: 'very_active',
			labelKey: 'onboarding.activity.very_active',
			descKey: 'onboarding.activity.very_active_desc'
		}
	];

	const goalOptions: {
		value: Goal;
		labelKey:
			| 'onboarding.goal.cut'
			| 'onboarding.goal.maintain'
			| 'onboarding.goal.lean_bulk'
			| 'onboarding.goal.bulk';
		descKey:
			| 'onboarding.goal.cut_desc'
			| 'onboarding.goal.maintain_desc'
			| 'onboarding.goal.lean_bulk_desc'
			| 'onboarding.goal.bulk_desc';
	}[] = [
		{ value: 'cut', labelKey: 'onboarding.goal.cut', descKey: 'onboarding.goal.cut_desc' },
		{
			value: 'maintain',
			labelKey: 'onboarding.goal.maintain',
			descKey: 'onboarding.goal.maintain_desc'
		},
		{
			value: 'lean_bulk',
			labelKey: 'onboarding.goal.lean_bulk',
			descKey: 'onboarding.goal.lean_bulk_desc'
		},
		{ value: 'bulk', labelKey: 'onboarding.goal.bulk', descKey: 'onboarding.goal.bulk_desc' }
	];

	const macros = $derived.by(() => {
		const d = onboarding.draft;
		if (
			!d.sex ||
			!d.birth_year ||
			!d.height_cm ||
			!d.weight_kg ||
			!d.activity_level ||
			!d.goal
		) {
			return null;
		}
		return computeMacroTargets({
			sex: d.sex,
			age: ageFromBirthYear(d.birth_year),
			height_cm: d.height_cm,
			weight_kg: d.weight_kg,
			activity: d.activity_level,
			goal: d.goal
		});
	});

	function next(): void {
		const i = order.indexOf(step);
		if (i < order.length - 1) step = order[i + 1];
	}

	function prev(): void {
		const i = order.indexOf(step);
		if (i > 0) step = order[i - 1];
	}

	async function finish(): Promise<void> {
		const d = onboarding.draft;
		if (
			!d.sex ||
			!d.birth_year ||
			!d.height_cm ||
			!d.weight_kg ||
			!d.activity_level ||
			!d.goal ||
			!macros
		) {
			return;
		}

		const profile = UserProfileSchema.parse({
			id: 'me',
			created_at: Date.now(),
			updated_at: Date.now(),
			locale: 'tr',
			unit_system: 'metric',
			name: d.name,
			sex: d.sex,
			birth_year: d.birth_year,
			height_cm: d.height_cm,
			weight_kg: d.weight_kg,
			activity_level: d.activity_level,
			goal: d.goal,
			macro_targets: macros,
			weekly_workout_target: d.weekly_workout_target ?? 4
		});

		await userStore.save(profile);
		onboarding.reset();
		await goto('/');
	}

	const canNext = $derived.by(() => {
		const d = onboarding.draft;
		switch (step) {
			case 'welcome':
				return true;
			case 'profile':
				return !!d.sex && !!d.birth_year && d.birth_year > 1900;
			case 'body':
				return !!d.height_cm && !!d.weight_kg;
			case 'activity':
				return !!d.activity_level;
			case 'goal':
				return !!d.goal;
			case 'summary':
				return true;
		}
	});
</script>

<div class="flex min-h-screen flex-col p-6">
	{#if step !== 'welcome'}
		<div class="mb-6 flex items-center gap-1">
			{#each order.slice(1) as _, i (i)}
				<div
					class="h-1 flex-1 rounded-full transition-colors"
					class:bg-cyan-500={i <= stepIndex - 1}
					class:bg-slate-800={i > stepIndex - 1}
				></div>
			{/each}
		</div>
	{/if}

	<div class="flex-1">
		{#if step === 'welcome'}
			<div class="flex h-full flex-col items-center justify-center gap-6 text-center">
				<div class="text-6xl">🏋️</div>
				<h1 class="text-3xl font-bold text-slate-100">{t('onboarding.welcome.title')}</h1>
				<p class="max-w-sm text-slate-400">{t('onboarding.welcome.subtitle')}</p>
				<button class="btn-primary mt-6 w-full max-w-xs" onclick={next}>
					{t('onboarding.welcome.cta')}
				</button>
			</div>
		{:else if step === 'profile'}
			<div class="space-y-5">
				<h2 class="text-2xl font-bold text-slate-100">{t('onboarding.profile.title')}</h2>

				<div class="space-y-2">
					<label class="label" for="name">{t('onboarding.profile.name_label')}</label>
					<input
						id="name"
						type="text"
						class="input"
						placeholder={t('onboarding.profile.name_placeholder')}
						bind:value={
							() => onboarding.draft.name ?? '',
							(v) => onboarding.patch({ name: v })
						}
					/>
				</div>

				<div class="space-y-2">
					<span class="label">{t('onboarding.profile.sex_label')}</span>
					<div class="grid grid-cols-2 gap-3">
						{#each sexOptions as opt (opt.value)}
							<button
								type="button"
								class="card text-center"
								class:ring-cyan-500={onboarding.draft.sex === opt.value}
								class:ring-2={onboarding.draft.sex === opt.value}
								onclick={() => onboarding.patch({ sex: opt.value })}
							>
								{t(opt.labelKey)}
							</button>
						{/each}
					</div>
				</div>

				<div class="space-y-2">
					<label class="label" for="birth">{t('onboarding.profile.birth_year_label')}</label>
					<input
						id="birth"
						type="number"
						inputmode="numeric"
						class="input"
						placeholder="1995"
						bind:value={
							() => onboarding.draft.birth_year ?? null,
							(v) => onboarding.patch({ birth_year: v ? Number(v) : undefined })
						}
					/>
				</div>
			</div>
		{:else if step === 'body'}
			<div class="space-y-5">
				<h2 class="text-2xl font-bold text-slate-100">{t('onboarding.body.title')}</h2>

				<div class="space-y-2">
					<label class="label" for="height">
						{t('onboarding.body.height_label')} ({t('common.cm')})
					</label>
					<input
						id="height"
						type="number"
						inputmode="numeric"
						class="input"
						placeholder="175"
						bind:value={
							() => onboarding.draft.height_cm ?? null,
							(v) => onboarding.patch({ height_cm: v ? Number(v) : undefined })
						}
					/>
				</div>

				<div class="space-y-2">
					<label class="label" for="weight">
						{t('onboarding.body.weight_label')} ({t('common.kg')})
					</label>
					<input
						id="weight"
						type="number"
						inputmode="decimal"
						step="0.1"
						class="input"
						placeholder="75"
						bind:value={
							() => onboarding.draft.weight_kg ?? null,
							(v) => onboarding.patch({ weight_kg: v ? Number(v) : undefined })
						}
					/>
				</div>
			</div>
		{:else if step === 'activity'}
			<div class="space-y-3">
				<h2 class="text-2xl font-bold text-slate-100">{t('onboarding.activity.title')}</h2>
				{#each activityOptions as opt (opt.value)}
					<button
						type="button"
						class="card flex w-full flex-col gap-1 text-left"
						class:ring-cyan-500={onboarding.draft.activity_level === opt.value}
						class:ring-2={onboarding.draft.activity_level === opt.value}
						onclick={() => onboarding.patch({ activity_level: opt.value })}
					>
						<span class="font-medium text-slate-100">{t(opt.labelKey)}</span>
						<span class="text-xs text-slate-400">{t(opt.descKey)}</span>
					</button>
				{/each}
			</div>
		{:else if step === 'goal'}
			<div class="space-y-3">
				<h2 class="text-2xl font-bold text-slate-100">{t('onboarding.goal.title')}</h2>
				{#each goalOptions as opt (opt.value)}
					<button
						type="button"
						class="card flex w-full flex-col gap-1 text-left"
						class:ring-cyan-500={onboarding.draft.goal === opt.value}
						class:ring-2={onboarding.draft.goal === opt.value}
						onclick={() => onboarding.patch({ goal: opt.value })}
					>
						<span class="font-medium text-slate-100">{t(opt.labelKey)}</span>
						<span class="text-xs text-slate-400">{t(opt.descKey)}</span>
					</button>
				{/each}

				<div class="space-y-2 pt-2">
					<label class="label" for="weekly">{t('onboarding.goal.weekly_workout')}</label>
					<input
						id="weekly"
						type="number"
						inputmode="numeric"
						min="0"
						max="14"
						class="input"
						placeholder="4"
						bind:value={
							() => onboarding.draft.weekly_workout_target ?? null,
							(v) => onboarding.patch({ weekly_workout_target: v ? Number(v) : undefined })
						}
					/>
				</div>
			</div>
		{:else if step === 'summary'}
			<div class="space-y-4">
				<h2 class="text-2xl font-bold text-slate-100">{t('onboarding.summary.title')}</h2>
				{#if macros}
					<div class="card grid grid-cols-2 gap-4">
						<div>
							<p class="text-xs uppercase tracking-wide text-slate-500">
								{t('onboarding.summary.calories')}
							</p>
							<p class="text-2xl font-bold text-cyan-400">{macros.calories}</p>
						</div>
						<div>
							<p class="text-xs uppercase tracking-wide text-slate-500">
								{t('onboarding.summary.protein')}
							</p>
							<p class="text-2xl font-bold text-violet-400">{macros.protein_g}g</p>
						</div>
						<div>
							<p class="text-xs uppercase tracking-wide text-slate-500">
								{t('onboarding.summary.carbs')}
							</p>
							<p class="text-2xl font-bold text-amber-400">{macros.carbs_g}g</p>
						</div>
						<div>
							<p class="text-xs uppercase tracking-wide text-slate-500">
								{t('onboarding.summary.fat')}
							</p>
							<p class="text-2xl font-bold text-pink-400">{macros.fat_g}g</p>
						</div>
					</div>
				{/if}
				<p class="text-xs text-slate-500">{t('onboarding.summary.explanation')}</p>
			</div>
		{/if}
	</div>

	<div class="mt-6 flex gap-3">
		{#if step !== 'welcome' && step !== 'summary'}
			<button class="btn-ghost flex-1" onclick={prev}>{t('common.back')}</button>
		{/if}
		{#if step === 'summary'}
			<button class="btn-primary flex-1" onclick={finish}>
				{t('onboarding.summary.finish')}
			</button>
		{:else if step !== 'welcome'}
			<button class="btn-primary flex-1" disabled={!canNext} onclick={next}>
				{t('common.next')}
			</button>
		{/if}
	</div>
</div>
