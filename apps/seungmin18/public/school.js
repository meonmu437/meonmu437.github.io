const pages = [...document.querySelectorAll('main > .page')];
const navigation = [...document.querySelectorAll('.main-nav [data-go]')];
const contentDialog = document.getElementById('content-dialog');
const dialogTitle = document.getElementById('dialog-title');
const dialogBody = document.getElementById('dialog-body');
const noticeData = JSON.parse(document.getElementById('notice-data').textContent);
const destinations = { campus: 'campus-map', club: 'club', meal: 'meal' };

function navigate(id, anchor, updateHistory = true, focus = true) {
  const page = pages.find(page => page.id === id) || pages[0];
  pages.forEach(item => { item.hidden = item !== page; });
  navigation.forEach(link => {
    if (link.dataset.go === page.id) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.querySelectorAll('.related[open]').forEach(menu => { menu.open = false; });
  const alias = Object.keys(destinations).find(key => destinations[key] === anchor);
  if (updateHistory) history.pushState(null, '', `#${page.id}${alias ? '/' + alias : ''}`);
  if (anchor && page.querySelector(`#${anchor}`)) page.querySelector(`#${anchor}`).scrollIntoView({ block: 'start' });
  else {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (focus) {
      const title = page.querySelector('h1');
      title?.setAttribute('tabindex', '-1');
      title?.focus({ preventScroll: true });
    }
  }
}

function readRoute() {
  const [id = 'home', anchor] = location.hash.slice(1).split('/');
  navigate(id || 'home', destinations[anchor], false, false);
}
document.querySelectorAll('[data-go]').forEach(link => link.addEventListener('click', event => {
  if (event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  if (contentDialog.open) contentDialog.close();
  navigate(link.dataset.go, link.dataset.anchor);
}));
window.addEventListener('popstate', readRoute);
window.addEventListener('hashchange', readRoute);
readRoute();

const newsTabs = [...document.querySelectorAll('[data-news]')];
function showNews(tab) {
  newsTabs.forEach(item => item.setAttribute('aria-selected', String(item === tab)));
  document.getElementById('notice-list').hidden = tab.dataset.news !== 'notices';
  document.getElementById('news-list').hidden = tab.dataset.news !== 'news';
}
newsTabs.forEach(tab => {
  tab.addEventListener('click', () => showNews(tab));
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? newsTabs[0] : event.key === 'End' ? newsTabs.at(-1) : newsTabs.find(item => item !== tab);
    showNews(next); next.focus();
  });
});
document.querySelectorAll('[data-notice]').forEach(button => button.addEventListener('click', () => {
  const notice = noticeData[button.dataset.notice];
  dialogTitle.textContent = notice.title;
  dialogBody.replaceChildren(document.createTextNode(notice.text));
  contentDialog.showModal();
}));

const imageDialog = document.getElementById('image-dialog');
const largeImage = document.getElementById('large-image');
document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => {
  largeImage.src = button.dataset.image; largeImage.alt = button.dataset.imageAlt; imageDialog.showModal();
}));
imageDialog.addEventListener('close', () => largeImage.removeAttribute('src'));
document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
}));
document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
  const feedback = document.getElementById('copy-feedback');
  try { await navigator.clipboard.writeText(button.dataset.copy); feedback.textContent = `${button.dataset.copy} 명령어를 복사했습니다.`; }
  catch { feedback.textContent = `복사를 지원하지 않는 환경입니다. ${button.dataset.copy}를 직접 입력해 주세요.`; }
}));

document.addEventListener('click', event => {
  document.querySelectorAll('.related[open]').forEach(menu => { if (!menu.contains(event.target)) menu.open = false; });
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') document.querySelectorAll('.related[open]').forEach(menu => { menu.open = false; menu.querySelector('summary').focus(); });
});
