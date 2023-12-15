import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),

	kit: {
		paths: {
			// ORIGIN=app.test.iroco.co
			// base: '/account/jmap',
			// Pb POST
			// ORIGIN=app.test.iroco.co/account.jmap
			// Réécritures nginx
			// base: '/',
			// base: '', (default)
			//relative: false
		},
		prerender: {
			handleMissingId: 'ignore',
			handleHttpError: 'warn'
		},
		adapter: adapter()
	}
};

export default config;
