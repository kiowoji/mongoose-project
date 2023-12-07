import { Router } from 'express';
import {
  createArticle,
  updateArticleById,
  deleteArticleById,
  getArticles,
  getArticleById,
  likeArticle,
  unlikeArticle,
} from '../controllers/article.controller.js';

const articleRouter = Router();

articleRouter
  .get("/", getArticles)
  .get("/:articleId", getArticleById)
  .post("/", createArticle)
  .put("/:articleId", updateArticleById)
  .delete("/:articleId", deleteArticleById)
  .post("/:articleId/like/:userId", likeArticle)
  .post("/:articleId/unlike/:userId", unlikeArticle);

export default articleRouter;
