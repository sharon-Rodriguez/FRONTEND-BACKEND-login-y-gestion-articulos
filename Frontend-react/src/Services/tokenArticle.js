export const createArticle = async (article) => {
const token = localStorage.getItem("token");

const res = await fetch("http://localhost:4000/api/articles", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, //  mandamos el token
    },
    body: JSON.stringify(article),
});

    if (!res.ok) {
    throw new Error("Error al crear artículo");
    }

    return await res.json();
};