import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

// Iniciar servidor y manejar excepciones de conexion a DB 
(async () => {
try {
await connectDB(process.env.MONGODB_URI);
app.listen (PORT, () => console.log (`Servidor corriendo en http://localhost:${PORT}`));
} catch (error) {
console.error('Error al iniciar el servidor:', error.message);
process.exit(1);// Detiene la aplicacion si ocurre un error grave
}
})();