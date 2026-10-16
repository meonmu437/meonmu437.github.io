import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://meonmu437.github.io',
  base: '/jude',
  devToolbar: { enabled: false },
  integrations: [starlight({
    title: 'Jude',
    favicon: '/favicon.svg',
    locales: { root: { label: '한국어', lang: 'ko' } },
    customCss: ['./src/styles/hotel.css'],
    pagefind: false,
    pagination: false,
    components: {
      Head: '../shared/FirstTitleHead.astro',
      ThemeProvider: './src/components/NightTheme.astro',
      ThemeSelect: './src/components/ThemeToggle.astro',
      PageSidebar: './src/components/PageSidebar.astro',
      TwoColumnContent: './src/components/TwoColumnContent.astro',
      MobileMenuToggle: './src/components/MobileMenuToggle.astro',
      SiteTitle: './src/components/SiteTitle.astro',
      Search: './src/components/Search.astro',
    },
    head: [
      {tag:'link',attrs:{rel:'preconnect',href:'https://fonts.googleapis.com'}},
      {tag:'link',attrs:{rel:'preconnect',href:'https://fonts.gstatic.com',crossorigin:true}},
      {tag:'link',attrs:{rel:'stylesheet',href:'https://fonts.googleapis.com/css2?family=Kristi&display=swap'}},
      {tag:'link',attrs:{rel:'stylesheet',href:'https://fonts.googleapis.com/css2?family=Nanum+Gothic+Coding:wght@400;700&display=swap'}},
      {tag:'link',attrs:{rel:'stylesheet',href:'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Noto+Sans+KR:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Courier+Prime:wght@400;700&family=Special+Elite&family=Nanum+Pen+Script&family=Nanum+Brush+Script&family=Caveat:wght@400;600&family=Gowun+Batang:wght@400;700&display=swap'}},
    ],
    sidebar: [
      {label:'주드',items:[{label:'인트로',link:'/#front-desk'},{label:'프로필 · 외모와 성격',link:'/#night-clerk'}]},
      {label:'벨윅 호텔',items:[{label:'호텔 안내',link:'/#hotel-guide'},{label:'관계자 외 출입금지',link:'/#staff-door'}]},
      {label:'직원 전용',items:[{label:'요원 기록',link:'/#agent-title'},{label:'안전가옥 · 3A',link:'/#room-3a'},{label:'Undertow',link:'/#team-title'},{label:'아카데미 동기',link:'/#classmate-title'}]},
      {label:'이야기 시작하기',link:'/#checkout-title'},
    ],
  })],
});
