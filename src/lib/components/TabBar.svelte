<script lang="ts">
	import { page } from '$app/state';
	import { t } from '$lib/i18n';

	type Tab = {
		href: string;
		labelKey: 'tabs.home' | 'tabs.nutrition' | 'tabs.workout' | 'tabs.progress' | 'tabs.settings';
		icon: string;
	};

	const tabs: Tab[] = [
		{ href: '/', labelKey: 'tabs.home', icon: '🏠' },
		{ href: '/nutrition', labelKey: 'tabs.nutrition', icon: '🍎' },
		{ href: '/workout', labelKey: 'tabs.workout', icon: '🏋️' },
		{ href: '/progress', labelKey: 'tabs.progress', icon: '📈' },
		{ href: '/settings', labelKey: 'tabs.settings', icon: '⚙️' }
	];

	function isActive(href: string): boolean {
		if (href === '/') return page.url.pathname === '/';
		return page.url.pathname.startsWith(href);
	}
</script>

<nav class="tab-bar">
	{#each tabs as tab (tab.href)}
		<a href={tab.href} class="tab-item" class:tab-item-active={isActive(tab.href)}>
			<span class="text-xl leading-none">{tab.icon}</span>
			<span>{t(tab.labelKey)}</span>
		</a>
	{/each}
</nav>
