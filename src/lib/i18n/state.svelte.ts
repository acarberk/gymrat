import type { Locale } from '$lib/types';
import { DEFAULT_LOCALE } from '$lib/constants';
import { browser } from '$app/environment';

const STORAGE_KEY = 'gymrat:locale';

function readStoredLocale(): Locale {
	if (!browser) return DEFAULT_LOCALE as Locale;
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === 'tr' || stored === 'en') return stored;
	return DEFAULT_LOCALE as Locale;
}

class I18nState {
	locale = $state<Locale>(readStoredLocale());

	setLocale(next: Locale): void {
		this.locale = next;
		if (browser) {
			localStorage.setItem(STORAGE_KEY, next);
			document.documentElement.lang = next;
		}
	}
}

export const i18n = new I18nState();
