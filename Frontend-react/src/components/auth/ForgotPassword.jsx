import React from "react";

export default function ForgotPassword({ goTo, validateForgot }) {
return (
    <div className="screen" id="forgot">
    <div className="contenedor_mayor">
        <div className="del_logo">
        <img src="logo.png" alt="Stanew logo" />
        <h1>STANEW</h1>
        <p className="slogan">INTERCAMBIO · VENTA · DONACIÓN</p>
        </div>

        <form
        className="formulario"
        onSubmit={(e) => {
            e.preventDefault();
            validateForgot();
        }}
        >
        <input type="email" id="forgot-email" placeholder="Ingresa tu correo" />
        <small id="error-forgot-email" className="mensaje-error"></small>

        <button type="submit">Enviar link</button>
        <button
            type="button"
            onClick={() => goTo("login")}
            className="link-button"
            >
            Volver al login
        </button>
        </form>
    </div>
    </div>
);
}
