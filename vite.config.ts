import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			strategies: 'generateSW',
			manifest: {
				name: 'Gymrat',
				short_name: 'Gymrat',
				description: 'Beslenme ve antrenman takibi — offline-first, reklamsız',
				theme_color: '#0f172a',
				background_color: '#0f172a',
				display: 'standalone',
				orientation: 'portrait',
				scope: '/',
				start_url: '/',
				lang: 'tr',
				icons: [
					{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
					{ src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
					{ src: '/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
				]
			},
			workbox: {
				globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}'],
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/world\.openfoodfacts\.org\/api\/.*/i,
						handler: 'NetworkFirst',
						options: {
							cacheName: 'openfoodfacts-cache',
							expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 30 },
							cacheableResponse: { statuses: [0, 200] }
						}
					}
				]
			},
			devOptions: {
				enabled: true,
				type: 'module',
				navigateFallback: '/'
			}
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'happy-dom'
	}
});
