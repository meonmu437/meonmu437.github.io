// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://meonmu437.github.io',
	base: '/2004',
	integrations: [
		starlight({
			title: '윤성민 · 2004',
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
						href: 'https://fonts.googleapis.com/css2?family=Do+Hyeon&family=Gowun+Batang:wght@400;700&family=Nanum+Pen+Script&family=Noto+Sans+KR:wght@400;500;700;900&display=swap',
					},
				},
			],
			sidebar: [
				{
					label: '성민, 2004',
					items: [
						{ label: '성민', link: '/#sec-intro' },
						{ label: '현재 재생 중', link: '/#sec-feelings' },
						{ label: '프로필', link: '/#sec-profile' },
						{ label: '외형과 성격', link: '/#sec-appearance' },
						{ label: '취향과 습관', link: '/#sec-taste' },
					],
				},
				{
					label: '2004년의 서울',
					items: [
						{ label: '온음뮤직', link: '/#sec-office' },
						{ label: '연남동 오피스텔', link: '/#sec-home' },
						{ label: '한국대학교', link: '/#sec-campus' },
						{ label: '마무리', link: '/#sec-closing' },
					],
				},
			],
		}),
	],
});
