import { useState } from "react";
import { registerUser } from "../Services/AuthService"; //  importa el service

export default function Register({ goTo }) {
const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
});

  // Maneja cambios en inputs
const handleChange = (e) => {
    setForm({
        ...form,
      [e.target.id.replace("reg-", "")]: e.target.value, // reg-name → name
    });
};

  // Maneja el envío del form
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await registerUser(form); // Llamada al backend
        alert("Usuario registrado con éxito ✅");
        console.log("Respuesta backend:", data);
      goTo("login"); // Lo manda al login
    } catch (err) {
        alert("Error en registro ❌");
        console.error(err);
    }
};

return (
    <div className="screen" id="register">
        <div className="contenedor_mayor">
        <div className="del_logo">
        <img src="logo.png" alt="Stanew logo" />
        <h1>STANEW</h1>
        <p className="slogan">INTERCAMBIO · VENTA · DONACIÓN</p>
        </div>

        <form className="formulario" onSubmit={handleSubmit}>
        <input
            type="text"
            id="reg-name"
            placeholder="Tu nombre completo"
            value={form.name}
            onChange={handleChange}
        />
        <small id="error-reg-name" className="mensaje-error"></small>

        <input
            type="email"
            id="reg-email"
            placeholder="ejemplo@"
            value={form.email}
            onChange={handleChange}
        />
        <small id="error-reg-email" className="mensaje-error"></small>

        <input
            type="password"
            id="reg-password"
            placeholder="********"
            value={form.password}
            onChange={handleChange}
        />
        <small id="error-reg-pass" className="mensaje-error"></small>

        <button type="submit">Crear cuenta</button>
        <button
            type="button"
            onClick={() => goTo("login")}
            className="link-button"
        >
            Ya tengo cuenta
        </button>
        </form>
        </div>
    </div>
);
}
