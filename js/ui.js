// Find every section header that should toggle open/closed
const sectionHeaders = document.querySelectorAll('[data-toggle="section"]');

// Loop through each one and set up a click listener
sectionHeaders.forEach(function (header) {
  header.addEventListener("click", function () {
    const section = header.parentElement;
    section.classList.toggle("collapsed");
  });
});

// ===================================
// ADD MORE / DELETE for Education entries
// ===================================

const addEducationBtn = document.getElementById('addEducationBtn');
const educationBody = addEducationBtn.parentElement;

// Save a clean copy of the FIRST entry as our permanent template
const educationTemplate = document.getElementById('education-entry-1').cloneNode(true);

addEducationBtn.addEventListener('click', function () {
  // Count how many entries currently exist on screen right now
  const currentEntries = educationBody.querySelectorAll('.entry-card');
  const newNumber = currentEntries.length + 1;

  const newEntry = educationTemplate.cloneNode(true);

  newEntry.id = 'education-entry-' + newNumber;
  newEntry.querySelector('.entry-title').textContent = 'Entry ' + newNumber;

  const inputs = newEntry.querySelectorAll('input');
  inputs.forEach(function (input) {
    input.value = '';
    input.id = input.id.replace('-1', '-' + newNumber);
  });

  educationBody.insertBefore(newEntry, addEducationBtn);
});

// ===================================
// DELETE any education entry
// ===================================
educationBody.addEventListener('click', function (event) {
  if (event.target.classList.contains('delete-btn')) {
    const entryToDelete = event.target.closest('.entry-card');
    entryToDelete.remove();
  }
});

// ===================================
// ADD MORE / DELETE for Experience entries
// ===================================

const addExperienceBtn = document.getElementById('addExperienceBtn');
const experienceBody = addExperienceBtn.parentElement;

const experienceTemplate = document.getElementById('experience-entry-1').cloneNode(true);

addExperienceBtn.addEventListener('click', function () {
  const currentEntries = experienceBody.querySelectorAll('.entry-card');
  const newNumber = currentEntries.length + 1;

  const newEntry = experienceTemplate.cloneNode(true);

  newEntry.id = 'experience-entry-' + newNumber;
  newEntry.querySelector('.entry-title').textContent = 'Entry ' + newNumber;

  const inputs = newEntry.querySelectorAll('input, textarea');
  inputs.forEach(function (input) {
    input.value = '';
    input.id = input.id.replace('-1', '-' + newNumber);
  });

  experienceBody.insertBefore(newEntry, addExperienceBtn);
});

experienceBody.addEventListener('click', function (event) {
  if (event.target.classList.contains('delete-btn')) {
    const entryToDelete = event.target.closest('.entry-card');
    entryToDelete.remove();
  }
});