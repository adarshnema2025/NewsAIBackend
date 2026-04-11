/**
 * pdf.controller.js
 * Handles GET /api/notebooks/:id/download
 */

const notebookService = require('../services/notebook.service');
const pdfService = require('../services/pdf.service');

exports.downloadNotebookPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user?.id || null;

    // Fetch notebook with all pages + articles (access control inside service)
    const notebook = await notebookService.getNotebookWithPages({
      identifier: id,
      user_id,
    });

    // Access control: private notebooks only for owner
    if (!notebook.is_public && String(notebook.user_id) !== String(user_id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. This notebook is private.',
      });
    }

    // Generate PDF
    const pdfBuffer = await pdfService.generateNotebookPDF(notebook);

    // Sanitize filename
    const safeName = (notebook.name || 'notebook')
      .replace(/[^a-zA-Z0-9_\- ]/g, '')
      .trim()
      .replace(/\s+/g, '_');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('[PDF] Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate PDF',
    });
  }
};