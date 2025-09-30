import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; 

// Registro usuario
export async function register(req, res) {
try {
    console.log("📩 Llegó petición de registro:", req.body);
    const { username, email, password } = req.body;

    let errors = {};

    // Validar existencia previa de username
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
    errors.username = "Este nombre de usuario ya existe";
    }

    // Validar existencia previa de email
    const userExists = await User.findOne({ email });
    if (userExists) {
        errors.email = "Este correo ya existe";
    }

    // Validar contraseña
    if (!password || password.length < 8) {
        errors.password = "La contraseña debe tener al menos 8 caracteres";
    }


    // Validar campos vacíos
    if (!username) errors.username = "El nombre de usuario es obligatorio";
    if (!email) errors.email = "El correo es obligatorio";
    if (!password) errors.password = "La contraseña es obligatoria";

    // Si hay errores
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
    }

    // Crear nuevo usuario
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.json({ message: "Usuario creado con éxito" });
    } catch (err) {
    console.error("Error en registro:", err);
    res.status(500).json({ error: "Error en el servidor" });
    }
}

// Iniciar sesión
export async function login(req, res) {
try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({field: "email", error: 'El correo no esta registrado' });

    // Comparar contraseñas
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ field: "password", error: 'Contraseña incorrecta' });

    // Generar token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2d' });

    // Respuesta exitosa
    return res.json({ message: 'Autenticación exitosa', token });
    } catch (error) {
    console.error('Error en el login', error);
    return res.status(500).json({ error: 'Error en el servidor' });
    }
}