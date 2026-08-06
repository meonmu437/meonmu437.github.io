// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://meonmu437.github.io',
	base: '/hanminwoo',
	integrations: [
		starlight({
			title: '한민우',
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
						href: 'https://fonts.googleapis.com/css2?family=Song+Myung&family=East+Sea+Dokdo&family=Nanum+Gothic+Coding:wght@400;700&family=Noto+Sans+KR:wght@400;500;700;900&display=swap',
					},
				},
			],
			sidebar: [
				{
					label: '한민우',
					items: [
						{ label: '한민우', link: '/#sec-intro' },
						{ label: '시작과 지금', link: '/#sec-relation' },
						{ label: '프로필', link: '/#sec-profile' },
					],
				},
				{
					label: '청명아파트 5동 804호',
					items: [
						{ label: '집', link: '/#sec-apartment' },
						{ label: '마무리', link: '/#sec-closing' },
					],
				},
			],
		}),
	],
});
