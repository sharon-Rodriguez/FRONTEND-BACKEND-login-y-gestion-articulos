import mongoose from 'mongoose';

//Definicion del esquema de usuario 
const userSchema = new mongoose.Schema ({
username: {type: String, required: true, unique: true },
email: {type: String, required: true, unique: true},
password: { type: String, required: true, minlength:8}
});

//Exportamos el modelo para usarlo en controladores
export default mongoose.model('User', userSchema);