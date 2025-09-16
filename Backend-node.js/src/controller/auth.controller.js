import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; 

// Registro usuario
export async function register(req, res) {
try {
    console.log("📩 Llegó petición de registro:", req.body);
    const { username, email, password } = req.body;

    // Verificar si el email ya está registrado
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'El email ya está registrado' });

    // Hashear contraseña antes de guardar
    const hash = await bcrypt.hash(password, 8);

    // Crear nuevo usuario en la DB
    const newUser = await User.create({ username, email, password: hash });

    // Respuesta exitosa
    return res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser });
    
} catch (error) {
    console.error('Error en el registro', error);
    return res.status(500).json({ error: 'Error en el servidor' });
    }
}

// Iniciar sesión
export async function login(req, res) {
try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    // Comparar contraseñas
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

    // Generar token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

    // Respuesta exitosa
    return res.json({ message: 'Autenticación exitosa', token });
    } catch (error) {
    console.error('Error en el login', error);
    return res.status(500).json({ error: 'Error en el servidor' });
    }
}