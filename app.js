const storageKey = 'daymark-preferences-v1';
const defaultPreferences = {
  name: 'friend',
  greeting: 'auto',
  accent: 'coral',
  background: 'grid',
  showClock: true,
  showDate: true,
  engine: 'DuckDuckGo',
  focus: '',
  shortcuts: [
    { name: 'Mail', url: 'https://mail.google.com', letter: 'M', color: '#5b7caa' },
    { name: 'Calendar', url: 'https://calendar.google.com', letter: 'C', color: '#5e9b76' },
    { name: 'Notes', url: 'https://keep.google.com', letter: 'N', color: '#bd823c' },
    { name: 'Drive', url: 'https://drive.google.com', letter: 'D', color: '#7b6ba6' },
    { name: 'GitHub', url: 'https://github.com', letter: 'G', color: '#555c63' },
    { name: 'Maps', url: 'https://maps.google.com', letter: 'M', color: '#c6695d' }
  ]
};

const preferences = loadPreferences();
const elements = {
  appShell: document.querySelector('#appShell'), dateLabel: document.querySelector('#dateLabel'), clock: document.querySelector('#clock'), timezone: document.querySelector('#timezone'),
  eyebrow: document.querySelector('#eyebrow'), userName: document.querySelector('#userName'), searchForm: document.querySelector('#searchForm'), searchInput: document.querySelector('#searchInput'),
  engineLabel: document.querySelector('#engineLabel'), focusForm: document.querySelector('#focusForm'), focusInput: document.querySelector('#focusInput'), focusSaved: document.querySelector('#focusSaved'), focusText: document.querySelector('#focusText'),
  shortcutGrid: document.querySelector('#shortcutGrid'), settingsDrawer: document.querySelector('#settingsDrawer'), nameSetting: document.querySelector('#nameSetting'), greetingSetting: document.querySelector('#greetingSetting'),
  clockSetting: document.querySelector('#clockSetting'), dateSetting: document.querySelector('#dateSetting'), backgroundSetting: document.querySelector('#backgroundSetting'), toast: document.querySelector('#toast')
};

function loadPreferences() {
  try { return { ...defaultPreferences, ...JSON.parse(localStorage.getItem(storageKey) || '{}') }; } catch { return { ...defaultPreferences }; }
}
function savePreferences() { localStorage.setItem(storageKey, JSON.stringify(preferences)); }
function getGreeting() {
  const hour = new Date().getHours();
  if (preferences.greeting === 'hello') return 'Hello';
  if (preferences.greeting === 'welcome') return 'Welcome back';
  if (preferences.greeting === 'goodday') return 'Good day';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}
function renderTime() {
  const now = new Date();
  elements.clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  elements.dateLabel.textContent = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  elements.timezone.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone.replace('_', ' ');
}
function render() {
  document.documentElement.style.setProperty('--accent', ({ coral: '#e36c52', teal: '#287f7b', violet: '#7768a8', amber: '#c18b3a' })[preferences.accent]);
  document.documentElement.style.setProperty('--accent-soft', ({ coral: 'rgba(227,108,82,.13)', teal: 'rgba(40,127,123,.13)', violet: 'rgba(119,104,168,.13)', amber: 'rgba(193,139,58,.15)' })[preferences.accent]);
  elements.appShell.dataset.background = preferences.background;
  elements.userName.textContent = preferences.name || 'friend';
  elements.eyebrow.textContent = getGreeting() === 'Good morning' ? 'A clear place to begin' : 'Make room for what matters';
  elements.clock.parentElement.hidden = !preferences.showClock;
  elements.dateLabel.hidden = !preferences.showDate;
  elements.engineLabel.textContent = preferences.engine;
  elements.nameSetting.value = preferences.name;
  elements.greetingSetting.value = preferences.greeting;
  elements.clockSetting.checked = preferences.showClock;
  elements.dateSetting.checked = preferences.showDate;
  elements.backgroundSetting.value = preferences.background;
  document.querySelectorAll('.swatch').forEach((swatch) => swatch.classList.toggle('is-active', swatch.dataset.accent === preferences.accent));
  renderFocus();
  renderShortcuts();
  renderTime();
}
function renderFocus() {
  elements.focusForm.hidden = Boolean(preferences.focus);
  elements.focusSaved.hidden = !preferences.focus;
  elements.focusText.textContent = preferences.focus;
}
function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}
function renderShortcuts() {
  elements.shortcutGrid.innerHTML = preferences.shortcuts.map((shortcut) => `<a class="shortcut" href="${escapeHtml(shortcut.url)}" target="_blank" rel="noreferrer"><span class="shortcut-icon" style="--shortcut-color:${escapeHtml(shortcut.color)}">${escapeHtml(shortcut.letter)}</span><span class="shortcut-name">${escapeHtml(shortcut.name)}</span></a>`).join('');
}
function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('is-visible');
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => elements.toast.classList.remove('is-visible'), 2200);
}
function openSettings() { elements.settingsDrawer.classList.add('is-open'); elements.settingsDrawer.setAttribute('aria-hidden', 'false'); }
function closeSettings() { elements.settingsDrawer.classList.remove('is-open'); elements.settingsDrawer.setAttribute('aria-hidden', 'true'); }

setInterval(renderTime, 1000);
render();
elements.searchForm.addEventListener('submit', (event) => { event.preventDefault(); const query = elements.searchInput.value.trim(); if (!query) return; const searchUrls = { DuckDuckGo: 'https://duckduckgo.com/?q=', Google: 'https://www.google.com/search?q=', Bing: 'https://www.bing.com/search?q=' }; window.location.href = `${searchUrls[preferences.engine]}${encodeURIComponent(query)}`; });
elements.focusForm.addEventListener('submit', (event) => { event.preventDefault(); preferences.focus = elements.focusInput.value.trim(); if (preferences.focus) { savePreferences(); elements.focusInput.value = ''; renderFocus(); } });
document.querySelector('#clearFocus').addEventListener('click', () => { preferences.focus = ''; savePreferences(); renderFocus(); });
document.querySelector('#settingsButton').addEventListener('click', openSettings);
document.querySelector('#closeSettings').addEventListener('click', closeSettings);
document.querySelector('#drawerBackdrop').addEventListener('click', closeSettings);
elements.nameSetting.addEventListener('input', (event) => { preferences.name = event.target.value; savePreferences(); render(); });
elements.greetingSetting.addEventListener('change', (event) => { preferences.greeting = event.target.value; savePreferences(); render(); });
elements.clockSetting.addEventListener('change', (event) => { preferences.showClock = event.target.checked; savePreferences(); render(); });
elements.dateSetting.addEventListener('change', (event) => { preferences.showDate = event.target.checked; savePreferences(); render(); });
elements.backgroundSetting.addEventListener('change', (event) => { preferences.background = event.target.value; savePreferences(); render(); });
document.querySelector('#swatches').addEventListener('click', (event) => { const swatch = event.target.closest('.swatch'); if (!swatch) return; preferences.accent = swatch.dataset.accent; savePreferences(); render(); });
document.querySelector('#engineButton').addEventListener('click', () => { const engines = ['DuckDuckGo', 'Google', 'Bing']; preferences.engine = engines[(engines.indexOf(preferences.engine) + 1) % engines.length]; savePreferences(); render(); showToast(`Search engine: ${preferences.engine}`); });
document.querySelector('#addLinkButton').addEventListener('click', () => { const name = window.prompt('Shortcut name'); if (!name) return; const url = window.prompt('Website address', 'https://'); if (!url) return; try { new URL(url); } catch { showToast('Please enter a valid website address'); return; } preferences.shortcuts.push({ name: name.slice(0, 18), url, letter: name[0].toUpperCase(), color: '#6f847a' }); savePreferences(); renderShortcuts(); });
document.querySelector('#resetButton').addEventListener('click', () => { if (!window.confirm('Reset your Daymark preferences?')) return; localStorage.removeItem(storageKey); Object.assign(preferences, JSON.parse(JSON.stringify(defaultPreferences))); render(); showToast('Preferences reset'); });
