import React from "react";
import styles from "./login.module.css";
export default function ForgotPassword({ goTo, validateForgot }) {
return (
    <div className={styles.auth}>
    <div className={styles.screen} id="forgot">
    <div className={styles.contenedor_mayor}>
        <div className={styles.del_logo}>
        <img src="logo.png" alt="Stanew logo" />
        <h1>STANEW</h1>
        <p className={styles.slogan}>INTERCAMBIO · VENTA · DONACIÓN</p>
        </div>

        <form
        className={styles.formulario}
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
    </div>
);
}
