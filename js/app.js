function normalizeSkill(skill) {
  return String(skill || '').trim().toLowerCase();
}

function getStoredProfile() {
  const rawProfile = localStorage.getItem('skillbridge-demo-profile');
  if (!rawProfile) {
    return null;
  }

  try {
    return JSON.parse(rawProfile);
  } catch (error) {
    return null;
  }
}

function getUserProfile() {
  const storedProfile = getStoredProfile();
  const baseProfile = typeof window.demoUserProfile !== 'undefined' ? window.demoUserProfile : (typeof mockUser !== 'undefined' ? mockUser : {});
  const skills = Array.isArray(storedProfile?.skills)
    ? storedProfile.skills
    : Array.isArray(baseProfile?.skills)
      ? baseProfile.skills
      : [];

  return {
    ...baseProfile,
    ...storedProfile,
    name: storedProfile?.name || baseProfile?.name || 'Fahima',
    email: storedProfile?.email || baseProfile?.email || 'fahimafai@gmail.com',
    role: storedProfile?.role || baseProfile?.role || 'Aspiring AI Engineer',
    goals: storedProfile?.goals || baseProfile?.goal || 'AI Engineer',
    goal: storedProfile?.goal || baseProfile?.goal || 'AI Engineer',
    location: storedProfile?.location || baseProfile?.location || 'Dhaka, Bangladesh',
    about: storedProfile?.about || baseProfile?.about || 'I am building toward AI engineering with a strong interest in machine learning, data analysis, and cloud deployment.',
    education: storedProfile?.education || baseProfile?.education || 'B.Sc. in Computer Science',
    experience: storedProfile?.experience || baseProfile?.experience || '2 years of software engineering and AI-focused projects',
    certification: storedProfile?.certification || baseProfile?.certification || 'AWS Cloud Practitioner',
    portfolio: storedProfile?.portfolio || baseProfile?.portfolio || 'https://portfolio.example.com/fahima',
    skills: skills.map((skill) => String(skill).trim()).filter(Boolean),
    readinessScore: Number(storedProfile?.readinessScore || baseProfile?.readinessScore || 74),
  };
}

function saveUserProfile(profile) {
  localStorage.setItem('skillbridge-demo-profile', JSON.stringify(profile));
  window.demoUserProfile = profile;
  window.dispatchEvent(new CustomEvent('skillbridge-profile-updated', { detail: profile }));
}

function getCareerDisplaySkills(career) {
  return Array.isArray(career.requiredSkills) && career.requiredSkills.length
    ? career.requiredSkills
    : Array.isArray(career.skills)
      ? career.skills
      : [];
}

function calculateCareerMatch(career, userProfile) {
  const requiredSkills = getCareerDisplaySkills(career).map(normalizeSkill);
  const userSkills = (userProfile.skills || []).map(normalizeSkill);
  const matchedSkills = requiredSkills.filter((skill) => userSkills.includes(skill));
  const missingSkills = requiredSkills.filter((skill) => !userSkills.includes(skill));
  const score = requiredSkills.length ? Math.round((matchedSkills.length / requiredSkills.length) * 100) : 0;

  return {
    score,
    matchedSkills: matchedSkills.map((skill) => skill.charAt(0).toUpperCase() + skill.slice(1)),
    missingSkills: missingSkills.map((skill) => skill.charAt(0).toUpperCase() + skill.slice(1)),
    summary: score >= 80 ? 'Strong fit' : score >= 60 ? 'Good fit' : score >= 40 ? 'Growing fit' : 'Needs development',
  };
}

async function loadCareerCatalog() {
  const catalog = (typeof mockCareers !== 'undefined' ? mockCareers : []).map((career) => ({
    ...career,
    requiredSkills: getCareerDisplaySkills(career),
  }));

  const jsonPaths = {
    'frontend-developer': 'data/careers/frontend-developer.json',
    'backend-developer': 'data/careers/backend-developer.json',
    'cloud-engineer': 'data/careers/cloud-engineer.json',
    'ai-engineer': 'data/careers/ai-engineer.json',
    'data-scientist': 'data/careers/data-scientist.json',
    'product-manager': 'data/careers/product-manager.json',
  };

  for (const [careerId, path] of Object.entries(jsonPaths)) {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        continue;
      }
      const data = await response.json();
      const index = catalog.findIndex((career) => career.id === careerId);
      if (index >= 0) {
        catalog[index] = {
          ...catalog[index],
          ...data,
          requiredSkills: getCareerDisplaySkills({ ...catalog[index], ...data }),
        };
      } else {
        catalog.push({ ...data, requiredSkills: getCareerDisplaySkills(data) });
      }
    } catch (error) {
      continue;
    }
  }

  return catalog;
}

async function getCareerById(careerId) {
  const careers = await loadCareerCatalog();
  return careers.find((career) => career.id === careerId) || careers[0];
}

function setupProfilePage() {
  const form = document.getElementById('profile-form');
  const nameInput = document.getElementById('profile-name');
  const emailInput = document.getElementById('profile-email');
  const locationInput = document.getElementById('profile-location');
  const roleInput = document.getElementById('profile-role');
  const goalInput = document.getElementById('profile-goal');
  const aboutInput = document.getElementById('profile-about');
  const educationInput = document.getElementById('profile-education');
  const experienceInput = document.getElementById('profile-experience');
  const certificationInput = document.getElementById('profile-certification');
  const portfolioInput = document.getElementById('profile-portfolio');
  const skillInput = document.getElementById('profile-skill-input');
  const skillList = document.getElementById('profile-skill-list');
  const statusMessage = document.getElementById('profile-status');
  const addSkillButton = document.getElementById('profile-add-skill');

  if (!form || !nameInput || !skillList) {
    return;
  }

  let profile = getUserProfile();

  function persistProfile({ refreshUI = false, message = 'Profile updated.' } = {}) {
    profile = {
      ...profile,
      name: nameInput.value.trim() || profile.name,
      email: emailInput.value.trim() || profile.email,
      location: locationInput.value.trim() || profile.location,
      role: roleInput.value.trim() || profile.role,
      goal: goalInput.value.trim() || profile.goal,
      about: aboutInput.value.trim() || profile.about,
      education: educationInput.value.trim() || profile.education,
      experience: experienceInput.value.trim() || profile.experience,
      certification: certificationInput.value.trim() || profile.certification,
      portfolio: portfolioInput.value.trim() || profile.portfolio,
      readinessScore: Number(profile.readinessScore || 74),
      skills: (profile.skills || []).map((skill) => skill.trim()).filter(Boolean),
    };
    saveUserProfile(profile);
    if (refreshUI) {
      renderProfile();
    }
    if (statusMessage) {
      statusMessage.textContent = message;
    }
  }

  function renderProfile() {
    nameInput.value = profile.name || '';
    emailInput.value = profile.email || '';
    locationInput.value = profile.location || '';
    roleInput.value = profile.role || '';
    goalInput.value = profile.goal || '';
    aboutInput.value = profile.about || '';
    educationInput.value = profile.education || '';
    experienceInput.value = profile.experience || '';
    certificationInput.value = profile.certification || '';
    portfolioInput.value = profile.portfolio || '';

    skillList.innerHTML = '';
    const skills = Array.isArray(profile.skills) ? profile.skills : [];
    skills.forEach((skill) => {
      const tag = document.createElement('button');
      tag.type = 'button';
      tag.className = 'skill-tag';
      tag.textContent = skill;
      tag.addEventListener('click', () => {
        profile = {
          ...profile,
          skills: (profile.skills || []).filter((item) => item !== skill),
        };
        persistProfile({ refreshUI: true, message: 'Skill removed.' });
      });
      skillList.appendChild(tag);
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    persistProfile({ refreshUI: true, message: 'Profile saved successfully.' });
  });

  function addSkill() {
    const newSkill = skillInput.value.trim();
    if (!newSkill) {
      return;
    }

    const skills = Array.isArray(profile.skills) ? profile.skills : [];
    if (!skills.includes(newSkill)) {
      profile = { ...profile, skills: [...skills, newSkill] };
    }
    skillInput.value = '';
    persistProfile({ refreshUI: true, message: 'Skill added.' });
  }

  if (addSkillButton) {
    addSkillButton.addEventListener('click', addSkill);
  }

  if (skillInput) {
    skillInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        addSkill();
      }
    });
  }

  [nameInput, emailInput, locationInput, roleInput, goalInput, aboutInput, educationInput, experienceInput, certificationInput, portfolioInput].forEach((field) => {
    if (field) {
      field.addEventListener('input', () => {
        persistProfile({ refreshUI: false, message: 'Profile updated.' });
      });
    }
  });

  renderProfile();
}

document.addEventListener('DOMContentLoaded', async () => {
  let profile = getUserProfile();
  const careerGrid = document.getElementById('career-grid');
  const searchInput = document.getElementById('career-search');
  const filterSelect = document.getElementById('career-filter');
  const chatForm = document.getElementById('chat-form');
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const promptButtons = document.querySelectorAll('.prompt-btn');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');

  if (document.getElementById('profile-form')) {
    setupProfilePage();
  }

  if (careerGrid && searchInput && filterSelect) {
    const careers = await loadCareerCatalog();

    function renderCareers(careersToRender) {
      profile = getUserProfile();
      careerGrid.innerHTML = careersToRender
        .map((career) => {
          const match = calculateCareerMatch(career, profile);
          const skillChips = getCareerDisplaySkills(career).slice(0, 4).map((skill) => `<span class="skill-tag">${skill}</span>`).join('');
          return `
            <article class="career-card" style="padding: 24px; display: flex; flex-direction: column; justify-content: space-between; border-radius: var(--radius); gap: 20px;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <span class="eyebrow" style="margin-bottom: 0; display: inline-flex; align-items: center; gap: 4px;"><i data-lucide="trending-up" class="d-icon" style="width: 14px; height: 14px;"></i> ${career.demand} demand</span>
                  <span class="chip" style="font-size: 0.75rem; padding: 2px 8px;">${match.score}% match</span>
                </div>
                <h3 style="margin-top: 8px; margin-bottom: 8px;">${career.title}</h3>
                <p style="margin: 0; font-size: 0.95rem; color: var(--muted);">${career.description}</p>
              </div>
              <div>
                <div class="tag-grid" style="margin-bottom: 12px;">${skillChips}</div>
                <p style="margin: 0 0 10px; font-size: 0.84rem; color: var(--muted);">${match.summary} • Missing: ${match.missingSkills.length ? match.missingSkills.join(', ') : 'None'}</p>
                <div class="career-meta" style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 12px; margin-top: 12px;">
                  <span style="font-weight: 700; color: var(--text); display: inline-flex; align-items: center; gap: 4px;"><i data-lucide="banknote" class="d-icon" style="width: 16px; height: 16px; color: var(--primary);"></i>${career.salary}</span>
                  <a href="career-details.html?id=${career.id}" class="btn btn-ghost" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 12px; font-size: 0.85rem;">View Details <i data-lucide="arrow-right" class="d-icon" style="width: 14px; height: 14px;"></i></a>
                </div>
              </div>
            </article>
          `;
        })
        .join('');

      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }

    function filterCareers() {
      profile = getUserProfile();
      const query = searchInput.value.toLowerCase();
      const category = filterSelect.value;
      const filtered = careers.filter((career) => {
        const matchesCategory = category === 'all' || career.category === category;
        const searchable = [career.title, career.description, ...(getCareerDisplaySkills(career) || [])].join(' ').toLowerCase();
        const matchesQuery = searchable.includes(query);
        return matchesCategory && matchesQuery;
      });
      renderCareers(filtered);
    }

    filterCareers();
    searchInput.addEventListener('input', filterCareers);
    filterSelect.addEventListener('change', filterCareers);
  }

  const careerTitle = document.getElementById('career-title');

  async function renderCareerDetails(careerId) {
    const career = await getCareerById(careerId);
    profile = getUserProfile();
    const match = calculateCareerMatch(career, profile);

    if (!careerTitle) {
      return;
    }

    careerTitle.textContent = career.title;
    document.getElementById('career-description').textContent = career.description;
    const skillsContainer = document.getElementById('career-skills');
    const techContainer = document.getElementById('career-tech');
    const matchSummary = document.getElementById('career-match-summary');
    const matchedSkillsContainer = document.getElementById('matched-skills');
    const missingSkillsContainer = document.getElementById('missing-skills');
    const matchDetailsContainer = document.getElementById('match-details');

    skillsContainer.innerHTML = getCareerDisplaySkills(career).map((skill) => `<span class="skill-tag">${skill}</span>`).join('');
    techContainer.innerHTML = (career.tech || []).map((tech) => `<span class="skill-tag">${tech}</span>`).join('');

    if (matchSummary) {
      matchSummary.innerHTML = `
        <div class="comparison-grid">
          <div style="background: var(--surface-strong); border: 1px solid var(--border); padding: 14px; border-radius: 14px; text-align: center;">
            <span style="color: var(--muted); font-size: 0.85rem; display: block; margin-bottom: 4px;">Current match</span>
            <strong style="font-size: 2rem; color: var(--text);">${match.score}%</strong>
          </div>
          <div style="background: var(--surface-strong); border: 1px solid var(--border); padding: 14px; border-radius: 14px; text-align: center;">
            <span style="color: var(--muted); font-size: 0.85rem; display: block; margin-bottom: 4px;">Profile fit</span>
            <strong style="font-size: 1.25rem; color: var(--text);">${match.summary}</strong>
          </div>
          <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.15); padding: 14px; border-radius: 14px; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <span style="color: var(--success); font-size: 0.85rem; display: block; margin-bottom: 4px;">Gap</span>
            <strong style="font-size: 1.1rem; color: var(--success);">${match.missingSkills.length ? `${match.missingSkills.length} skill${match.missingSkills.length > 1 ? 's' : ''} to build` : 'No missing skills'}</strong>
          </div>
        </div>
      `;
    }

    if (matchedSkillsContainer) {
      matchedSkillsContainer.innerHTML = match.matchedSkills.length
        ? match.matchedSkills.map((skill) => `<span class="skill-tag">${skill}</span>`).join('')
        : '<span class="chip">No strong matches yet</span>';
    }

    if (missingSkillsContainer) {
      missingSkillsContainer.innerHTML = match.missingSkills.length
        ? match.missingSkills.map((skill) => `<li>${skill}</li>`).join('')
        : '<li>None — your current profile already covers the core needs.</li>';
    }

    if (matchDetailsContainer) {
      const detailText = (career.matchDetails && career.matchDetails.length)
        ? career.matchDetails.join(' ')
        : `You already match ${match.matchedSkills.join(', ') || 'the core skills'} well. The main gap is in ${match.missingSkills.join(', ') || 'practical experience'}.`;
      matchDetailsContainer.textContent = detailText;
    }
  }

  if (careerTitle) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') || 'ai-engineer';
    await renderCareerDetails(id);
  }
    careerTitle.textContent = career.title;
    document.getElementById('career-description').textContent = career.description;
    const skillsContainer = document.getElementById('career-skills');
    const techContainer = document.getElementById('career-tech');
    const matchSummary = document.getElementById('career-match-summary');
    const matchedSkillsContainer = document.getElementById('matched-skills');
    const missingSkillsContainer = document.getElementById('missing-skills');
    const matchDetailsContainer = document.getElementById('match-details');
    const match = calculateCareerMatch(career, profile);

    skillsContainer.innerHTML = getCareerDisplaySkills(career).map((skill) => `<span class="skill-tag">${skill}</span>`).join('');
    techContainer.innerHTML = (career.tech || []).map((tech) => `<span class="skill-tag">${tech}</span>`).join('');


  window.addEventListener('skillbridge-profile-updated', () => {
    profile = getUserProfile();
    if (careerGrid && searchInput && filterSelect) {
      filterCareers();
    }
    if (careerTitle) {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id') || 'ai-engineer';
      renderCareerDetails(id);
    }
  });

  window.addEventListener('storage', (event) => {
    if (event.key === 'skillbridge-demo-profile') {
      profile = getUserProfile();
      if (careerGrid && searchInput && filterSelect) {
        filterCareers();
      }
      if (careerTitle) {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id') || 'ai-engineer';
        renderCareerDetails(id);
      }
    }
  });

  const heroCanvas = document.getElementById('hero-chart');
  if (heroCanvas && heroCanvas.getContext) {
    const ctx = heroCanvas.getContext('2d');
    const centerX = heroCanvas.width / 2;
    const centerY = heroCanvas.height / 2;
    const radius = 92;
    const values = [40, 25, 20, 15];
    const colors = ['#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'];
    let startAngle = -Math.PI / 2;

    values.forEach((value, index) => {
      const sliceAngle = (value / 100) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.lineWidth = 24;
      ctx.strokeStyle = colors[index];
      ctx.stroke();
      startAngle += sliceAngle;
    });
  }

  if (chatForm && chatMessages && chatInput) {
    function appendMessage(message, sender) {
      const messageEl = document.createElement('div');
      messageEl.className = `chat-message ${sender}`;
      messageEl.innerHTML = `<p>${message}</p>`;
      chatMessages.appendChild(messageEl);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    chatForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const value = chatInput.value.trim();
      if (!value) return;
      appendMessage(value, 'user');
      chatInput.value = '';
      setTimeout(() => {
        const response = mockChatResponses[Math.floor(Math.random() * mockChatResponses.length)];
        appendMessage(response, 'bot');
      }, 600);
    });

    promptButtons.forEach((button) => {
      button.addEventListener('click', () => {
        chatInput.value = button.textContent;
        chatInput.focus();
      });
    });
  }

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('sidebar-open');
    });
  }

  const progressBar = document.querySelector('.form-progress');
  if (progressBar) {
    const steps = document.querySelectorAll('.form-step');
    let currentStep = 0;
    const prevButton = document.getElementById('prev-step');
    const nextButton = document.getElementById('next-step');

    function updateForm() {
      steps.forEach((step, index) => {
        step.classList.toggle('active', index === currentStep);
      });
      const progressValue = `${((currentStep + 1) / steps.length) * 100}%`;
      progressBar.style.setProperty('--progress', progressValue);
      if (prevButton) {
        prevButton.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
      }
      if (nextButton) {
        nextButton.textContent = currentStep === steps.length - 1 ? 'Submit' : 'Next';
      }
    }

    function submitAssessment() {
      const form = document.getElementById('assessment-form');
      if (form) {
        form.submit();
      }
      window.location.href = 'results.html';
    }

    if (prevButton) {
      prevButton.addEventListener('click', () => {
        if (currentStep > 0) {
          currentStep -= 1;
          updateForm();
        }
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        if (currentStep < steps.length - 1) {
          currentStep += 1;
          updateForm();
        } else {
          submitAssessment();
        }
      });
    }

    updateForm();
  }
});
