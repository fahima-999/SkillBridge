const themeToggleButtons = document.querySelectorAll('[id^="theme-toggle"]');
const settingsToggle = document.getElementById('settings-theme-toggle');

function setTheme(mode) {
  document.documentElement.classList.toggle('dark', mode === 'dark');
  localStorage.setItem('skillbridge-theme', mode);
}

function initTheme() {
  const savedTheme = localStorage.getItem('skillbridge-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  setTheme(theme);
  if (settingsToggle) {
    settingsToggle.checked = theme === 'dark';
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  setTheme(isDark ? 'light' : 'dark');
  if (settingsToggle) {
    settingsToggle.checked = !isDark;
  }
}

themeToggleButtons.forEach((button) => {
  button.addEventListener('click', toggleTheme);
});

if (settingsToggle) {
  settingsToggle.addEventListener('change', () => {
    setTheme(settingsToggle.checked ? 'dark' : 'light');
  });
}

initTheme();

// Initialize Lucide Icons globally
if (typeof lucide !== 'undefined') {
  lucide.createIcons();
}
