/**
 * pdfTemplate.js
 * Builds a rich HTML string from a notebook object.
 * Used by pdf.service.js to render → PDF via html-pdf-node.
 */

/**
 * Format a date string to a human-readable form.
 * @param {string|null} dateStr
 */
function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    } catch {
        return dateStr;
    }
}

/**
 * Strip HTML tags from Quill-generated HTML notes so the PDF
 * shows plain text (avoids raw tags appearing in the output).
 * @param {string|null} html
 */
function stripHtml(html) {
    if (!html) return '';
    return html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<li>/gi, '• ')
        .replace(/<\/li>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .trim();
}

/**
 * Build one article's HTML block.
 */
function buildPageBlock(page, index) {
    const a = page.NewsArticle || {};
    const notes = stripHtml(page.notes);
    const date = formatDate(a.published_at);
    const source = a.source_name || '';

    const imageHtml = a.image_url
        ? `<div class="article-img-wrap">
         <img class="article-img" src="${a.image_url}" alt="Article image" onerror="this.style.display='none'" />
       </div>`
        : '';

    const metaHtml = (source || date)
        ? `<p class="meta">${[source, date].filter(Boolean).join(' · ')}</p>`
        : '';

    const descHtml = a.description
        ? `<p class="description">${a.description}</p>`
        : '';

    const summaryHtml = a.ai_summary
        ? `<div class="summary-box">
         <p class="summary-label">🤖 AI Summary</p>
         <p class="summary-text">${a.ai_summary}</p>
       </div>`
        : '';

    const notesHtml = notes
        ? `<div class="notes-box">
         <p class="notes-label">📝 My Notes</p>
         <p class="notes-text">${notes}</p>
       </div>`
        : '';

    const linkHtml = a.url
        ? `<p class="read-link"><a href="${a.url}">🔗 Read original article</a></p>`
        : '';

    return `
  <div class="page-block">
    <div class="article-number">Article ${index + 1}</div>
    <h2 class="article-title">${a.title || 'Untitled'}</h2>
    ${metaHtml}
    ${imageHtml}
    ${descHtml}
    ${linkHtml}
    ${summaryHtml}
    ${notesHtml}
  </div>`;
}

/**
 * Build the complete HTML document for the notebook PDF.
 * @param {object} notebook  Sequelize notebook instance (with Pages → NewsArticle)
 * @returns {string} full HTML string
 */
function buildNotebookHTML(notebook) {
    const pages = notebook.Pages || [];
    const pageBlocks = pages.map((p, i) => buildPageBlock(p, i)).join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${notebook.name}</title>
<style>
  /* ── Reset & base ────────────────────────── */
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px;
         color: #1e293b; background: #fff; padding: 0; }

  /* ── Cover page ─────────────────────────── */
  .cover {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; height: 100vh; text-align: center;
    background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%);
    color: #fff; padding: 60px 40px; page-break-after: always;
  }
  .cover-label { font-size: 12px; letter-spacing: 3px; text-transform: uppercase;
                 opacity: 0.8; margin-bottom: 16px; }
  .cover-title { font-size: 38px; font-weight: 800; line-height: 1.2;
                 margin-bottom: 20px; }
  .cover-desc { font-size: 16px; opacity: 0.85; max-width: 460px; line-height: 1.6;
                margin-bottom: 28px; }
  .cover-count { font-size: 13px; opacity: 0.7; margin-top: 8px; }
  .cover-badge {
    display: inline-block; background: rgba(255,255,255,0.2);
    border: 1px solid rgba(255,255,255,0.4); border-radius: 999px;
    padding: 6px 20px; font-size: 12px; letter-spacing: 1px; margin-bottom: 24px;
  }

  /* ── Article block ──────────────────────── */
  .page-block {
    padding: 50px 56px;
    page-break-after: always;
  }
  .page-block:last-child { page-break-after: auto; }

  .article-number {
    font-size: 11px; font-weight: 600; letter-spacing: 2px;
    text-transform: uppercase; color: #64748b; margin-bottom: 10px;
  }
  .article-title {
    font-size: 24px; font-weight: 800; color: #0f172a;
    line-height: 1.3; margin-bottom: 8px;
  }
  .meta {
    font-size: 11px; color: #94a3b8; margin-bottom: 18px;
  }

  /* ── Image ──────────────────────────────── */
  .article-img-wrap {
    width: 100%; border-radius: 10px; overflow: hidden;
    margin-bottom: 20px; max-height: 280px;
  }
  .article-img {
    width: 100%; max-height: 280px; object-fit: cover; display: block;
  }

  /* ── Description ────────────────────────── */
  .description {
    font-size: 13.5px; color: #334155; line-height: 1.75;
    margin-bottom: 14px;
  }

  /* ── Read link ──────────────────────────── */
  .read-link { margin-bottom: 20px; }
  .read-link a { font-size: 12px; color: #0ea5e9; text-decoration: none; }

  /* ── AI Summary box ─────────────────────── */
  .summary-box {
    background: #f0f9ff; border: 1px solid #bae6fd;
    border-left: 4px solid #0ea5e9; border-radius: 8px;
    padding: 16px 20px; margin-bottom: 18px;
  }
  .summary-label {
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 1.5px; color: #0284c7; margin-bottom: 8px;
  }
  .summary-text {
    font-size: 12.5px; color: #334155; line-height: 1.7;
    white-space: pre-wrap;
  }

  /* ── Notes box ──────────────────────────── */
  .notes-box {
    background: #fffbeb; border: 1px solid #fde68a;
    border-left: 4px solid #f59e0b; border-radius: 8px;
    padding: 16px 20px; margin-bottom: 14px;
  }
  .notes-label {
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 1.5px; color: #b45309; margin-bottom: 8px;
  }
  .notes-text {
    font-size: 12.5px; color: #422006; line-height: 1.7;
    white-space: pre-wrap;
  }
</style>
</head>
<body>

<!-- Cover Page -->
<div class="cover">
  <div class="cover-badge">NewsAI Notebook</div>
  <div class="cover-label">Your Study Collection</div>
  <h1 class="cover-title">${notebook.name}</h1>
  ${notebook.description ? `<p class="cover-desc">${notebook.description}</p>` : ''}
  <p class="cover-count">${pages.length} article${pages.length !== 1 ? 's' : ''}</p>
</div>

<!-- Article Pages -->
${pageBlocks}

</body>
</html>`;
}

module.exports = { buildNotebookHTML };
