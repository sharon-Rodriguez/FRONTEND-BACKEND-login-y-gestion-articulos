import { isValidObjectId } from "mongoose";
import Article from "../models/Article.js";

export const createArticle = async (req, res) => {
try {
    const article = new Article({ ...req.body, createdBy: req.user.id });
    await article.save();
    res.status(201).json({ id: article.id.toString(),
    ...article.toObject(),
    createdAt: article.createdAt.toISOString().split("T")[0],
    updatedAt: article.updatedAt.toISOString().split("T")[0],
});
} catch (error) {
    res.status(400).json({ error: error.message });
}
};

export const getArticles = async (req, res) => {
try {
    const articles = await Article.find().populate("createdBy", "username");
    res.json(articles.map(a => ({ id: a.id.toString(),
    ...a.toObject(),
    createdAt: a.createdAt.toISOString().split("T")[0],
    updatedAt: a.updatedAt.toISOString().split("T")[0],
    }))
);
} catch (error) {
    res.status(500).json({ error: error.message });
}
};

export const getArticuloById = async (req, res) => {
try {

    const { id } = req.params; // sacar el id de la URL


    // Verificar si el id es válido de Mongo
    if (!isValidObjectId(id))
{
    return res.status(400).json({ message: "ID no válido" });
}

    
const articulo = await Article.findById(id); // buscar en DB

if (!articulo) {
    return res.status(404).json({ message: "Artículo no encontrado" });
    }

    res.json({ id: articulo.id.toString(),
    ...articulo.toObject(),
    createdAt: articulo.createdAt.toISOString().split("T")[0],
    updatedAt: articulo.updatedAt.toISOString().split("T")[0],
});
    } catch (error) {
    res.status(500).json({ message: "Error al obtener el artículo", error });
}
};


export const updateArticle = async (req, res) => {
try {
    const { id } = req.params;

    if (!isValidObjectId(id))
{
    return res.status(400).json({ message: "ID no válido" });
}

    const updatedArticle = await Article.findByIdAndUpdate(
    req.params.id,
    req.body,
      { new: true } // devuelve el artículo ya actualizado
    );
    if (!updatedArticle) {
        return res.status(404).json({ message: "Artículo no encontrado" });
    }
    res.json({
    id: updatedArticle.id.toString(),
    ...updatedArticle.toObject(),
    createdAt: updatedArticle.createdAt.toISOString().split("T")[0],
    updatedAt: updatedArticle.updatedAt.toISOString().split("T")[0],
});
} catch (error) {
    res.status(500).json({ error: error.message });
}
};


export const deleteArticle = async (req, res) => {
try {

    const { id } = req.params;

    if (!isValidObjectId(id))
{
    return res.status(400).json({ message: "ID no válido" });
}


    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: "Artículo eliminado" });
} catch (error) {
    res.status(500).json({ error: error.message });
}
};