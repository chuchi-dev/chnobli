import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [svelte()],
	resolve: {
		// use the browser build of svelte, the server build has no mount
		conditions: ['browser'],
	},
	test: {
		environment: 'jsdom',
		include: ['src/**/*.test.ts'],
	},
});
