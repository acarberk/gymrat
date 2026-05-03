<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { userStore } from '$lib/state/userStore.svelte';
	import { db } from '$lib/db/schema';
	import { i18n, t } from '$lib/i18n';
	import type { Locale } from '$lib/types';

	async function load(): Promise<void> {
		await userStore.load();
	}

	function setLocale(loc: Locale): void {
		i18n.setLocale(loc);
	}

	async function reset(): Promise<void> {
		if (!confirm(t('settings.reset_confirm'))) return;
		await db.delete();
		localStorage.removeItem('gymrat:seed_version');
		await goto('/onboarding');
		location.reload();
	}

	async function exportData(): Promise<void> {
		const dump = {
			version: 1,
			exported_at: Date.now(),
			users: await db.users.toArray(),
			foods: (await db.foods.toArray()).filter((f) => f.source !== 'curated_tr'),
			food_log: await db.food_log.toArray(),
			sessions: await db.sessions.toArray(),
			sets: await db.sets.toArray(),
			body_metrics: await db.body_metrics.toArray()
		};
		const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `gymrat-${new Date().toISOString().slice(0, 10)}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}

	onMount(() => {
		if (browser) void load();
	});
</script>

<div class="space-y-4 p-4 pt-6">
	<h1 class="text-2xl font-bold text-slate-100">{t('settings.title')}</h1>

	{#if userStore.profile}
		<section class="card space-y-2">
			<h2 class="font-semibold text-slate-100">{t('settings.profile')}</h2>
			<dl class="grid grid-cols-2 gap-2 text-sm">
				<dt class="text-slate-500">İsim</dt>
				<dd class="text-slate-100">{userStore.profile.name ?? '—'}</dd>
				<dt class="text-slate-500">Boy / Kilo</dt>
				<dd class="text-slate-100">
					{userStore.profile.height_cm} cm · {userStore.profile.weight_kg} kg
				</dd>
				<dt class="text-slate-500">Hedef</dt>
				<dd class="text-slate-100">{userStore.profile.goal}</dd>
			</dl>
		</section>

		<section class="card">
			<h2 class="font-semibold text-slate-100">{t('settings.macros')}</h2>
			<div class="mt-2 grid grid-cols-4 gap-2 text-center text-sm">
				<div>
					<p class="text-xs text-slate-500">kcal</p>
					<p class="font-bold text-cyan-400">{userStore.profile.macro_targets.calories}</p>
				</div>
				<div>
					<p class="text-xs text-slate-500">P</p>
					<p class="font-bold text-violet-400">{userStore.profile.macro_targets.protein_g}g</p>
				</div>
				<div>
					<p class="text-xs text-slate-500">C</p>
					<p class="font-bold text-amber-400">{userStore.profile.macro_targets.carbs_g}g</p>
				</div>
				<div>
					<p class="text-xs text-slate-500">F</p>
					<p class="font-bold text-pink-400">{userStore.profile.macro_targets.fat_g}g</p>
				</div>
			</div>
		</section>
	{/if}

	<section class="card space-y-2">
		<h2 class="font-semibold text-slate-100">{t('settings.language')}</h2>
		<div class="grid grid-cols-2 gap-2">
			<button
				class="btn-ghost"
				class:bg-cyan-500={i18n.locale === 'tr'}
				class:text-slate-950={i18n.locale === 'tr'}
				onclick={() => setLocale('tr')}
			>
				Türkçe
			</button>
			<button
				class="btn-ghost"
				class:bg-cyan-500={i18n.locale === 'en'}
				class:text-slate-950={i18n.locale === 'en'}
				onclick={() => setLocale('en')}
			>
				English
			</button>
		</div>
	</section>

	<section class="card space-y-2">
		<button class="btn-ghost w-full" onclick={exportData}>
			📤 {t('settings.export')}
		</button>
	</section>

	<section class="card space-y-2">
		<h2 class="font-semibold text-slate-100">{t('settings.data_sources')}</h2>
		<ul class="space-y-1 text-xs text-slate-400">
			<li>
				<a
					class="underline"
					href="https://world.openfoodfacts.org"
					target="_blank"
					rel="noopener noreferrer">Open Food Facts</a
				> — barkod & paketli ürün (ODbL)
			</li>
			<li>
				<a
					class="underline"
					href="https://github.com/yuhonas/free-exercise-db"
					target="_blank"
					rel="noopener noreferrer">free-exercise-db</a
				> — egzersiz kütüphanesi (Unlicense)
			</li>
			<li>Türk yemek veritabanı — kürasyon, sürekli güncelleniyor</li>
		</ul>
	</section>

	<section class="card">
		<button class="btn-ghost w-full text-rose-400" onclick={reset}>
			{t('settings.reset')}
		</button>
	</section>
</div>
