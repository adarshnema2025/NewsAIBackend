const archiveService = require("../services/archive.service");

// POST /archives
exports.createArchive = async (req, res) => {
    try {
        const result = await archiveService.createArchive(req.body, req.user.id);
        return res.status(201).json({ success: true, ...result });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// GET /archives
exports.getArchive = async (req, res) => {
    try {
        const archives = await archiveService.getArchive(req.user.id);
        return res.json({ success: true, archives });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /archives/:id
exports.deleteArchive = async (req, res) => {
    try {
        await archiveService.deleteArchive(req.params.id, req.user.id);
        return res.json({ success: true });
    } catch (error) {
        return res.status(error.message.includes("unauthorized") ? 403 : 500).json({ success: false, message: error.message });
    }
};