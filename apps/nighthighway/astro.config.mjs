// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    site: 'https://meonmu437.github.io',
    base: '/nighthighway',
    integrations: [starlight({
        title: 'NIGHT HIGHWAY',
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
                    href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Nanum+Gothic+Coding:wght@400;700&family=Noto+Sans+KR:wght@400;500;700;900&display=swap',
                },
            },
        ],
        sidebar: [
            {
                label: '세계관',
                items: [
                    { label: 'NIGHT HIGHWAY', link: '/#sec-intro' },
                    { label: '배경', link: '/#sec-background' },
                    { label: '도시와 기반 시설', link: '/#sec-city' },
                    { label: '기술 수준', link: '/#sec-tech' },
                ],
            },
            {
                label: '생존',
                items: [
                    { label: '낮과 밤', link: '/#sec-day-night' },
                    { label: '야간 이동의 위험', link: '/#sec-night-travel' },
                    { label: '자원과 정보', link: '/#sec-resources' },
                ],
            },
            {
                label: '정거장',
                items: [
                    { label: '정거장', link: '/#sec-stations' },
                    { label: '유럽권 주요 정거장', link: '/#sec-stations-directory' },
                ],
            },
            {
                label: '사람들',
                items: [
                    {
                        label: '라이더',
                        items: [
                            { label: '개요', link: '/#sec-riders' },
                            { label: 'Noé (COYOTE)', link: '/#rider-noe' },
                            { label: 'Camille (CANARY)', link: '/#rider-camille' },
                        ],
                    },
                    { label: '지도 제작자', link: '/#sec-cartographers' },
                ],
            },
            {
                label: '질서와 화폐',
                items: [
                    { label: '세력과 갈등', link: '/#sec-factions' },
                    { label: '화폐와 거래', link: '/#sec-currency' },
                ],
            },
            {
                label: '단말기',
                items: [
                    { label: '무선 단말 미리보기', link: '/#sec-jsx-preview' },
                ],
            },
        ],
		}), react()],
});