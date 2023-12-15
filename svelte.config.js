import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),

	kit: {
		paths: {
			base: '/account/jmap'
		},
		prerender: {
			handleMissingId: 'ignore',
			handleHttpError: 'warn'
		},
		adapter: adapter()
	}
};

export default config;
