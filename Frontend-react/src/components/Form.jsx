export default function Form({ formData, onChange, onSubmit }) {
    return (
    <form className="formulario" onSubmit={onSubmit}>
        <h2>Publicar artículo</h2>
        <input
        type="text"
        name="nombre"
        placeholder="nombre del articulo"
        value={formData.nombre}
        onChange={onChange}
        required
    />
    <textarea
        name="descripcion"
        placeholder="Descripción"
        value={formData.description}
        onChange={onChange}
        required
    />
    <input
        type="text"
        name="imagenUrl"
        placeholder="URL de la imagen"
        value={formData.imagenUrl}
        onChange={onChange}
        required
    />
    <button className="guardar" type="submit">Guardar</button>
    </form>
    );
}

