import { useState } from "react"; 
import { loginUser } from "../../Services/AuthService.js";
import styles from "./Auth.module.css";

export default function Login({ goRegister, onLoginSuccess, goForgotPasstword }) {
console.log("Props recibidas", { goRegister, onLoginSuccess });

const [form, setForm] = useState({
    email: "",
    password: "",
});

const [error, setError] = useState({  email: "",
    password: "",
});

  // Manejar cambios en inputs
const handleChange = (e) => {
    setForm({
        ...form,
        [e.target.id.replace("login-", "")]: e.target.value,
    });
    };

  // Enviar form
const handleSubmit = async (e) => {
    e.preventDefault();

    setError({ email: "", password: "" }); // limpiar antes de nuevo intento

    let newErrors = {};

    if (!form.email) {
        newErrors.email = "El correo es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        newErrors.email = "El correo no es válido";
    }

    if (!form.password) {
        newErrors.password = "La contraseña es obligatoria";
    } else if (form.password.length < 8) {
        newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    setError(newErrors);
    if (Object.keys(newErrors).length > 0) return; // si hay errores, no envía

    // Si pasa validaciones frontend, llamamos al backend
    try {
      const data = await loginUser(form); // llamada al backend
        console.log("Respuesta backend:", data);

        if (data.token) {
        // Guardamos en localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        onLoginSuccess(data.token); // avisa al App.jsx
        
          //verificar 
        console.log("Respuesta login:", data);
        console.log("Token guardado:", localStorage.getItem("token"));

        } 
    } catch (err) {
        console.error("Error en login:", err);

        // Distribuimos los errores del backend en el input correcto

        if (err.field ==="email") {  // correo no existe 
    
        setError((prev) => ({ ...prev, email: err.error }));

    } else if (err.field === 'password') {
        // contraseña incorrecta
    setError((prev) => ({ ...prev, password: err.error }));
    }else {
      // por si acaso
        setError((prev) => ({ ...prev, password: "Credenciales invalidas" }));
    }
    }
    };

return (
    <div className={styles.auth}>
    <div id="login">
        <div className={styles.contenedor_mayor}>
        <div className={styles.del_logo}>
            <img src="logo.png" alt="Stanew logo" />
            <h1>STANEW</h1>
            <p className={styles.slogan}>INTERCAMBIO · VENTA · DONACIÓN</p>
        </div>

        <form className={styles.formulario} onSubmit={handleSubmit}>
        <input
            type="text"
            id="login-email"
            placeholder="Correo"
            value={form.email}
            onChange={handleChange}
            onInvalid={(e) => e.preventDefault()}
            className={error.email ? styles.error : ""}
        />
        {error.email && (
            <small className={styles.mensajeError}>{error.email}</small>
        )}

        <input
            type="password"
            id="login-password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className={error.password ? styles.error : ""}
        />
        {error.password && (
            <small className={styles.mensajeError}>{error.password}</small>
        )}

        <button className={styles.boton} type="submit">
            Ingresar
        </button>

            <button
            className={styles.linkButton}
            type="button"
            onClick={goForgotPasstword}
            >
            Olvidé mi contraseña
            </button>

            <button
            className={styles.linkButton}
            type="button"
            onClick={goRegister}
            >
            Registrarme
            </button>
        </form>
        </div>
    </div>
    </div>
    );
}
