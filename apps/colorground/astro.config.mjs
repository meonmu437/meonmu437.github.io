// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://meonmu437.github.io',
	base: '/colorground',
	integrations: [
		starlight({
			title: '컬러그라운드',
			locales: {
				root: { label: '한국어', lang: 'ko' },
			},
			customCss: ['./src/styles/custom.css'],
			pagefind: false,
			components: {
				ThemeSelect: './src/components/ThemeToggle.astro',
				PageSidebar: './src/components/PageSidebar.astro',
				TwoColumnContent: './src/components/TwoColumnContent.astro',
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
						href: 'https://fonts.googleapis.com/css2?family=Jua&family=Noto+Sans+KR:wght@400;500;700;900&display=swap',
					},
				},
			],
			sidebar: [
				{
					label: '세계관',
					items: [
						{ label: '세계의 특징', link: '/#sec-features' },
						{ label: '레인보우 빌리지', link: '/#sec-village' },
						{ label: '어린이과학관', link: '/#sec-science-center' },
					],
				},
				{
					label: '설정',
					items: [
						{ label: '두억시니', link: '/#sec-dooeoksini' },
						{ label: '전투 에너지', link: '/#sec-battle-energy' },
						{ label: '컬러 코어', link: '/#sec-color-core' },
						{ label: '각성', link: '/#sec-awakening' },
					],
				},
				{
					label: '세력',
					items: [
						{ label: '컬러 히어로', link: '/#sec-heroes' },
						{ label: '컬러 링크', link: '/#sec-link' },
						{ label: '자율 로봇', link: '/#sec-robots' },
					],
				},
			],
		}),
	],
});
