// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://meonmu437.github.io',
	base: '/seungmin',
	integrations: [
		starlight({
			title: '유승민',
			locales: {
				root: { label: '한국어', lang: 'ko' },
			},
			customCss: ['./src/styles/custom.css'],
			pagefind: false,
			pagination: false,
			components: {
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
						href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Noto+Sans+KR:wght@400;500;700;900&display=swap',
					},
				},
			],
			sidebar: [
				{
					label: '유승민',
					items: [
						{ label: '유승민', link: '/#sec-intro' },
						{ label: '프로필', link: '/#sec-profile' },
						{ label: '외형', link: '/#sec-appearance' },
						{ label: '연애 로직', link: '/#sec-love' },
						{ label: '성격 패키지', link: '/#sec-personality' },
						{ label: '취향', link: '/#sec-taste' },
					],
				},
				{
					label: '냥냥펀치 · 생활',
					items: [
						{ label: '냥냥펀치', link: '/#sec-work' },
						{ label: '승민이네 집', link: '/#sec-home' },
						{ label: '가족 로그', link: '/#sec-family' },
					],
				},
			],
		}),
	],
});
