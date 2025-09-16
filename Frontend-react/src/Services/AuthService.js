const API_URL = "http://localhost:3000/api/auth"; // Ajusta el puerto si usas otro

export async function registerUser(userData) {
const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
});

    if (!res.ok) throw new Error("Error en registro");
    return res.json();
}

export async function loginUser(credentials) {
const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
});

    if (!res.ok) throw new Error("Error en login");
    return res.json();
}