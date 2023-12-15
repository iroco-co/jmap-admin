import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const pkg = JSON.parse(json);

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),

	kit: {
		version: {
			name: pkg.version
		},
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
