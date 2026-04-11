/**
 * pdf.service.js
 * Generates a notebook PDF using html-pdf-node.
 * The HTML template is built by pdfTemplate.js.
 */

const htmlPdfNode = require('html-pdf-node');
const { buildNotebookHTML } = require('./pdfTemplate');

/**
 * Generate a PDF buffer for a given notebook.
 * @param {object} notebook  Fully-loaded notebook (with Pages → NewsArticle)
 * @returns {Promise<Buffer>}
 */
exports.generateNotebookPDF = async (notebook) => {
  const html = buildNotebookHTML(notebook);

  const file = { content: html };

  const options = {
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  };

  const pdfBuffer = await htmlPdfNode.generatePdf(file, options);
  return pdfBuffer;
};