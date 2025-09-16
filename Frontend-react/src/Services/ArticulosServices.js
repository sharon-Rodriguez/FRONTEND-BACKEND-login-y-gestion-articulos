const API_URL = "http://localhost:8080/articulos";

// Obtener todos los artículos
export async function getArticulos() {
    const response = await fetch(API_URL);
    if (!response.ok) {
    throw new Error("Error al obtener artículos");
    }
    return response.json();
}

// Obtener un artículo por ID
export async function getArticuloById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
    throw new Error("Error al obtener artículo");
    }
    return response.json();
}

// Crear un artículo
export async function createArticulo(articulo) {
    const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(articulo),
    });
    if (!response.ok) {
    throw new Error("Error al crear artículo");
    }
    return response.json();
}

// Actualizar un artículo
export async function updateArticulo(id, articulo) {
const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(articulo),
    });
    if (!response.ok) {
    throw new Error("Error al actualizar artículo");
    }
    return response.json();
}

// Eliminar un artículo
export async function deleteArticulo(id) {
const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    });
    if (!response.ok) {
    throw new Error("Error al eliminar artículo");
    }
    return true;
}