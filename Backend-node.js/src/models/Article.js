import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String },
    imagenUrl: { type: String },
    precio: { type: Number },
    tipoAccion: { type: String, enum: ["venta", "donacion", "intercambio"], required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.model("Article", articleSchema);
