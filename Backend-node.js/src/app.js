import express from "express";
import authRoutes from "./routes/auth.routes.js";
import articleRoutes from "./routes/article.routes.js";
import cors from "cors";

const app = express();

//Middlewares
app.use(express.json());

// habilita las cors
app.use(cors({
    origin: "http://localhost:3000", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

//Rutas pricipales
app.use("/api/auth", authRoutes); // monta las rutas de autenticacion
app.use("/api/articulos", articleRoutes);

// Ruta de pruebas 
app.get("/",(req, res) => {
    res.send("API funcionando correctamente");
});

export default app;