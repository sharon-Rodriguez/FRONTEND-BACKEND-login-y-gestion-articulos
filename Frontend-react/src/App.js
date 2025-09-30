import React, { useState, useEffect, useRef } from "react";
import Login from "./components/auth/login";
import Register from "./components/auth/Register";
//import ForgotPassword from "./components/auth/ForgotPassword";
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

  // Controla vista de "login" o "register"
  const [authMode, setAuthMode] = useState("login"); 

  // Controla qué vista de(feed, form, preview, detail...)
  const [currentView, setCurrentView] = useState("feed");


  const handleLoginSuccess = (userToken) => {

  localStorage.setItem("token", userToken);

  setIsLoggedIn(true);
  setCurrentView("feed"); 
  setSidebarOpen(false);
};
  
 //inicio el login guardando el token el localStorage asi cuando recargue la pagina no me toca iniciar sesion una y otra vez
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
      }
    }, []);

  // Estado para controlar si el sidebar (menú lateral) está abierto o cerrado
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    return authMode === "login" ? (
    <Login onLoginSuccess={handleLoginSuccess} goRegister={() => setAuthMode("register")} />
  ) : (
    <Register goLogin={() => setAuthMode("login")} />
  );
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


// prepara la vista previa del formulario
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

// Función que valida que un id sea si un id viene de mongo o no
const isMongoId = (id) => /^[0-9a-fA-F]{24}$/.test(id);// Función de ayuda


// Confirma la creación y edición de un artículo
const handleConfirm = async () => {
  console.log("entrando a handleConfirm con:", previewArticle);

  // Si el artículo es DEMO (ejemplo local), solo actualiza el estado local
  if (isDemo(previewArticle)) {
    console.log("Editando artículo DEMO:", previewArticle.id);
    setArticlesDemo((prev) =>
      prev.map((a) => (a.id === previewArticle.id ? previewArticle : a))
    );
    setPreviewArticle(null);
    setFormData({ nombre: "", descripcion: "", imagenUrl: "" });
    setToast("Artículo Demo actualizado🔄");
    setTimeout(() => setToast(null), 3000);
    setCurrentView("feed");
    return; // se corta para que no pase al backend
  }

  try {
    const { id, _id, ...articleWithoutId } = previewArticle;
    const backendId = _id || id;
    const token = localStorage.getItem("token");

    let updatedOrCreated;

     // "/^[0-9a-fA-F]{24}$/.test(id)" valida que id es un ObjectId válido de Mongo

    if (backendId && isMongoId(backendId)) {
      // EDITAR
      console.log("Editando artículo con id:", backendId);

      updatedOrCreated = await updateArticulo(backendId, articleWithoutId, token);

      //  Actualizar en el estado local
      setArticlesBackend((prev) =>
        prev.map((a) => (a.id === backendId ? updatedOrCreated : a))

      );
      
      setToast("Artículo actualizado 🔄");
      setTimeout(() => setToast(null), 3000);

      
    } else {
      // CREAR
      console.log("Creando artículo nuevo");
      

      updatedOrCreated = await createArticulo(articleWithoutId, token);

      setArticlesBackend((prev) => [...prev, updatedOrCreated]);

      setToast("Artículo agregado con EXITO ✅");
      setTimeout(() => setToast(null), 3000);
    }


    // Limpiar estados
    setPreviewArticle(null);
    setFormData({ nombre: "", descripcion: "", imagenUrl: "" });
    setCurrentView("feed");
  } catch (error) {
    console.error("Error en handleConfirm:", error);
  }
};


// vuelve al formulario estando en "preview" 
const CorrectPreview = () => {
  setPreviewArticle(null); // Limpia el artículo en preview
  setCurrentView("form");  // Vuelve a la vista del formulario
};

const handleDeletePreview = () => {
  if (window.confirm("¿Seguro quieres borrar este artículo?")) {
    setSelectedArticle(null);// limpia el artículo en preview
    setFormData({ nombre: "", descripcion: "", imagenUrl: "" });
    setCurrentView("feed");
  } else {
    // no hace nada, sigue editando
    console.log("Canceló el borrado");
  }
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

          setArticlesBackend((prev) => prev.filter((a) => a.id !== id));
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
  const id = art.id; // Usa idArticulos si existe, si no usa id
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
    setArticlesBackend((prev) =>
      prev.map((a) => (a.id === resp.id ? resp : a))
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
  <div className="page">
  <div>
    {/* Si NO está logueado → mostrar login o register */}
    {!isLoggedIn ? (
      authMode === "login" ? (
        <Login
          onLoginSuccess={handleLoginSuccess}
          goRegister={() => setAuthMode("register")}
        />
      ) : (
        <Register goLogin={() => setAuthMode("login")} />
      )
    ) : (
      /* Si está logueado → mostrar FEED y resto de la app */
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
                <li onClick={() => {localStorage.removeItem('token');setIsLoggedIn(false);setAuthMode("login");}}>
                  Cerrar sesión
                    </li>
              </ul>
            </div>
          </>
        )}

        {/* CONTENIDO PRINCIPAL */}
        <main className="content">
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
              onBack={CorrectPreview} // descartar borrador
              onDelete={handleDeletePreview} // volver al feed
            />
          )}

          {/* Vista detalle de un artículo */}
          {currentView === "detail" && selectedArticle && (
            <ArticleDetail
              article={selectedArticle}
              onAtras={() => { setSelectedArticle(null); setCurrentView("feed"); }} // volver al feed
              onEdit={(art) => {
                // Prepara el formulario con los datos del artículo seleccionado
                setFormData({
                  nombre: art.nombre,
                  descripcion: art.descripcion,
                  imagenUrl: art.imagenUrl
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
  </div>
);
}