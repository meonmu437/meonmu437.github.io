// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://meonmu437.github.io',
	base: '/1997',
	integrations: [
		starlight({
			title: '윤성민',
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
						href: 'https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Nanum+Pen+Script&family=Noto+Sans+KR:wght@400;500;700;900&display=swap',
					},
				},
			],
			sidebar: [
				{
					label: '윤성민',
					items: [
						{ label: '윤성민', link: '/#sec-intro' },
						{ label: '되감기', link: '/#sec-relation' },
						{ label: '프로필', link: '/#sec-profile' },
						{ label: '외형과 성격', link: '/#sec-appearance' },
						{ label: '취향과 습관', link: '/#sec-taste' },
					],
				},
				{
					label: '1997년의 캠퍼스',
					items: [
						{ label: '옥탑방', link: '/#sec-home' },
						{ label: '한국대학교', link: '/#sec-campus' },
						{ label: 'B-SIDE', link: '/#sec-bside' },
						{ label: '주변 인물', link: '/#sec-people' },
						{ label: '마무리', link: '/#sec-closing' },
					],
				},
			],
		}),
	],
});
