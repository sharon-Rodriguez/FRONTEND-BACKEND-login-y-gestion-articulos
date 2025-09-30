import { Router } from "express";
import { createArticle, getArticles, deleteArticle, updateArticle, getArticuloById } from "../controller/article.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", getArticles);
router.get("/:id", getArticuloById);
router.post("/", authMiddleware, createArticle);
router.put("/:id", authMiddleware, updateArticle);
router.delete("/:id", authMiddleware, deleteArticle);

export default router;
