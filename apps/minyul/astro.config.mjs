import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
export default defineConfig({
 site:'https://meonmu437.github.io',base:'/minyul',trailingSlash:'always',devToolbar:{enabled:false},
 integrations:[starlight({
  title:'九旻栗',favicon:'/favicon.svg',locales:{root:{label:'한국어',lang:'ko'}},pagefind:false,pagination:false,
  customCss:['./src/styles/archive.css'],
  components:{Head:'../shared/FirstTitleHead.astro',SiteTitle:'./src/components/SiteTitle.astro',Search:'./src/components/Search.astro',ThemeSelect:'./src/components/ThemeToggle.astro',PageSidebar:'./src/components/PageSidebar.astro',TwoColumnContent:'./src/components/TwoColumnContent.astro',MobileMenuToggle:'./src/components/MobileMenuToggle.astro'},
  head:[{tag:'link',attrs:{rel:'preload',href:'/minyul/fonts/shilla-culture-m.woff2',as:'font',type:'font/woff2',crossorigin:'anonymous'}},{tag:'link',attrs:{rel:'preload',href:'/minyul/fonts/title-calligraphy.ttf?v=talismans3',as:'font',type:'font/ttf',crossorigin:'anonymous'}},{tag:'link',attrs:{rel:'preload',href:'/minyul/fonts/shilla-culture-b.woff2',as:'font',type:'font/woff2',crossorigin:'anonymous'}},{tag:'link',attrs:{rel:'stylesheet',href:'https://fonts.googleapis.com/css2?family=LXGW+WenKai+TC&text=%E4%B9%9D%E6%97%BB%E6%A0%97%E9%83%BD%E5%9F%8E%E5%A4%9C%E8%A9%B1%E8%84%AB%E5%B7%AB%E5%85%B7%E6%94%AF%E7%B5%A6&display=swap'}},{tag:'link',attrs:{rel:'preconnect',href:'https://fonts.googleapis.com'}},{tag:'link',attrs:{rel:'preconnect',href:'https://fonts.gstatic.com',crossorigin:true}},{tag:'link',attrs:{rel:'stylesheet',href:'https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Noto+Sans+KR:wght@400;500;600;700&display=swap'}}],
  sidebar:[{label:'도성야화',link:'/#top',attrs:{href:'#top'}},{label:'구미호전',link:'/#sec-profile',attrs:{href:'#sec-profile'}},{label:'주식회사 무탈',link:'/#sec-office',attrs:{href:'#sec-office'}},{label:'귀신 · 현장 참고사항',link:'/#sec-ghosts',attrs:{href:'#sec-ghosts'}},{label:'인연록',link:'/#sec-people',attrs:{href:'#sec-people'}},{label:'무구 지급',link:'/#sec-mugu',attrs:{href:'#sec-mugu'}},{label:'의뢰 접수',link:'/#sec-request',attrs:{href:'#sec-request'}}],
 })],
});
