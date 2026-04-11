const { Archive, NewsArticle } = require("../models");

// POST /archives — archive an article (upsert article first)
exports.createArchive = async (articleData, user_id) => {
    // Upsert the article
    let article = await NewsArticle.findOne({ where: { url: articleData.url } });
    if (!article) {
        article = await NewsArticle.create({
            title: articleData.title,
            description: articleData.description || "",
            image_url: articleData.image || articleData.image_url || null,
            source_name: articleData.source?.name || articleData.source_name || "Unknown",
            author: articleData.author || null,
            published_at: articleData.publishedAt || articleData.published_at || null,
            url: articleData.url,
        });
    }

    // Prevent duplicate archive entry
    const existing = await Archive.findOne({ where: { user_id, news_article_id: article.id } });
    if (existing) {
        return { archive: existing, article, alreadyArchived: true };
    }

    const archive = await Archive.create({ user_id, news_article_id: article.id });
    return { archive, article, alreadyArchived: false };
};

// GET /archives — get all archived articles for a user
exports.getArchive = async (user_id) => {
    const archives = await Archive.findAll({
        where: { user_id },
        include: [
            {
                model: NewsArticle,
                attributes: ["id", "title", "description", "image_url", "source_name", "author", "published_at", "url", "ai_summary"],
            },
        ],
        order: [["createdAt", "DESC"]],
    });
    return archives;
};

// DELETE /archives/:id — un-archive
exports.deleteArchive = async (archive_id, user_id) => {
    const archive = await Archive.findOne({ where: { id: archive_id, user_id } });
    if (!archive) throw new Error("Archive not found or unauthorized");
    await archive.destroy();
    return { success: true };
};