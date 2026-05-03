<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import TabBar from '$lib/components/TabBar.svelte';
	import { page } from '$app/state';
	import { bootstrapSeed } from '$lib/services/bootstrap';
	import { browser } from '$app/environment';

	let { children } = $props();

	const hideTabBar = $derived(page.url.pathname.startsWith('/onboarding'));

	onMount(() => {
		if (browser) void bootstrapSeed();
	});
</script>

<div class="flex min-h-full flex-col pb-24">
	<main class="flex-1">
		{@render children()}
	</main>
	{#if !hideTabBar}
		<TabBar />
	{/if}
</div>
