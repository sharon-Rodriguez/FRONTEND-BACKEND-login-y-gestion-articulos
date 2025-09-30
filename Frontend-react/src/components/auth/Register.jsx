import { useState } from "react";
import { registerUser } from "../../Services/AuthService.js"; //  importa el service
import styles from "./Auth.module.css";

export default function Register({ goLogin }) {
const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
});

const [mensajeExito, setMensajeExito] = useState(""); //  estado para mostrar mensajes 

const [globalError, setGlobalError] = useState("");

const [error, setError] = useState({
    username: "",
    email: "",
    password: "",
});


  // Maneja cambios en inputs
const handleChange = (e) => {
const { id, } = e.target;    
const field = id.replace("reg-", "");
    setForm({
        ...form,
      [e.target.id.replace("reg-", "")]: e.target.value, // reg-name → name
    });

    // limpiar error del campo al escribir
    setError((prev) => ({
        ...prev,
        [field]: "",
    }));

    // limpiar error global al escribir en email
    if (field === "email") {
        setGlobalError("");
    }
};


  // Maneja el envío del form
const handleSubmit = async (e) => { e.preventDefault();
    
    // Reiniciamos errores
    let newErrors = {};

    if (!form.username) {
    newErrors.username = "El nombre de usuario es obligatorio";
    }

    if (!form.email) {
    newErrors.email = "Este campo es obligatorio";
    }

    if (!form.password) {
    newErrors.password = "La contraseña es obligatoria";
    } else if (form.password.length < 8) {
    newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }
    // Si hay errores, los mostramos y detenemos el submit
    if (Object.keys(newErrors).length > 0) {
    setError(newErrors);
    return;
    }

    try {
      const data = await registerUser(form); // Llamada al backend
        setMensajeExito("✅ Usuario registrado con éxito");

        console.log("Respuesta backend:", data);

        setTimeout(() => {
        goLogin();
      }, 1500); // Lo manda al login
        
    } catch (err) {
    console.error("Error del backend:", err); 
    
    if (err.errors) {
    let newErrors = {};

    // USERNAME YA REGISTRADO
    if (err.errors.username === "Este nombre de usuario ya existe") {
        setGlobalError(err.errors.username);
      newErrors.username = " "; // solo marcar rojo
    }

    // EMAIL YA REGISTRADO
    if (err.errors.email === "Este correo ya existe") {
        setGlobalError(err.errors.email);
      newErrors.email = " "; // solo marcar rojo
    }

    // Otros errores de validación (vacíos, cortos, etc.)
    for (const campo in err.errors) {
        if (
        err.errors[campo] !== "Este nombre de usuario ya existe" &&
        err.errors[campo] !== "Este correo ya existe"
        ) {
        newErrors[campo] = err.errors[campo]; // estos sí van debajo del input
        }
    }

    setError((prev) => ({ ...prev, ...newErrors }));
    } else {
    setGlobalError("Ocurrió un error desconocido");
    }
}
}    
return (
    <div className={styles.auth}>
    <div  id="register">
        <div className={styles.contenedor_mayor}>
        <div className={styles.del_logo}>
        <img src="logo.png" alt="Stanew logo" />
        <h1>STANEW</h1>
        <p className={styles.slogan}>INTERCAMBIO · VENTA · DONACIÓN</p>
        </div>

        < form className={styles.formulario} onSubmit={handleSubmit}>

        {mensajeExito && (
        <div className={styles.mensajeGlobalExito}>
        {mensajeExito}
        </div>
        )}

        {globalError && (
        <div className={styles.mensajeGlobal}>
        {globalError}
        </div>
        )}

        <input
            type="text"
            id="reg-username"
            placeholder="Tu nombre completo"
            value={form.username}
            onChange={handleChange}
            className={error.username ? styles.error : ""}
            />

            {error.username && error.username.trim() && <small id="error-reg-username" className={styles.mensajeError}>{error.username}</small>}

        <input
            type="email"
            id="reg-email"
            placeholder="Correo"
            value={form.email}
            onChange={handleChange}
            className={error.email ? styles.error : ""}
        />
        {error.email && error.email.trim() && <small id="error-reg-email" className={styles.mensajeError}>{error.email}</small>}

        <input
            type="password"
            id="reg-password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className={error.password ? styles.error : ""}
            />
            {error.password && error.password.trim() && <small id="error-reg-pass" className={styles.mensajeError}>{error.password}</small>}

            <button className={styles.boton} type="submit">Crear cuenta</button>
            {/* Aquí muestro el mensaje */}
            
            <div className={styles.enlaceSolo}>
            <button
                type="button"
                onClick={goLogin}
                className={styles.linkButton}
            >
                Ya tengo cuenta
            </button>
            </div>
        </form>
        </div>
    </div>
    </div>
    );
}
