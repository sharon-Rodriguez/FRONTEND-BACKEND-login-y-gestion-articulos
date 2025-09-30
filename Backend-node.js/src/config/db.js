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

