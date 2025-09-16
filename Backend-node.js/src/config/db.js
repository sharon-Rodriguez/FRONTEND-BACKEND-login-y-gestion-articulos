import mongoose from "mongoose";

//Funcion para conectar con la base de datos mongoDB
export async function connectDB (uri){
try {
await mongoose.connect(uri);
console.log ('conectado a MongoDB');
} catch (error) {
console.error('error de conexion a MongoDB:', error.message);
throw error; // lanzamos el error para manejarlos con server.js
}
}

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Conectado a MongoDB");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
};