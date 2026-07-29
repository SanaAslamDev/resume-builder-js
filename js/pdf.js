// ===================================
// EXPORT the resume as a TEXT-BASED PDF (not an image)
// ===================================

function exportToPDF() {
  const { jsPDF } = jspdf;
  const data = collectResumeData();

  const exportBtn = document.getElementById('exportPdfBtn');
  const originalText = exportBtn.textContent;
  exportBtn.textContent = 'Generating...';
  exportBtn.disabled = true;

  const pdf = new jsPDF('p', 'mm', 'a4');

  const margin = 15;
  const pageWidth = 210;
  const pageHeight = 297;
  const contentWidth = pageWidth - (margin * 2);

  let y = margin; // our "cursor" - tracks where to write next

  // ===================================
  // Helper: check if we have room left on this page.
  // If not, start a new page and reset the cursor.
  // ===================================
  function checkSpace(neededHeight) {
    if (y + neededHeight > pageHeight - margin) {
      pdf.addPage();
      y = margin;
    }
  }

  // ===================================
  // Helper: write a wrapped paragraph, moving the cursor down
  // ===================================
  function writeParagraph(text, fontSize, color) {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(fontSize);
    pdf.setTextColor(color[0], color[1], color[2]);

    const lines = pdf.splitTextToSize(text, contentWidth);
    const lineHeight = fontSize * 0.45;

    checkSpace(lines.length * lineHeight);

    lines.forEach(function (line) {
      pdf.text(line, margin, y);
      y += lineHeight;
    });
  }

  // ===================================
  // Helper: draw a thin horizontal line (used under section headings)
  // ===================================
  function drawLine() {
    pdf.setDrawColor(229, 231, 235); // light gray
    pdf.line(margin, y, pageWidth - margin, y);
    y += 4;
  }

  // ===================================
  // Helper: write a section heading (e.g. "EXPERIENCE")
  // ===================================
  function writeSectionHeading(title) {
    checkSpace(14);
    y += 4; // a bit of breathing room before each new section
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(37, 99, 235); // blue
    pdf.text(title.toUpperCase(), margin, y);
    y += 5;
    drawLine();
  }

  // ===================================
  // HEADER - Name, Job Title, Contact Info
  // ===================================
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(22);
  pdf.setTextColor(17, 24, 39);
  pdf.text(data.fullName || 'Your Name', margin, y);
  y += 8;

  if (data.jobTitle) {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(13);
    pdf.setTextColor(107, 114, 128);
    pdf.text(data.jobTitle, margin, y);
    y += 7;
  }

  const contactParts = [data.email, data.phone, data.location].filter(Boolean);
  if (contactParts.length > 0) {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(55, 65, 81);
    pdf.text(contactParts.join('   |   '), margin, y);
    y += 6;
  }

  pdf.setDrawColor(37, 99, 235);
  pdf.setLineWidth(0.6);
  pdf.line(margin, y, pageWidth - margin, y);
  pdf.setLineWidth(0.2);
  y += 8;

  // ===================================
  // SUMMARY
  // ===================================
  if (data.summary) {
    writeSectionHeading('Summary');
    writeParagraph(data.summary, 10, [55, 65, 81]);
    y += 4;
  }

  // ===================================
  // EXPERIENCE
  // ===================================
  const experienceEntries = data.experience.filter(function (job) {
    return job.company || job.role;
  });

  if (experienceEntries.length > 0) {
    writeSectionHeading('Experience');

    experienceEntries.forEach(function (job) {
      checkSpace(14);

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(17, 24, 39);
      pdf.text(job.role || '', margin, y);

      if (job.duration) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(107, 114, 128);
        const durationWidth = pdf.getTextWidth(job.duration);
        pdf.text(job.duration, pageWidth - margin - durationWidth, y);
      }
      y += 5;

      if (job.company) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(37, 99, 235);
        pdf.text(job.company, margin, y);
        y += 5;
      }

      if (job.description) {
        writeParagraph(job.description, 9.5, [55, 65, 81]);
      }

      y += 5; // space after each entry
    });
  }

  // ===================================
  // EDUCATION
  // ===================================
  const educationEntries = data.education.filter(function (edu) {
    return edu.school || edu.degree;
  });

  if (educationEntries.length > 0) {
    writeSectionHeading('Education');

    educationEntries.forEach(function (edu) {
      checkSpace(12);

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(17, 24, 39);
      pdf.text(edu.degree || '', margin, y);

      if (edu.year) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(107, 114, 128);
        const yearWidth = pdf.getTextWidth(edu.year);
        pdf.text(edu.year, pageWidth - margin - yearWidth, y);
      }
      y += 5;

      if (edu.school) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(37, 99, 235);
        pdf.text(edu.school, margin, y);
        y += 5;
      }

      y += 4;
    });
  }

  // ===================================
  // PROJECTS
  // ===================================
  const projectEntries = data.projects.filter(function (proj) {
    return proj.name;
  });

  if (projectEntries.length > 0) {
    writeSectionHeading('Projects');

    projectEntries.forEach(function (proj) {
      checkSpace(12);

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(17, 24, 39);
      pdf.text(proj.name, margin, y);
      y += 5;

      if (proj.description) {
        writeParagraph(proj.description, 9.5, [55, 65, 81]);
      }

      if (proj.link) {
        checkSpace(6);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9.5);
        pdf.setTextColor(37, 99, 235);
        pdf.textWithLink(proj.link, margin, y, { url: proj.link });
        y += 6;
      }

      y += 4;
    });
  }

  // ===================================
  // SKILLS / LANGUAGES / CERTIFICATIONS (tag-style rows)
  // ===================================
  function writeTagSection(title, tags) {
    if (!tags || tags.length === 0) return;

    writeSectionHeading(title);
    checkSpace(8);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    pdf.setTextColor(55, 65, 81);

    const text = tags.join('   •   ');
    const lines = pdf.splitTextToSize(text, contentWidth);
    lines.forEach(function (line) {
      checkSpace(6);
      pdf.text(line, margin, y);
      y += 6;
    });

    y += 4;
  }

  writeTagSection('Skills', data.skills);
  writeTagSection('Languages', data.languages);
  writeTagSection('Certifications', data.certifications);

  // ===================================
  // Save the PDF
  // ===================================
  pdf.save('resume.pdf');

  exportBtn.textContent = originalText;
  exportBtn.disabled = false;
}

// ===================================
// Wire up the Download PDF button
// ===================================
const exportPdfBtn = document.getElementById('exportPdfBtn');
exportPdfBtn.addEventListener('click', exportToPDF);