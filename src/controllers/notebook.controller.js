const notebookService = require("../services/notebook.service");

exports.createNotebook = async (req, res) => {
  const notebook = await notebookService.createNotebook(req.body, req.user.id);
  return res.json(notebook);
}

exports.getNotebooks = async (req, res) => {
  const notebooks = await notebookService.getNotebook(req.user.id);
  return res.json(notebooks);
}

exports.getPublicNotebooks = async (req, res) => {
  try {
    const notebooks = await notebookService.getPublicNotebooks();
    res.status(200).json({ success: true, notebooks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



exports.getNotebook = async (req, res) => {
  try {
    const { identifier } = req.params;
    const user_id = req.user.id;

    const notebook = await notebookService.getNotebookWithPages({
      identifier,
      user_id,
    });

    res.status(200).json({
      success: true,
      notebook,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};



exports.addArticleToNotebook = async (req, res) => {
  try {
    const { notebookId } = req.params;
    const { notes } = req.body;
    const user_id = req.user.id;

    // 🔥 Accept both formats
    const rawArticle = req.body.article || req.body;

    if (!rawArticle?.title || !rawArticle?.url) {
      return res.status(400).json({
        success: false,
        message: "Article title and URL are required",
      });
    }

    // ✅ Normalize
    const article = {
      title: rawArticle.title,
      description: rawArticle.description || "",
      content: rawArticle.content || "",
      image: rawArticle.image || null,
      source: {
        name: rawArticle.source?.name || "Unknown",
      },
      author: rawArticle.author || null,
      publishedAt: rawArticle.publishedAt || null,
      url: rawArticle.url,
    };

    const page = await notebookService.addArticleToNotebook({
      notebook_id: notebookId,
      user_id,
      article,
      notes,
    });

    res.status(201).json({
      success: true,
      page,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updatePageNotes = async (req, res) => {
  try {
    const { notebookId, pageId } = req.params;
    const { notes } = req.body;
    const user_id = req.user.id;

    const page = await notebookService.updatePageNotes({ notebookId, pageId, user_id, notes });

    res.status(200).json({ success: true, page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateNotebook = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const notebook = await notebookService.updateNotebook(id, user_id, req.body);
    res.status(200).json({ success: true, notebook });
  } catch (error) {
    res.status(error.message.includes("unauthorized") ? 403 : 500).json({ success: false, message: error.message });
  }
};

exports.deleteNotebook = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    await notebookService.deleteNotebook(id, user_id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(error.message.includes("unauthorized") ? 403 : 500).json({ success: false, message: error.message });
  }
};

exports.deletePage = async (req, res) => {
  try {
    const { notebookId, pageId } = req.params;
    const user_id = req.user.id;
    await notebookService.deletePage(notebookId, pageId, user_id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(error.message.includes("unauthorized") ? 403 : 500).json({ success: false, message: error.message });
  }
};