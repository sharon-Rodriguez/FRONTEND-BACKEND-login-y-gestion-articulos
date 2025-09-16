import React from "react";

export default function ArticleDetail({ article, onBack, onEdit, onAction }) {
    if (!article) return null;

const actionLabel =
    article.tipoAccion === "venta" ? "Comprar" :
    article.tipoAccion === "donacion" ? "Recibir" :
    article.tipoAccion === "intercambio" ? "Intercambiar" : "Acción";

    return (
    <div className="detail">
        <div className="detail-card">
        <div className="detail-left">
            <img
            className="detail-image"
            src={article.imagenUrl || "/fallback.png"}
            alt={article.nombre}
            onError={(e) => { e.target.src = "/fallback.png"; }}
            />
        </div>

        <div className="detail-right">
            <div className="detail-top">
            <h1 className="detail-title">{article.nombre}</h1>
            <div className="detail-meta">
                {article.precio ? <div className="price">₡ {article.precio}</div> : null}
            <div className="type">{article.tipoAccion}</div>
            </div>
        </div>

        <p className="detail-desc">{article.descripcion}</p>

        <div className="detail-info-grid">
            <div><strong>Disponible:</strong> {String(article.disponible)}</div>
            <div><strong>Publicado:</strong> {article.fechaPublicacion || "—"}</div>
            {/* añado mas campos si despues quiero */}
        </div>

        <div className="detail-actions">
            <button className="btn secondary" onClick={onBack}>Volver</button>
            <button className="btn outline" onClick={() => onEdit(article)}>Editar</button>
            <button className="btn primary" onClick={() => onAction(article)}>{actionLabel}</button>
        </div>
        </div>
    </div>
    </div>
    );
}