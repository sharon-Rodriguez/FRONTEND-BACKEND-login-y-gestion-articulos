export default function Preview({ article, onConfirm, onDelete,onBack}) {
    return (
/* Tarjeta con los datos del artículo en preview */        
    <div className="preview">
        <h2>Artículo añadido ✅</h2>
        <div className="card">
        <img src={article.imagenUrl} alt={article.nombre} />
        <div className="info">
            <h3>{article.nombre}</h3>
            <p>{article.descripcion}</p>
        </div>
    </div>
{/* Botones de acción: confirmar publicación o eliminar */}
    <div>
        <button onClick={onConfirm}>Confirmar</button>
        <button onClick={onDelete} style={{ background: "#c0392b" }}>Corregir borrador</button>
    </div>
    </div>
    );
}