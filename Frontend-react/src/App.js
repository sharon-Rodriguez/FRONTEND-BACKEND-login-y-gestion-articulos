import React, { useState, useEffect, useRef } from "react";
import Login from "./components/auth/login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/Register";
import "./App.css";
import Card from "./components/Card";
import Form from "./components/Form";
import Preview from "./components/Preview";
import {
  getArticulos,
  createArticulo,
  deleteArticulo,
} from "./Services/ArticulosServices";
import ArticleDetail from "./components/DetalleArticulo"; 
import { updateArticulo } from "./Services/ArticulosServices";


export default function App() {

  // Estado para saber si está logueado o no
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [currentScreen, setCurrentScreen] = useState("login");
  const [token, setToken] = useState(null);

  // 👇 Control de navegación
  const goTo = (screen) => setCurrentScreen(screen);

  const handleLoginSuccess = (userToken) => {
    setToken(userToken);
    setCurrentScreen("feed");
  };  

  // Estado para controlar si el sidebar (menú lateral) está abierto o cerrado
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Controla qué vista se está mostrando (feed, form, preview, detail...)
  const [currentView, setCurrentView] = useState("feed");

  // Mensajes temporales (ej: confirmaciones rápidas de borrado)
  const [message, setMessage] = useState(null);

  // === DEMO (solo local, sin conexión al backend) ===
  // Estos artículos son de ejemplo para mostrar algo aunque no haya datos reales.
  const [articlesDemo, setArticlesDemo] = useState([
    {
      id: "demo-1",
      nombre: "Bicicleta usada",
      descripcion: "En buen estado, lista para rodar 🚴",
      imagenUrl: "https://picsum.photos/300/200?random=1",
    },
    {
      id: "demo-2",
      nombre: "Chaqueta de cuero",
      descripcion: "Casi nueva, talla M 🧥",
      imagenUrl: "https://picsum.photos/300/200?random=2",
    },
  ]);

  // Función que identifica si un artículo es de ejemplo (demo) o viene del backend
  const isDemo = (article) => String(article.id).startsWith("demo-");

  // === BACKEND ===
  // Artículos reales que se cargan desde la API
  const [articlesBackend, setArticlesBackend] = useState([]);

  // === REFERENCIAS ===
  // Sirven para detectar clics fuera del sidebar y cerrar el menú
  const sidebarRef = useRef(null);
  const menuBtnRef = useRef(null);

  // === MÁS ESTADOS ===
  const [toast, setToast] = useState(null); // Avisos tipo "toast"
  const [formData, setFormData] = useState({ nombre: "", descripcion: "", imagenUrl: "" }); // Datos del formulario
  const [previewArticle, setPreviewArticle] = useState(null); // Artículo en vista previa antes de confirmar
  const [selectedArticle, setSelectedArticle] = useState(null); // Artículo seleccionado para ver detalle

  // === CLICK FUERA DEL SIDEBAR ===
  // Si el usuario hace clic fuera del menú lateral, se cierra automáticamente
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        menuBtnRef.current &&
        !menuBtnRef.current.contains(e.target)
      ) {
        setSidebarOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [sidebarOpen]);

  // === CARGAR BACKEND ===
  // Cuando carga la app, se piden los artículos al servidor
  useEffect(() => {
    getArticulos()
      .then((data) => setArticlesBackend(data))
      .catch((err) => console.error("Error cargando artículos:", err));
  }, []);

  // Aquí va el return condicional
  if (!isLoggedIn) {
    return <Login onLoginSuccess={() => setIsLoggedIn(true)} />; 
  }


  // === FUNCIONES ===

// Abre o cierra el sidebar (menú lateral)
const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

// Maneja los cambios en los inputs del formulario (se actualiza formData)
const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

// Abre el detalle de un artículo cuando se toca una card
const openDetail = (article) => {
  setSelectedArticle(article);
  setCurrentView("detail");
};

// Maneja el envío del formulario (no guarda, solo prepara vista previa)
const handleSubmit = (e) => {
  e.preventDefault();

  // si hay un previewArticle (edición), conserva todos sus campos
  const base = previewArticle ? { ...previewArticle } : { id: Date.now() };

  // Construir nuevo artículo manteniendo ids si existen
  const newArticle = {
    ...base,
    ...formData,
  };

  setPreviewArticle(newArticle);
  setCurrentView("preview");
};

// Confirma la creación y edición de un artículo
const handleConfirm = async () => {
  console.log("entrando a handleConfirm con:", previewArticle);

  // Si el artículo es DEMO (ejemplo local), solo actualiza el estado local
  if (isDemo(previewArticle)) {
      setArticlesDemo(prev =>
        prev.map(a => (a.id === previewArticle.id ? previewArticle : a))
      );
      setPreviewArticle(null);
      setFormData({ nombre: "", descripcion: "", imagenUrl: "" });
      setToast("Artículo demo actualizado localmente 🔄");
      setTimeout(() => setToast(null), 3000);
      setCurrentView("feed");
      return; // se corta para que no pase al backend
    }
    
    try {
    // Separamos los ids para evitar conflictos con el backend
    const { id, idArticulos, ...articleWithoutId } = previewArticle;

    // Construimos el objeto que se manda al backend
    const articuloConUsuario = {
      ...articleWithoutId,
      idArticulos, // mantener el id para que el backend sepa que se está editando
      usuarioPropietario: { idUsuario: 1 }, // Usuario fijo que tengo agregado en mi base de datos para pruebas de este modulo "gestion de articulos"
      disponible: true,
      precio: articleWithoutId.precio || 0,
      tipoAccion: articleWithoutId.tipoAccion || "venta",
      fechaPublicacion: new Date().toISOString().split("T")[0], // Solo fecha sin HORA (YYYY-MM-DD)
    };

    let updatedOrCreated;

    if (idArticulos) {
      // Si tiene id del backend -> EDITAR
      console.log("Editando artículo con id:", idArticulos);
      updatedOrCreated = await updateArticulo(idArticulos, articuloConUsuario);

      // Normalizar fecha para que no incluya hora
      if (updatedOrCreated.fechaPublicacion) {
        updatedOrCreated.fechaPublicacion = updatedOrCreated.fechaPublicacion.split("T")[0];
  }

      // Reemplaza el artículo editado en la lista
      setArticlesBackend(
        articlesBackend.map((art) =>
          art.idArticulos === idArticulos ? updatedOrCreated : art
        )
      );

      setPreviewArticle(null);
      setFormData({ nombre: "", descripcion: "", imagenUrl: "" });

      setToast("Artículo actualizado exitosamente ✨");
    } else {
      // Si no tiene id del backend -> CREAR nuevo
      console.log("Creando artículo nuevo");
      updatedOrCreated = await createArticulo(articuloConUsuario);
      setArticlesBackend([updatedOrCreated, ...articlesBackend]);
      setToast("Artículo añadido exitosamente ✅");
    }

    // Limpiamos estados y volvemos al feed
    setPreviewArticle(null);
    setFormData({ nombre: "", descripcion: "", imagenUrl: "" });
    setTimeout(() => setToast(null), 5000);
    setCurrentView("feed");
  } catch (error) {
    console.error("Error en handleConfirm:", error);
  }
};

// Borra un artículo que estaba en modo "preview" (todavía no creado en el backend)
const handleDeletePreview = () => {
  setPreviewArticle(null); // Limpia el artículo en preview
  setCurrentView("form");  // Vuelve a la vista del formulario
};

// Borra un artículo ya creado (puede ser demo o del backend)
const handleDeleteDirecto = async (id) => {
  console.log("Intentando borrar artículo con id:", id);

  // Confirmación de usuario antes de eliminar
  if (window.confirm("¿Seguro quieres borrar este artículo?")) {
    if (String(id).startsWith("demo-")) {
      // Si el artículo es de demo, se elimina solo del estado local
      console.log("Borrando demo local:", id);
      setArticlesDemo((prev) => prev.filter((a) => a.id !== id));
    } else {
      // Si el artículo viene del backend, lo borra en la base de datos
      try {
        console.log("Llamando deleteArticulo con id:", id);
        await deleteArticulo(id); 

        // Luego actualiza el estado local eliminando ese artículo
        setArticlesBackend((prev) => {
          console.log("Antes de borrar:", prev);
          const actualizados = prev.filter((a) => a.idArticulos !== id);
          
          console.log("Después de borrar:", actualizados);
          return actualizados;
        });
      } catch (error) {
        console.error("Error eliminando artículo:", error);
      }
    }

    // Mensaje temporal confirmando la eliminación
    setMessage("El elemento ha sido borrado");
    setTimeout(() => setMessage(null), 3000);
  }
};

// Maneja una acción sobre un artículo (comprar, recibir o intercambiar)
const handleAction = async (art) => {
  const id = art.idArticulos ?? art.id; // Usa idArticulos si existe, si no usa id
  const label = 
    art.tipoAccion === "venta" 
      ? "comprar" 
      : art.tipoAccion === "donacion" 
      ? "recibir" 
      : "intercambiar";

  // Confirmación antes de ejecutar la acción
  if (!window.confirm(`Confirma ${label} este artículo?`)) return;

  try {
    // Cambia el artículo a "no disponible" al realizar la acción
    const updated = { ...art, disponible: false };

    // Llama al backend para actualizar
    const resp = await updateArticulo(id, updated);

    // Reemplaza el artículo en el estado local con la respuesta del backend
    setArticlesBackend(prev => 
      prev.map(a => ((a.idArticulos ?? a.id) === (resp.idArticulos ?? resp.id) ? resp : a))
    );

    // Muestra un mensaje de éxito temporal
    setToast(`Acción "${label}" realizada ✅`);
    setTimeout(() => setToast(null), 3000);

    // Regresa a la vista principal
    setCurrentView("feed");
  } catch (err) {
    console.error("Error acción:", err);
  }
};

// Une en un solo array los artículos de prueba (demo) con los del backend
const allArticles = [...articlesDemo, ...articlesBackend];


  return (
  <div>
    {/*para mostrar Pantalla de LOGIN */}
    {currentScreen === "login" && (
      <Login goTo={goTo} onLoginSuccess={handleLoginSuccess} />
    )}

    {/* {currentScreen === "forgot" && <ForgotPassword goTo={goTo} />} */}

    {/* Pantalla de REGISTRO */}
    {currentScreen === "register" && <Register goTo={goTo} />}

    {/* Pantalla de FEED (todo  va aquí) */}
    {currentScreen === "feed" && (
      <>
        {/* HEADER y SIDEBAR solo aparecen si NO estamos en la vista de detalle */}
        {currentView !== "detail" && (
          <>
            {/* HEADER con botón de menú y marca/logo */}
            <div className="header">
              <div ref={menuBtnRef} className="menu-btn" onClick={toggleSidebar}>☰</div>
              <div className="brand">
                <img src="/logo.png" alt="logo" />
                <h1>Stanew</h1>
              </div>
            </div>

            {/* SIDEBAR lateral con opciones de navegación */}
            <div ref={sidebarRef} className={`sidebar ${sidebarOpen ? "active" : ""}`}>
              <h3>Menú</h3>
              <ul>
                <li onClick={() => { setSidebarOpen(false); setCurrentView("feed"); }}>Inicio</li>
                <li>Solicitudes</li>
                <li>Perfil</li>
                <li onClick={() => setCurrentView("form")}>Publicar artículo</li>
                <li onClick={() => setCurrentScreen("login")}>
                      Cerrar sesión
                    </li>
              </ul>
            </div>
          </>
        )}

        {/* CONTENIDO PRINCIPAL */}
        <main style={{ marginTop: "8px" }}>
          {/* Vista principal: lista de artículos */}
          {currentView === "feed" && (
            <>
              <h2 className="titulo">Artículos disponibles</h2>
              <div className="articles">
                {allArticles.length > 0 ? (
                  allArticles.map((art) => (
                    <Card 
                      key={art.idArticulos ?? art.id} // clave única, soporta demo o backend
                      article={art}
                      onDelete={handleDeleteDirecto} // acción de borrar
                      onOpen={() => openDetail(art)} // abrir detalle
                    />
                  ))
                ) : (
                  <p>No hay artículos disponibles</p>
                )}
              </div>
            </>
          )}

          {/* Vista del formulario para crear o editar */}
          {currentView === "form" && (
            <Form formData={formData} onChange={handleChange} onSubmit={handleSubmit} />
          )}

          {/* Vista previa antes de confirmar publicación */}
          {currentView === "preview" && previewArticle && (
            <Preview
              article={previewArticle}
              onConfirm={handleConfirm} // confirmar publicación
              onDelete={handleDeletePreview} // descartar borrador
            />
          )}

          {/* Vista detalle de un artículo */}
          {currentView === "detail" && selectedArticle && (
            <ArticleDetail
              article={selectedArticle}
              onBack={() => { setSelectedArticle(null); setCurrentView("feed"); }} // volver al feed
              onEdit={(art) => {
                // Prepara el formulario con los datos del artículo seleccionado
                setFormData({
                  nombre: art.nombre,
                  descripcion: art.descripcion,
                  imagenUrl: art.imagenUrl,
                  precio: art.precio,
                  tipoAccion: art.tipoAccion,
                });

                // Guardamos el artículo como preview para mantener id
                setPreviewArticle( art );

                setCurrentView("form"); // Abrimos el formulario
              }}
              onAction={(art) => handleAction(art)} // realizar acción (comprar, recibir, etc.)
            />
          )}
        </main>

        {/* Notificaciones y alertas */}
        {toast && <div className="toast">{toast}</div>}
        {message && <div className="alert success">{message}</div>}

        {/* Footer fijo al final */}
        <footer>© 2025 Stanew - Exchange · Sale · Donation</footer>
        </>
    )}  
  </div>
);
}