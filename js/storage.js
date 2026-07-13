// ===================================
// SAFELY read a field's value - never crashes even if missing
// ===================================
function safeValue(parent, selector) {
  const element = parent.querySelector(selector);
  return element ? element.value : '';
}

// ===================================
// COLLECT all form data into one object
// ===================================
function collectResumeData() {
  const data = {};

  data.fullName = document.getElementById('fullName').value;
  data.jobTitle = document.getElementById('jobTitle').value;
  data.email = document.getElementById('email').value;
  data.phone = document.getElementById('phone').value;
  data.location = document.getElementById('location').value;
  data.summary = document.getElementById('summary').value;

  data.education = [];
  document.querySelectorAll('[id^="education-entry-"]').forEach(function (card) {
    data.education.push({
      school: safeValue(card, 'input[id^="edu-school-"]'),
      degree: safeValue(card, 'input[id^="edu-degree-"]'),
      year: safeValue(card, 'input[id^="edu-year-"]')
    });
  });

  data.experience = [];
  document.querySelectorAll('[id^="experience-entry-"]').forEach(function (card) {
    data.experience.push({
      company: safeValue(card, 'input[id^="exp-company-"]'),
      role: safeValue(card, 'input[id^="exp-role-"]'),
      duration: safeValue(card, 'input[id^="exp-duration-"]'),
      description: safeValue(card, 'textarea[id^="exp-desc-"]')
    });
  });

  data.projects = [];
  document.querySelectorAll('[id^="project-entry-"]').forEach(function (card) {
    data.projects.push({
      name: safeValue(card, 'input[id^="proj-name-"]'),
      description: safeValue(card, 'textarea[id^="proj-desc-"]'),
      link: safeValue(card, 'input[id^="proj-link-"]')
    });
  });

  data.skills = collectTags('skillsList');
  data.languages = collectTags('languagesList');
  data.certifications = collectTags('certsList');

  return data;
}

function collectTags(listId) {
  const tags = [];
  document.querySelectorAll('#' + listId + ' .tag span').forEach(function (span) {
    tags.push(span.textContent);
  });
  return tags;
}

// ===================================
// SAVE resume data to LocalStorage
// ===================================
function saveResumeData() {
  const data = collectResumeData();
  localStorage.setItem('resumeData', JSON.stringify(data));
}

const saveBtn = document.getElementById('saveBtn');
saveBtn.addEventListener('click', function () {
  saveResumeData();
  alert('Saved!');
});

// ===================================
// LOAD resume data from LocalStorage
// ===================================
function loadResumeData() {
  const savedText = localStorage.getItem('resumeData');

  if (!savedText) {
    return;
  }

  const data = JSON.parse(savedText);

  document.getElementById('fullName').value = data.fullName || '';
  document.getElementById('jobTitle').value = data.jobTitle || '';
  document.getElementById('email').value = data.email || '';
  document.getElementById('phone').value = data.phone || '';
  document.getElementById('location').value = data.location || '';
  document.getElementById('summary').value = data.summary || '';

  if (data.education && data.education.length > 0) {
    data.education.forEach(function (entry) {
      addEducationEntry(entry);
    });
  }

  if (data.experience && data.experience.length > 0) {
    data.experience.forEach(function (entry) {
      addExperienceEntry(entry);
    });
  }

  if (data.projects && data.projects.length > 0) {
    data.projects.forEach(function (entry) {
      addProjectEntry(entry);
    });
  }

  if (data.skills) {
    data.skills.forEach(function (skill) {
      addTag('skillsList', skill);
    });
  }
  if (data.languages) {
    data.languages.forEach(function (lang) {
      addTag('languagesList', lang);
    });
  }
  if (data.certifications) {
    data.certifications.forEach(function (cert) {
      addTag('certsList', cert);
    });
  }
}

// NOTE: loadResumeData() is NOT called here.
// It's called from the bottom of ui.js instead, AFTER all the
// addEducationEntry / addExperienceEntry / addProjectEntry / addTag
// functions have been defined. Calling it here would fail, since
// this file loads before ui.js.