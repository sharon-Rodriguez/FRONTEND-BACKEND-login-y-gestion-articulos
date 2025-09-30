import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String },
    imagenUrl: { type: String },
    precio: { type: Number, default: 35000 },
    tipoAccion: { type: String, enum: ["venta", "donacion", "intercambio"], required: true, default:"donacion" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("Article", articleSchema);
