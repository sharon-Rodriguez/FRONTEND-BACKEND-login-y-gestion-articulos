import { useState } from "react";
import { loginUser } from "../Services/AuthService";

export default function Login({ goTo }) {
const [form, setForm] = useState({
    email: "",
    password: "",
});

  // Manejar cambios en inputs
const handleChange = (e) => {
    setForm({
        ...form,
      [e.target.id.replace("login-", "")]: e.target.value, // login-email → email
    });
};

  // Enviar form
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(form); // llamada al backend
        alert("Login exitoso ✅");
        console.log("Respuesta backend:", data);
      // aquí puedes redirigir al "home" o dashboard

        //  Guardamos token y user en localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));


    goTo("home");
    } catch (err) {
        alert("Error al iniciar sesión ❌");
        console.error(err);
    }
};

return (
    <div className="screen active" id="login">
    <div className="contenedor_mayor">
        <div className="del_logo">
        <img src="logo.png" alt="Stanew logo" />
        <h1>STANEW</h1>
        <p className="slogan">INTERCAMBIO · VENTA · DONACIÓN</p>
    </div>

    <form className="formulario" onSubmit={handleSubmit}>
        <input
            type="email"
            id="login-email"
            placeholder="ejemplo@"
            value={form.email}
            onChange={handleChange}
        />
        <small id="error-login-email" className="mensaje-error"></small>

        <input
            type="password"
            id="login-password"
            placeholder="********"
            value={form.password}
            onChange={handleChange}
        />
        <small id="error-login-pass" className="mensaje-error"></small>

        <button type="submit">Ingresar</button>

        <button
            type="button"
            onClick={() => goTo("forgot")}
            className="link-button"
        >
            Olvidé mi contraseña
        </button>

        <button
            type="button"
            onClick={() => goTo("register")}
            className="link-button"
        >
            Registrarme
        </button>
    </form>
    </div>
</div>
);
}
