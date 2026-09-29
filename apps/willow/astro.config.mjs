// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://meonmu437.github.io',
	base: '/willow',
	integrations: [
		starlight({
			title: '윌로우',
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
						href: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nanum+Pen+Script&family=Noto+Sans+KR:wght@400;500;700;900&family=Roboto+Slab:wght@600;700;900&family=Space+Mono:wght@400;700&display=swap',
					},
				},
			],
			sidebar: [
				{
					label: '레인폴 대학교',
					items: [
						{ label: '학생 포털', link: '/' },
						{ label: '캠퍼스', link: '/#campus' },
						{ label: '기숙사 생활', link: '/#residence' },
					],
				},
				{
					label: '윌로우',
					items: [
						{ label: '학생 기록', link: '/#profile' },
					],
				},
			],
		}),
	],
});
