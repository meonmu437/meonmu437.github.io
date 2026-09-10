// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://meonmu437.github.io',
	base: '/julian',
	integrations: [
		starlight({
			title: 'Julian',
			locales: {
				root: { label: '한국어', lang: 'ko' },
			},
			customCss: ['./src/styles/custom.css'],
			pagefind: false,
			pagination: false,
			components: {
				Head: '../shared/FirstTitleHead.astro',
				ThemeSelect: './src/components/ThemeToggle.astro',
				PageSidebar: './src/components/PageSidebar.astro',
				TwoColumnContent: './src/components/TwoColumnContent.astro',
				MobileMenuToggle: './src/components/MobileMenuToggle.astro',
				SiteTitle: './src/components/SiteTitle.astro',
				Search: './src/components/Search.astro',
			},
			head: [
				{
					tag: 'link',
					attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
				},
				{
					tag: 'link',
					attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
				},
				{
					tag: 'link',
					attrs: {
						rel: 'stylesheet',
						href: 'https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@500;600;700&family=Bebas+Neue&family=Bungee&family=Special+Elite&family=Courier+Prime:wght@400;700&family=Pacifico&family=Playfair+Display:wght@900&family=Fredoka:wght@500;600;700&family=Gaegu:wght@400;700&family=Noto+Sans+KR:wght@400;500;700;900&display=swap',
					},
				},
			],
			sidebar: [
				{
					label: '줄리안',
					items: [
						{ label: '줄리안', link: '/#sec-intro' },
						{ label: '프로필', link: '/#sec-profile' },
						{ label: '외모와 성격', link: '/#sec-appearance' },
						{ label: '좋아하는 것', link: '/#sec-likes' },
					],
				},
				{
					label: '레인보우 빌리지',
					items: [{ label: '마을 안내', link: '/#sec-village' }],
				},
				{
					label: 'BACKROOM',
					items: [
						{ label: 'RESTRICTED', link: '/#sec-restricted' },
						{ label: 'BACKROOM', link: '/#sec-backroom' },
						{ label: 'OPERATION: FALLING', link: '/#sec-closing' },
					],
				},
			],
		}),
	],
});
