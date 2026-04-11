const newsService = require("../services/news.service");

const ALLOWED_CATEGORIES = ["general", "world", "nation", "business", "technology", "entertainment", "sports", "health", "science"];

exports.getNews = async (req, res) => {
  try {
    let { category = "general", lang = "en", country = "in" } = req.query;

    // normalize (important for case-insensitive input)
    category = category.toLowerCase();

    // validation
    if (!ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Allowed values are: ${ALLOWED_CATEGORIES.join(", ")}`,
      });
    }

    const data = await newsService.getTopHeadlines({
      category,
      lang,
      country,
    });

    res.status(200).json({
      success: true,
      totalArticles: data.totalArticles,
      articles: data.articles,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// const notebookService = require("../services/notebook.service");

