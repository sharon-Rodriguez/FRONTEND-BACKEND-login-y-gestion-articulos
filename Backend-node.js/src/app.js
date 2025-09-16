import express from "express";
import authRoutes from "./routes/auth.routes.js";
import articleRoutes from "./routes/article.routes.js";

const app = express();

//Middlewares
app.use(express.json());

//Rutas pricipales
app.use("/api/auth", authRoutes); // monta las rutas de autenticacion
app.use("/api/articles", articleRoutes);

// Ruta de pruebas 
app.get("/",(req, res) => {
    res.send("API funcionando correctamente");
});

export default app;