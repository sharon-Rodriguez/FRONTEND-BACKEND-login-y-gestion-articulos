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
    <div className="contenedorBtnPreview">
        <button className="botonesPreview prevBack" onClick={onBack} >Atras</button>
        <button className="botonesPreview prevConfirm" onClick={onConfirm}>Confirmar</button>
        <button className="botonesPreview prevBorrar" onClick={onDelete}>borrar</button>
    </div>
    </div>
    );
}