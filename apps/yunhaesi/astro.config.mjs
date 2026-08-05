// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://meonmu437.github.io',
	base: '/yunhaesi',
	integrations: [
		starlight({
			title: '윤해시',
			locales: {
				root: { label: '한국어', lang: 'ko' },
			},
			customCss: ['./src/styles/custom.css'],
			pagefind: false,
			pagination: false,
			components: {
				ThemeSelect: './src/components/ThemeToggle.astro',
				ThemeProvider: './src/components/ThemeProvider.astro',
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
						href: 'https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Noto+Sans+KR:wght@400;500;700;900&display=swap',
					},
				},
			],
			sidebar: [
				{
					label: '윤해시',
					items: [
						{ label: '윤해시', link: '/#sec-intro' },
						{ label: '주요 장소', link: '/#sec-places' },
						{ label: '날씨와 계절', link: '/#sec-weather' },
					],
				},
				{
					label: '사람들',
					items: [
						{ label: '개요', link: '/#sec-people' },
						{ label: '송민하', link: '/#char-minha' },
						{ label: '유수민', link: '/#char-sumin' },
						{ label: '새싹유치원 사람들', link: '/#sec-people-kindergarten' },
						{ label: '윤해시의 꼬맹이들', link: '/#sec-people-kids' },
					],
				},
			],
		}),
	],
});
