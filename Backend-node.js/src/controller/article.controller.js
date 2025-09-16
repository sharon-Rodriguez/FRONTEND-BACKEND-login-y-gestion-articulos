import Article from "../models/Article.js";

export const createArticle = async (req, res) => {
try {
    const article = new Article({ ...req.body, createdBy: req.user.id });
    await article.save();
    res.status(201).json(article);
} catch (error) {
    res.status(400).json({ error: error.message });
}
};

export const getArticles = async (req, res) => {
try {
    const articles = await Article.find().populate("createdBy", "username");
    res.json(articles);
} catch (error) {
    res.status(500).json({ error: error.message });
}
};

export const deleteArticle = async (req, res) => {
try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: "Artículo eliminado" });
} catch (error) {
    res.status(500).json({ error: error.message });
}
};