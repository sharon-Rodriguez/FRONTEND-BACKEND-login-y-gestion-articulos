const API_URL = "http://localhost:4000/api/auth"; 

export async function registerUser(userData) {
const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
});

const data = await res.json(); // siempre parseamos la respuesta

    if (!res.ok) {
        console.log("❌ Error del backend:", data);
        throw data;
    }

    return data;
}

export async function loginUser(credentials) {
const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
});

const data = await res.json(); // siempre parsea la respuesta

    if (!res.ok) {
        throw data;
    }
    
    return data;
}