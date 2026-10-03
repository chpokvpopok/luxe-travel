// Общий код для всех страниц: шапка, подвал, WhatsApp, карточки, формы.
// Данные лежат в data.js — подключайте его перед этим файлом.

const waLink = (text) => 'https://wa.me/' + SITE.waPhone + '?text=' + encodeURIComponent(text);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const dirById = (id) => DIRECTIONS.find((d) => d.id === id);

// main: true — пункт виден в шапке, остальные только в боковой панели
const NAV = [
  { href: 'index.html',      page: 'home',       title: 'Главная' },
  { href: 'tours.html',      page: 'tours',      title: 'Горящие туры', main: true },
  { href: 'directions.html', page: 'directions', title: 'Направления',  main: true },
  { href: 'hotels.html',     page: 'hotels',     title: 'Отели',        main: true },
  { href: 'services.html',   page: 'services',   title: 'Услуги' },
  { href: 'about.html',      page: 'about',      title: 'О нас' },
  { href: 'faq.html',        page: 'faq',        title: 'Вопросы' },
  { href: 'contacts.html',   page: 'contacts',   title: 'Контакты' }
];

// ---------- Шапка и подвал ----------
function renderLayout() {
  const current = document.body.dataset.page;
  const link = (n, cls) =>
    '<a href="' + n.href + '"' + (cls ? ' class="' + cls + '"' : '') + (n.page === current ? ' aria-current="page"' : '') + '>' + n.title + '</a>';
  const links = NAV.filter((n) => n.main).map((n) => link(n)).join('');
  // В панели все разделы; главные скрыты на широком экране — они уже есть в шапке
  const drawerLinks = NAV.map((n) => link(n, n.main ? 'is-main' : '')).join('');

  document.body.insertAdjacentHTML('afterbegin',
    '<header class="header"><div class="wrap">' +
      '<a href="index.html" class="logo" aria-label="Luxe Travel, на главную"><b>LUXE</b><span>TRAVEL</span></a>' +
      '<nav class="nav" aria-label="Основные разделы">' + links + '</nav>' +
      '<div class="header-actions">' +
        '<a class="btn btn-gold js-wa" data-text="Здравствуйте! Хочу подобрать тур." href="#">Написать в WhatsApp</a>' +
        '<button type="button" class="burger" aria-expanded="false" aria-controls="drawer">' +
          '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M3 6h14M3 10h14M3 14h14"/></svg>Меню</button>' +
      '</div>' +
    '</div></header>' +
    '<div class="drawer-backdrop" hidden></div>' +
    '<aside class="drawer" id="drawer" aria-label="Меню" aria-hidden="true" inert>' +
      '<div class="drawer-head"><span class="logo"><b>LUXE</b><span>TRAVEL</span></span>' +
        '<button type="button" class="drawer-close" aria-label="Закрыть меню">' +
          '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15"/></svg></button></div>' +
      '<nav class="drawer-nav" aria-label="Все разделы">' + drawerLinks + '</nav>' +
      '<div class="drawer-contacts">' +
        SITE.phones.map((p) => '<a href="' + p.href + '">' + esc(p.text) + '</a>').join('') +
        '<div class="dim">' + esc(SITE.hours) + '</div>' +
        '<a class="btn btn-gold js-wa" data-text="Здравствуйте! Хочу подобрать тур." href="#">Написать в WhatsApp</a>' +
      '</div>' +
    '</aside>');

  const dirLinks = DIRECTIONS.slice(0, 6).map((d) => '<a href="country.html?id=' + d.id + '">' + esc(d.name) + '</a>').join('');
  document.body.insertAdjacentHTML('beforeend',
    '<footer class="footer dark"><div class="wrap cols">' +
      '<div><div class="logo"><b>LUXE</b><span>TRAVEL</span></div><p class="dim">Турагентство в Караганде. Туры с вылетом из Астаны, Алматы и Актау.</p></div>' +
      '<div><h4>Разделы</h4>' + NAV.slice(1).map((n) => '<a href="' + n.href + '">' + n.title + '</a>').join('') + '</div>' +
      '<div><h4>Направления</h4>' + dirLinks + '<a href="directions.html" class="dim">Все направления</a></div>' +
      '<div><h4>Связь</h4>' +
        '<div>' + esc(SITE.address) + '</div><div class="dim">' + esc(SITE.office) + '</div><div class="dim" style="margin-bottom:8px">' + esc(SITE.hours) + '</div>' +
        SITE.phones.map((p) => '<a href="' + p.href + '">' + esc(p.text) + '</a>').join('') +
        '<a class="js-wa" href="#" data-text="Здравствуйте! Хочу подобрать тур.">WhatsApp</a>' +
        '<a href="' + SITE.instagram + '" target="_blank" rel="noopener">Instagram ' + esc(SITE.instagramName) + '</a>' +
      '</div>' +
    '</div><div class="wrap copy">© ' + new Date().getFullYear() + ' Luxe Travel</div></footer>' +
    '<a class="btn btn-gold wa-float js-wa" href="#" data-text="Здравствуйте! Хочу подобрать тур.">WhatsApp</a>');

  const burger = document.querySelector('.burger');
  const drawer = document.getElementById('drawer');
  const backdrop = document.querySelector('.drawer-backdrop');
  const closeBtn = drawer.querySelector('.drawer-close');
  const setDrawer = (open) => {
    drawer.classList.toggle('open', open);
    drawer.toggleAttribute('inert', !open);
    drawer.setAttribute('aria-hidden', String(!open));
    burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('drawer-open', open);
    if (open) { backdrop.hidden = false; requestAnimationFrame(() => backdrop.classList.add('open')); closeBtn.focus(); }
    else { backdrop.classList.remove('open'); setTimeout(() => { backdrop.hidden = true; }, 250); burger.focus(); }
  };
  burger.addEventListener('click', () => setDrawer(true));
  closeBtn.addEventListener('click', () => setDrawer(false));
  backdrop.addEventListener('click', () => setDrawer(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && drawer.classList.contains('open')) setDrawer(false); });
}

// ---------- Карточки ----------
function offerCard(o) {
  const d = dirById(o.country);
  const country = d ? d.name : o.country;
  const from = o.city ? 'вылет из ' + (CITIES[o.city] || o.city) + ' ' + o.date : o.date;
  const msg = 'Здравствуйте! Интересует тур: ' + o.title + ' (' + country + '), ' + from + ', ' + o.nights + '. Подскажите наличие мест?';
  const price = o.price
    ? 'от ' + esc(o.price) + (o.priceTo ? '<small style="font-size:13px;font-weight:600;white-space:nowrap">до ' + esc(o.priceTo) + '</small>' : '')
    : 'Цена по запросу';
  return '<article class="offer">' +
    '<div class="offer-top"><span>' + (d ? '<a href="country.html?id=' + d.id + '">' + esc(country) + '</a>' : esc(country)) + '</span><span class="tag">' + esc(o.tag) + '</span></div>' +
    '<h3>' + esc(o.title) + '</h3>' +
    '<div class="offer-info"><div>' + esc(from.charAt(0).toUpperCase() + from.slice(1)) + '</div><div>' + esc(o.nights) + ', ' + esc(o.details) + '</div></div>' +
    (o.hotels ? '<div class="offer-hotels"><b>Отели на выбор:</b> ' + o.hotels.map(esc).join(', ') + '</div>' : '') +
    '<div class="offer-bottom"><div><small>' + esc(o.note) + '</small><strong>' + price + '</strong></div>' +
    '<a class="btn btn-ink" target="_blank" rel="noopener" href="' + esc(waLink(msg)) + '">Хочу этот тур</a></div>' +
    '</article>';
}

function renderOffers(el, list) {
  el.innerHTML = list.length
    ? list.map(offerCard).join('')
    : '<div class="empty">Сейчас нет горящих туров с такими параметрами. Напишите нам — подберём вариант под ваши даты.</div>';
}

function dirCard(d) {
  return '<a class="dir" href="country.html?id=' + d.id + '" data-s="' + d.s + '" style="background:' + d.bg + '">' +
    '<small>' + esc(d.season) + '</small><h3>' + esc(d.name) + '</h3><p>' + esc(d.places) + '</p><span class="go">Подробнее →</span></a>';
}

function renderDirections(el, list) {
  el.innerHTML = list.map(dirCard).join('');
}

function hotelCard(h) {
  const d = dirById(h.country);
  const msg = 'Здравствуйте! Интересует отель ' + h.name + (d ? ' (' + d.name + ')' : '') + '. Подскажите цены на мои даты.';
  return '<article class="hotel">' +
    '<div class="where"><span>' + (d ? '<a href="country.html?id=' + d.id + '">' + esc(d.name) + '</a> · ' : '') + esc(h.place) + '</span>' +
    '<span class="stars" aria-label="' + h.stars + ' звёзд">' + '★'.repeat(h.stars) + '</span></div>' +
    '<h3>' + esc(h.name) + '</h3><p>' + esc(h.text) + '</p>' +
    (h.story ? '<p style="font-size:13px;color:var(--muted)">Обзор — в сторис «' + esc(h.story) + '» в <a href="' + SITE.instagram + '" target="_blank" rel="noopener">Instagram</a></p>' : '') +
    '<a class="btn btn-ink" target="_blank" rel="noopener" href="' + esc(waLink(msg)) + '">Узнать цену</a>' +
    '</article>';
}

function renderHotels(el, list) {
  el.innerHTML = list.map(hotelCard).join('');
}

function renderReviews(el, list) {
  el.innerHTML = list.map((r) =>
    '<figure class="review"><blockquote>' + esc(r.text) + '</blockquote>' +
    '<figcaption>' + esc(r.name) + ' <span>' + esc(r.trip) + '</span></figcaption></figure>'
  ).join('');
}

// Группа кнопок-фильтров: <div data-filter="city"><button class="chip" data-value="all">…
function bindChips(group, onPick) {
  const chips = group.querySelectorAll('.chip');
  chips.forEach((btn) => btn.addEventListener('click', () => {
    chips.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    onPick(btn.dataset.value);
  }));
}

// ---------- Блок «Подбор тура» ----------
// Вставьте на страницу <div data-pick-block></div> (можно с data-dest="vietnam").
function renderPickBlocks() {
  document.querySelectorAll('[data-pick-block]').forEach((el) => {
    el.outerHTML =
      '<section id="pick" class="section dark"><div class="wrap pick">' +
        '<div class="pick-text"><div class="kicker">Заявка за минуту</div>' +
        '<h2 class="h2">Подберём тур под ваш бюджет</h2>' +
        '<p>Заполните пару полей — откроется WhatsApp с готовым сообщением. Менеджер ответит с вариантами отелей и ценами.</p></div>' +
        '<form class="form js-pick"><div class="fields">' +
          '<label>Направление<select class="js-dest" data-label="Направление" data-preset="' + esc(el.dataset.dest || '') + '"></select></label>' +
          '<label>Город вылета<select data-label="Вылет из"><option>Астана</option><option>Алматы</option><option>Актау</option></select></label>' +
          '<label>Когда<input type="text" data-label="Когда" placeholder="например, начало ноября"></label>' +
          '<label>Кто едет<input type="text" data-label="Кто едет" placeholder="2 взрослых, ребёнок 5 лет"></label>' +
          '<label>Бюджет на всех<input type="text" data-label="Бюджет" placeholder="до 1 000 000 ₸"></label>' +
          '<label>Ваше имя<input type="text" data-label="Имя" placeholder="Айгерим" autocomplete="given-name"></label>' +
        '</div>' +
        '<button type="submit" class="btn btn-sea">Отправить заявку в WhatsApp</button>' +
        '<div class="form-note">Ответим в рабочее время, обычно в течение часа</div></form>' +
      '</div></section>';
  });
}

// ---------- Формы → WhatsApp ----------
// Любая <form class="js-pick">: каждое заполненное поле с data-label попадёт в сообщение.
function bindForms() {
  document.querySelectorAll('form.js-pick').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const lines = [form.dataset.intro || 'Здравствуйте! Хочу подобрать тур.'];
      form.querySelectorAll('[data-label]').forEach((field) => {
        const v = field.value.trim();
        if (v) lines.push(field.dataset.label + ': ' + v);
      });
      window.open(waLink(lines.join('\n')), '_blank', 'noopener');
    });
  });
}

function fillDestSelects() {
  document.querySelectorAll('select.js-dest').forEach((sel) => {
    const preset = new URLSearchParams(location.search).get('dest') || sel.dataset.preset;
    sel.innerHTML = '<option value="Пока не решили">Пока не решили</option>' +
      DIRECTIONS.map((d) => '<option' + (d.id === preset ? ' selected' : '') + '>' + esc(d.name) + '</option>').join('');
  });
}

function bindWhatsApp() {
  document.querySelectorAll('.js-wa').forEach((a) => {
    a.href = waLink(a.dataset.text || 'Здравствуйте! Хочу подобрать тур.');
    a.target = '_blank';
    a.rel = 'noopener';
  });
}

// Порядок важен: страница сначала дорисовывает свои блоки, потом вешаем обработчики.
renderLayout();
document.addEventListener('DOMContentLoaded', () => {
  if (typeof initPage === 'function') initPage();
  renderPickBlocks();
  fillDestSelects();
  bindForms();
  bindWhatsApp();
});
