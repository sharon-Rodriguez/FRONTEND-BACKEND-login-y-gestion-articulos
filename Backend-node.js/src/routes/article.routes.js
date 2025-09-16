import { Router } from "express";
import { createArticle, getArticles, deleteArticle } from "../controllers/article.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getArticles);
router.post("/", authMiddleware, createArticle);
router.delete("/:id", authMiddleware, deleteArticle);

export default router;
