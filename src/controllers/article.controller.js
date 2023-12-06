import Article from "../models/article.model.js";
import User from "../models/user.model.js";

export const getArticles = async (req, res, next) => {
  try {
    const { title, page = 1, limit = 5 } = req.query;

    const searchConditions = {};
    if (title) {
      searchConditions.title = { $regex: new RegExp(title, "i") };
    }

    const articles = await Article.find(searchConditions)
      .populate({
        path: "owner",
        select: "fullName email age",
      })
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 5));

    res.status(200).json({
      success: true,
      message: "Articles retrieved successfully",
      data: articles,
    });
  } catch (err) {
    next(err);
  }
};

export const getArticleById = async (req, res, next) => {
  try {
    const { articleId } = req.params;

    const article = await Article.findById(articleId)
      .populate("owner", "fullName email age")
      .exec();

    if (!article) {
      return res.status(404).json({ message: "Article not found." });
    }

    res.status(200).json({
      success: true,
      message: "Article retrieved successfully",
      data: article,
    });
  } catch (err) {
    next(err);
  }
};

export const createArticle = async (req, res, next) => {
  try {
    const { title, subtitle, description, category, ownerId } = req.body;

    const ownerExists = await User.exists({ _id: ownerId });
    if (!ownerExists) {
      return res.status(404).json({ message: "Owner not found." });
    }

    const newArticle = new Article({
      title,
      subtitle,
      description,
      owner: ownerId,
      category,
    });

    const savedArticle = await newArticle.save();

    await User.findByIdAndUpdate(ownerId, { $inc: { numberOfArticles: 1 } });

    res.status(201).json({
      message: "Article created successfully",
      data: savedArticle,
    });
  } catch (err) {
    next(err);
  }
};

export const updateArticleById = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const { title, subtitle, description, category, ownerId } = req.body;

    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: "Article not found." });
    }

    const user = await User.findById(ownerId);
    if (!user) {
      return res.status(404).json({ message: "Owner not found." });
    }

    if (article.owner.toString() !== ownerId) {
      return res.status(403).json({
        message: "You do not have permission to update this article.",
      });
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      articleId,
      { $set: { title, subtitle, description, category } },
      { new: true }
    );

    res.status(200).json({
      message: "Article updated successfully",
      data: updatedArticle,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteArticleById = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ message: "Article not found." });
    }

    const ownerId = article.owner;

    await Article.findByIdAndDelete(articleId);
    await User.findByIdAndUpdate(ownerId, { $inc: { numberOfArticles: -1 } });

    res.status(200).json({
      message: "Article deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
