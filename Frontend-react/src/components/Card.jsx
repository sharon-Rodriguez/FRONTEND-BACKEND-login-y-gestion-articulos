import { FaTrashAlt } from "react-icons/fa";

function Card({ article, onDelete, onOpen }) {

  return (
    <div className="card" onClick={() => onOpen && onOpen(article)}> 
      <img src={article.imagenUrl || "/fallback.png"} alt={article.nombre} onError={(e)=> e.target.src="/fallback.png"} />
      <div className="info">
        <h3>{article.nombre}</h3>
        <p>{article.descripcion}</p>
      </div>

      <div
        className="delete-icon"
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.(article.idArticulos ?? article.id);
        }}
        style={{ cursor: onDelete ? "pointer" : "default", opacity: 0.6 }}
      >
        <FaTrashAlt />
      </div>
    </div>
  );
}

export default Card;
