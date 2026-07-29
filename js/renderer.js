// ===================================
// RENDER the resume preview based on current form data
// ===================================

function renderResume() {
  const data = collectResumeData();
  const preview = document.getElementById('resumePreview');

  let html = '';

  // --- Personal Info header ---
  html += '<div class="resume-header">';
  html += '<h1>' + (data.fullName || 'Your Name') + '</h1>';
  html += '<p class="resume-job-title">' + (data.jobTitle || 'Your Job Title') + '</p>';

  html += '<div class="resume-contact">';
  if (data.email) html += '<span>' + data.email + '</span>';
  if (data.phone) html += '<span>' + data.phone + '</span>';
  if (data.location) html += '<span>' + data.location + '</span>';
  html += '</div>';

  html += '</div>';

  // --- Summary ---
  if (data.summary) {
    html += '<div class="resume-section">';
    html += '<h2>Summary</h2>';
    html += '<p>' + data.summary + '</p>';
    html += '</div>';
  }

  // --- Experience ---
  if (data.experience && data.experience.length > 0) {
    html += '<div class="resume-section">';
    html += '<h2>Experience</h2>';

    data.experience.forEach(function (job) {
      if (job.company || job.role) {
        html += '<div class="resume-entry">';
        html += '<div class="resume-entry-top">';
        html += '<strong>' + (job.role || '') + '</strong>';
        html += '<span>' + (job.duration || '') + '</span>';
        html += '</div>';
        html += '<div class="resume-entry-subtitle">' + (job.company || '') + '</div>';
        if (job.description) {
          html += '<p>' + job.description + '</p>';
        }
        html += '</div>';
      }
    });

    html += '</div>';
  }

  // --- Education ---
  if (data.education && data.education.length > 0) {
    html += '<div class="resume-section">';
    html += '<h2>Education</h2>';

    data.education.forEach(function (edu) {
      if (edu.school || edu.degree) {
        html += '<div class="resume-entry">';
        html += '<div class="resume-entry-top">';
        html += '<strong>' + (edu.degree || '') + '</strong>';
        html += '<span>' + (edu.year || '') + '</span>';
        html += '</div>';
        html += '<div class="resume-entry-subtitle">' + (edu.school || '') + '</div>';
        html += '</div>';
      }
    });

    html += '</div>';
  }

  // --- Projects ---
  if (data.projects && data.projects.length > 0) {
    html += '<div class="resume-section">';
    html += '<h2>Projects</h2>';

    data.projects.forEach(function (proj) {
      if (proj.name) {
        html += '<div class="resume-entry">';
        html += '<div class="resume-entry-top">';
        html += '<strong>' + proj.name + '</strong>';
        html += '</div>';
        if (proj.description) {
          html += '<p>' + proj.description + '</p>';
        }
        if (proj.link) {
          html += '<a href="' + proj.link + '" class="resume-link" target="_blank">' + proj.link + '</a>';
        }
        html += '</div>';
      }
    });

    html += '</div>';
  }

  // --- Skills ---
  if (data.skills && data.skills.length > 0) {
    html += '<div class="resume-section">';
    html += '<h2>Skills</h2>';
    html += '<div class="resume-tag-list">';
    data.skills.forEach(function (skill) {
      html += '<span class="resume-tag">' + skill + '</span>';
    });
    html += '</div>';
    html += '</div>';
  }

  // --- Languages ---
  if (data.languages && data.languages.length > 0) {
    html += '<div class="resume-section">';
    html += '<h2>Languages</h2>';
    html += '<div class="resume-tag-list">';
    data.languages.forEach(function (lang) {
      html += '<span class="resume-tag">' + lang + '</span>';
    });
    html += '</div>';
    html += '</div>';
  }

  // --- Certifications ---
  if (data.certifications && data.certifications.length > 0) {
    html += '<div class="resume-section">';
    html += '<h2>Certifications</h2>';
    html += '<div class="resume-tag-list">';
    data.certifications.forEach(function (cert) {
      html += '<span class="resume-tag">' + cert + '</span>';
    });
    html += '</div>';
    html += '</div>';
  }

  preview.innerHTML = html;
}

// ===================================
// DEBOUNCED re-render whenever ANY input/textarea changes anywhere
// on the page. Instead of rendering on every single keystroke (slow),
// we wait until the user pauses typing for 200ms before rendering.
// ===================================
let renderTimeout;

document.addEventListener('input', function (event) {
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
    clearTimeout(renderTimeout);
    renderTimeout = setTimeout(renderResume, 200);
  }
});

// ===================================
// Re-render whenever a skill/language/certification tag is added or removed
// (clicking "Add" or the "✕" button isn't an "input" event, so we need
// a separate listener for clicks on the tag lists)
// ===================================
document.addEventListener('click', function (event) {
  if (event.target.closest('.tag-list')) {
    renderResume();
  }
});

// ===================================
// Render once immediately when the page loads, so the preview
// isn't empty before the user starts typing
// ===================================
renderResume();