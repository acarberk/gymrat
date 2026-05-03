import { tr, type TranslationDict } from './locales/tr';
import { en } from './locales/en';
import { i18n } from './state.svelte';

export { i18n };

const dictionaries: Record<'tr' | 'en', TranslationDict> = { tr, en };

type DotPath<T, P extends string = ''> = T extends string
	? P
	: {
			[K in keyof T & string]: DotPath<T[K], P extends '' ? K : `${P}.${K}`>;
		}[keyof T & string];

export type TKey = DotPath<TranslationDict>;

export function t(key: TKey): string {
	const dict = dictionaries[i18n.locale];
	const parts = (key as string).split('.');
	let cur: unknown = dict;
	for (const p of parts) {
		if (cur && typeof cur === 'object' && p in (cur as Record<string, unknown>)) {
			cur = (cur as Record<string, unknown>)[p];
		} else {
			return key;
		}
	}
	return typeof cur === 'string' ? cur : key;
}
