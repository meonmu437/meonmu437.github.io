// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    site: 'https://meonmu437.github.io',
    base: '/anemoi',
    vite: {
        plugins: [tailwindcss()],
    },
    integrations: [starlight({
        title: 'ANEMOI',
        locales: {
            root: { label: '한국어', lang: 'ko' },
        },
        // tailwind.css는 라파엘 위젯 미리보기(JSX)에 쓰인 Tailwind 클래스를
        // 위한 것 — utilities 레이어만 불러오고 preflight는 제외했으므로
        // custom.css보다 먼저 와도(또는 나중이어도) 본문 스타일과 충돌하지
        // 않는다.
        customCss: ['./src/styles/tailwind.css', './src/styles/custom.css'],
        pagefind: false,
        pagination: false,
        components: {
            ThemeProvider: './src/components/ThemeProvider.astro',
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
                    href: 'https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&family=Noto+Serif+KR:wght@400;500;600;700&family=Noto+Sans+KR:wght@400;500;700&family=Pinyon+Script&display=swap',
                },
            },
        ],
        sidebar: [
            {
                label: '세계관',
                items: [
                    { label: '네 바람과 제국', link: '/#sec-overview' },
                    { label: '크리스탈 코어', link: '/#sec-cores' },
                    { label: '황도와 제국의 질서', link: '/#sec-capital' },
                    { label: '네 가문과 영지', link: '/#sec-houses' },
                ],
            },
            {
                label: '인물',
                items: [
                    { label: '라파엘 에르덴', link: '/#sec-raphael' },
                    { label: '황실 사냥대', link: '/#sec-hunt-squad' },
                ],
            },
            {
                label: '부록',
                items: [
                    { label: '문서 미리보기', link: '/#sec-jsx-preview' },
                    { label: '크리스탈 코어 생성기', link: '/#sec-core-generator' },
                ],
            },
        ],
		}), react()],
});
