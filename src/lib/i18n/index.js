import { register, init } from 'svelte-i18n';
import { browser } from '$app/environment';

export const defaultLocale = 'fr';

register('en', () => import('./en.json'));
register('fr', () => import('./fr.json'));

init({
	fallbackLocale: defaultLocale,
	initialLocale: browser ? window.navigator.language : defaultLocale
});
