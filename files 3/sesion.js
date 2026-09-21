/* =========================================================
   CONTROL DE SESIÓN Y ROLES
   Se incluye en TODAS las vistas privadas del proyecto.
   ========================================================= */

const SESION = "salon_sesion";

function obtenerSesion() {
  return JSON.parse(localStorage.getItem(SESION)) || null;
}

/**
 * Bloquea la vista si no hay sesión o si el rol no está permitido.
 * Uso: protegerVista(["admin"])  ó  protegerVista(["cliente","admin"])
 */
function protegerVista(rolesPermitidos) {
  const sesion = obtenerSesion();

  if (!sesion) {
    window.location.replace("index.html");
    return null;
  }
  if (!rolesPermitidos.includes(sesion.rol)) {
    alert("Tu cuenta no tiene acceso a esta sección.");
    window.location.replace(sesion.rol === "admin" ? "admin.html" : "cliente.html");
    return null;
  }
  return sesion;
}

/** Escribe el nombre y el rol del usuario en la barra superior. */
function pintarUsuario(sesion) {
  const nombre = document.getElementById("usuario-nombre");
  const rol = document.getElementById("usuario-rol");
  if (nombre) nombre.textContent = sesion.nombre;
  if (rol) rol.textContent = sesion.rol === "admin" ? "Administradora" : "Cliente";
}

function cerrarSesion() {
  localStorage.removeItem(SESION);
  window.location.replace("index.html");
}

/** Activa el botón "Cerrar sesión" si existe en la página. */
document.addEventListener("DOMContentLoaded", function () {
  const boton = document.getElementById("btn-salir");
  if (boton) boton.addEventListener("click", cerrarSesion);
});
