// ===================================
// SAFELY read a field's value - never crashes even if missing
// ===================================
function safeValue(parent, selector) {
  const element = parent.querySelector(selector);
  return element ? element.value : '';
}

function collectResumeData() {
  const data = {};

  // --- Personal Info ---
  data.fullName = document.getElementById('fullName').value;
  data.jobTitle = document.getElementById('jobTitle').value;
  data.email = document.getElementById('email').value;
  data.phone = document.getElementById('phone').value;
  data.location = document.getElementById('location').value;
  data.summary = document.getElementById('summary').value;

  // --- Education (multiple entries) ---
  data.education = [];
  const educationCards = document.querySelectorAll('[id^="education-entry-"]');
  educationCards.forEach(function (card) {
    data.education.push({
      school: safeValue(card, 'input[id^="edu-school-"]'),
      degree: safeValue(card, 'input[id^="edu-degree-"]'),
      year: safeValue(card, 'input[id^="edu-year-"]')
    });
  });

  // --- Experience (multiple entries) ---
  data.experience = [];
  const experienceCards = document.querySelectorAll('[id^="experience-entry-"]');
  experienceCards.forEach(function (card) {
    data.experience.push({
      company: safeValue(card, 'input[id^="exp-company-"]'),
      role: safeValue(card, 'input[id^="exp-role-"]'),
      duration: safeValue(card, 'input[id^="exp-duration-"]'),
      description: safeValue(card, 'textarea[id^="exp-desc-"]')
    });
  });

  // --- Projects (multiple entries) ---
  data.projects = [];
  const projectCards = document.querySelectorAll('[id^="project-entry-"]');
  projectCards.forEach(function (card) {
    data.projects.push({
      name: safeValue(card, 'input[id^="proj-name-"]'),
      description: safeValue(card, 'textarea[id^="proj-desc-"]'),
      link: safeValue(card, 'input[id^="proj-link-"]')
    });
  });

  // --- Skills, Languages, Certifications (tag-based) ---
  data.skills = collectTags('skillsList');
  data.languages = collectTags('languagesList');
  data.certifications = collectTags('certsList');

  return data;
}

function collectTags(listId) {
  const tags = [];
  const tagElements = document.querySelectorAll('#' + listId + ' .tag span');
  tagElements.forEach(function (span) {
    tags.push(span.textContent);
  });
  return tags;
}


function saveResumeData() {
  const data = collectResumeData();
  const dataAsText = JSON.stringify(data);
  localStorage.setItem('resumeData', dataAsText);
}

// ===================================
// Wire up the manual Save button
// ===================================
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

  // If nothing has been saved yet, stop here - nothing to load
  if (!savedText) {
    return;
  }

  const data = JSON.parse(savedText);

  // --- Restore Personal Info ---
  document.getElementById('fullName').value = data.fullName || '';
  document.getElementById('jobTitle').value = data.jobTitle || '';
  document.getElementById('email').value = data.email || '';
  document.getElementById('phone').value = data.phone || '';
  document.getElementById('location').value = data.location || '';
  document.getElementById('summary').value = data.summary || '';
}

// Run this immediately when the page loads
loadResumeData();