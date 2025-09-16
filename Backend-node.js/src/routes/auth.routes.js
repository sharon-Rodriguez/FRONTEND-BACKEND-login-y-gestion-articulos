import { Router } from 'express';
import { register, login } from '../controller/auth.controller.js';

const router = Router();


//Ruta de registro 
router.post( '/register', register);

// Ruta de login 
router.post('/login', login);

export default router;
