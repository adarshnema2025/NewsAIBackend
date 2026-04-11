const { Notebook, User, sequelize } = require("../models");

//POST notebooks — data may contain is_public
exports.createNotebook = (data, user_id) => Notebook.create({ ...data, user_id });

//GET Notebooks for current user (includes creator name)
exports.getNotebook = (user_id) =>
  Notebook.findAll({
    where: { user_id },
    include: [{ model: User, attributes: ["name"] }],
    order: [["createdAt", "DESC"]],
  });

//GET all PUBLIC notebooks (Knowledge Center)
exports.getPublicNotebooks = async () => {
  const { Page } = require("../models");
  return Notebook.findAll({
    where: { is_public: true },
    include: [
      { model: User, attributes: ["name"] },
      { model: Page, attributes: ["id"] },
    ],
    order: [["createdAt", "DESC"]],
  });
};


const { Op } = require("sequelize");

exports.getNotebookWithPages = async ({ identifier, user_id }) => {
  try {
    // 🔥 detect if identifier is UUID or name
    const isUUID = /^[0-9a-fA-F-]{36}$/.test(identifier);

    let whereCondition;

    if (isUUID) {
      whereCondition = { id: identifier };
    } else {
      whereCondition = { name: identifier };
    }

    // ✅ Only allow:
    // - user's private notebooks
    // - OR public notebooks
    const notebook = await Notebook.findOne({
      where: {
        ...whereCondition,
        [Op.or]: [
          { user_id },       // owner
          { is_public: true } // public
        ],
      },

      include: [
        {
          model: Page,
          attributes: ["id", "notes", "order_index"],
          include: [
            {
              model: NewsArticle,
              attributes: [
                "id",
                "title",
                "description",
                "image_url",
                "source_name",
                "author",
                "published_at",
                "url",
                "ai_summary"
              ],
            },
          ],
        },
      ],

      order: [[Page, "order_index", "ASC"]],
    });

    if (!notebook) {
      throw new Error("Notebook not found or access denied");
    }

    return notebook;
  } catch (error) {
    throw error;
  }
};

const { Page, NewsArticle } = require("../models");

exports.addArticleToNotebook = async ({
  notebook_id,
  user_id,
  article,
  notes,
}) => {
  const transaction = await Notebook.sequelize.transaction();

  try {
    // ✅ 1. Check notebook belongs to user
    const notebook = await Notebook.findOne({
      where: { id: notebook_id, user_id },
      transaction,
    });

    if (!notebook) {
      throw new Error("Notebook not found or unauthorized");
    }

    // ✅ 2. Deduplicate article using URL
    let existingArticle = await NewsArticle.findOne({
      where: { url: article.url },
      transaction,
    });

    if (!existingArticle) {
      existingArticle = await NewsArticle.create(
        {
          title: article.title,
          description: article.description,
          image_url: article.image,
          source_name: article.source?.name,
          author: article.author,
          published_at: article.publishedAt,
          url: article.url,
        },
        { transaction }
      );
    }

    const aiService = require("./ai.service");

    // generate summary only if new article
    if (!existingArticle.ai_summary) {
      const text = `${article.description}\n\n${article.content || ""}`;

      const summary = await aiService.generateSummary(text);

      existingArticle.ai_summary = summary;
      await existingArticle.save({ transaction });
    }

    // ✅ 3. Prevent duplicate page in same notebook
    const existingPage = await Page.findOne({
      where: {
        notebook_id,
        news_article_id: existingArticle.id,
      },
      transaction,
    });

    if (existingPage) {
      throw new Error("Article already exists in this notebook");
    }

    // ✅ 4. Maintain order
    const lastPage = await Page.findOne({
      where: { notebook_id },
      order: [["order_index", "DESC"]],
      transaction,
    });

    const nextOrder = lastPage ? lastPage.order_index + 1 : 1;

    // ✅ 5. Create page
    const page = await Page.create(
      {
        notebook_id,
        news_article_id: existingArticle.id,
        notes,
        order_index: nextOrder,
      },
      { transaction }
    );

    await transaction.commit();

    return page;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// PATCH notes on a page
exports.updatePageNotes = async ({ notebookId, pageId, user_id, notes }) => {
  const notebook = await Notebook.findOne({ where: { id: notebookId, user_id } });
  if (!notebook) throw new Error("Notebook not found or unauthorized");

  const page = await Page.findOne({ where: { id: pageId, notebook_id: notebookId } });
  if (!page) throw new Error("Page not found");

  await page.update({ notes });
  return page;
};

// PUT /notebooks/:id — rename / update notebook (supports is_public toggle)
exports.updateNotebook = async (id, user_id, data) => {
  const notebook = await Notebook.findOne({ where: { id, user_id } });
  if (!notebook) throw new Error("Notebook not found or unauthorized");
  const updates = { name: data.name, description: data.description };
  if (typeof data.is_public === 'boolean') updates.is_public = data.is_public;
  await notebook.update(updates);
  return notebook;
};

// DELETE /notebooks/:id
exports.deleteNotebook = async (id, user_id) => {
  const notebook = await Notebook.findOne({ where: { id, user_id } });
  if (!notebook) throw new Error("Notebook not found or unauthorized");
  await notebook.destroy();
  return { success: true };
};

// DELETE /notebooks/:notebookId/pages/:pageId
exports.deletePage = async (notebookId, pageId, user_id) => {
  const notebook = await Notebook.findOne({ where: { id: notebookId, user_id } });
  if (!notebook) throw new Error("Notebook not found or unauthorized");

  const page = await Page.findOne({ where: { id: pageId, notebook_id: notebookId } });
  if (!page) throw new Error("Page not found");

  await page.destroy();
  return { success: true };
};