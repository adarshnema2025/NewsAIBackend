const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdf.controller');
const auth = require('../middleware/auth.middleware');

// GET /api/notebooks/:id/download
router.get('/notebooks/:id/download', auth, pdfController.downloadNotebookPDF);

// Legacy route kept for backward compatibility
router.get('/notebooks/:id/pdf', auth, pdfController.downloadNotebookPDF);

module.exports = router;