export default function Form({ formData, onChange, onSubmit }) {
    return (
    <div className="form-page">
    < form className="formulario" onSubmit={onSubmit}>
        <h2>Publicar artículo</h2>
        <input className="formInput"
        type="text"
        name="nombre"
        placeholder="nombre del articulo"
        value={formData.nombre}
        onChange={onChange}
        required
    />
    <textarea className="formInput"
        name="descripcion"
        placeholder="Descripción"
        value={formData.descripcion}
        onChange={onChange}
        required
    />
    <input className="formInput"
        type="text"
        name="imagenUrl"
        placeholder="URL de la imagen"
        value={formData.imagenUrl}
        onChange={onChange}
        required
    />
    <button className="guardar" type="submit">Guardar</button>
    </form>
    </div>
    );
}

