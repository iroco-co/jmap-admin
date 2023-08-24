import { sveltekit } from '@sveltejs/kit/vite';
import { configDefaults } from 'vitest/config';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [sveltekit()],
	test: {
		// jest like globals
		globals: true,
		environment: 'jsdom',
		// in-source testing
		includeSource: ['src/**/*.{js,ts,svelte}'],
		// Add @testing-library/jest-dom matchers & mocks of SvelteKit modules
		setupFiles: ['test/setupTest.ts'],
		// Exclude files in c8
		coverage: {
			exclude: ['test/setupTest.ts']
		}
	}
};

export default config;
