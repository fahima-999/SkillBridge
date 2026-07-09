function getDashboardProfile() {
  const storedProfile = localStorage.getItem('skillbridge-demo-profile');
  const baseProfile = window.demoUserProfile || (typeof mockUser !== 'undefined' ? mockUser : null);

  if (storedProfile) {
    try {
      return { ...baseProfile, ...JSON.parse(storedProfile) };
    } catch (error) {
      return baseProfile;
    }
  }

  return baseProfile;
}

document.addEventListener('DOMContentLoaded', () => {
  const readinessRing = document.getElementById('readiness-ring');
  const profile = getDashboardProfile();

  if (readinessRing) {
    const score = profile?.readinessScore || 74;
    readinessRing.innerHTML = `
      <div class="score-center">
        <strong>${score}</strong>
        <span>Ready</span>
      </div>
    `;
  }

  const heading = document.querySelector('.dashboard-header h1');
  if (heading && profile) {
    heading.textContent = `Welcome back, ${profile.name.split(' ')[0]}`;
  }

  const subtitle = document.querySelector('.dashboard-header p');
  if (subtitle && profile) {
    subtitle.textContent = `Review your progress toward ${profile.goal || 'your next career move'}.`;
  }
});
