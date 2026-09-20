/* =========================================================
   MÓDULO DE AUTENTICACIÓN — Salón de Belleza
   Integrante 1: validación, sesión en localStorage y roles
   ========================================================= */

const CLAVE_USUARIOS = "salon_usuarios";
const CLAVE_SESION = "salon_sesion";

/* ---------- 1. Datos base ---------- */
// Crea un usuario administrador la primera vez que se abre la app.
function inicializarUsuarios() {
  if (!localStorage.getItem(CLAVE_USUARIOS)) {
    const iniciales = [
      {
        nombre: "Administradora",
        correo: "admin@esthetica.com",
        telefono: "70000000",
        password: "Admin123",
        rol: "admin"
      }
    ];
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(iniciales));
  }
}

function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
}

function guardarUsuarios(lista) {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(lista));
}

/* ---------- 2. Validaciones reutilizables ---------- */
const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const REGEX_TELEFONO = /^[0-9]{8}$/;

function mostrarError(idCampo, mensaje) {
  const campo = document.getElementById(idCampo);
  const caja = document.getElementById("error-" + idCampo);
  if (caja) caja.textContent = mensaje;
  if (campo) campo.classList.toggle("is-invalid", mensaje !== "");
  return mensaje === "";
}

function validarTexto(idCampo, minimo, etiqueta) {
  const valor = document.getElementById(idCampo).value.trim();
  if (valor === "") return mostrarError(idCampo, `Escribe tu ${etiqueta}.`);
  if (valor.length < minimo)
    return mostrarError(idCampo, `El ${etiqueta} necesita al menos ${minimo} caracteres.`);
  return mostrarError(idCampo, "");
}

function validarCorreo(idCampo) {
  const valor = document.getElementById(idCampo).value.trim();
  if (valor === "") return mostrarError(idCampo, "Escribe tu correo.");
  if (!REGEX_CORREO.test(valor))
    return mostrarError(idCampo, "El correo debe tener el formato nombre@correo.com");
  return mostrarError(idCampo, "");
}

function validarTelefono(idCampo) {
  const valor = document.getElementById(idCampo).value.trim();
  if (valor === "") return mostrarError(idCampo, "Escribe tu teléfono.");
  if (!REGEX_TELEFONO.test(valor))
    return mostrarError(idCampo, "El teléfono debe tener 8 dígitos.");
  return mostrarError(idCampo, "");
}

function validarPassword(idCampo) {
  const valor = document.getElementById(idCampo).value;
  if (valor === "") return mostrarError(idCampo, "Escribe tu contraseña.");
  if (valor.length < 6)
    return mostrarError(idCampo, "La contraseña necesita al menos 6 caracteres.");
  if (!/[A-Za-z]/.test(valor) || !/[0-9]/.test(valor))
    return mostrarError(idCampo, "Combina letras y números.");
  return mostrarError(idCampo, "");
}

function validarConfirmacion(idPass, idConfirma) {
  const a = document.getElementById(idPass).value;
  const b = document.getElementById(idConfirma).value;
  if (b === "") return mostrarError(idConfirma, "Repite la contraseña.");
  if (a !== b) return mostrarError(idConfirma, "Las contraseñas no coinciden.");
  return mostrarError(idConfirma, "");
}

/* ---------- 3. Registro ---------- */
function iniciarFormularioRegistro() {
  const form = document.getElementById("form-registro");
  if (!form) return;

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const ok =
      validarTexto("nombre", 3, "nombre") &
      validarCorreo("correo") &
      validarTelefono("telefono") &
      validarPassword("password") &
      validarConfirmacion("password", "confirmar");

    if (!ok) return;

    const correo = document.getElementById("correo").value.trim().toLowerCase();
    const usuarios = obtenerUsuarios();

    if (usuarios.some(u => u.correo === correo)) {
      mostrarError("correo", "Ese correo ya tiene una cuenta. Inicia sesión.");
      return;
    }

    usuarios.push({
      nombre: document.getElementById("nombre").value.trim(),
      correo: correo,
      telefono: document.getElementById("telefono").value.trim(),
      password: document.getElementById("password").value,
      rol: "cliente" // todo registro público es cliente
    });
    guardarUsuarios(usuarios);

    document.getElementById("aviso").className = "alert alert-success";
    document.getElementById("aviso").textContent =
      "Cuenta creada. Te llevamos al inicio de sesión...";
    setTimeout(() => (window.location.href = "index.html"), 1500);
  });
}

/* ---------- 4. Inicio de sesión ---------- */
function iniciarFormularioLogin() {
  const form = document.getElementById("form-login");
  if (!form) return;

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const ok = validarCorreo("correo") & validarPassword("password");
    if (!ok) return;

    const correo = document.getElementById("correo").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const usuario = obtenerUsuarios().find(
      u => u.correo === correo && u.password === password
    );

    const aviso = document.getElementById("aviso");
    if (!usuario) {
      aviso.className = "alert alert-danger";
      aviso.textContent = "Correo o contraseña incorrectos.";
      return;
    }

    // Se guarda la sesión SIN la contraseña
    localStorage.setItem(
      CLAVE_SESION,
      JSON.stringify({
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        ingreso: new Date().toISOString()
      })
    );

    window.location.href = usuario.rol === "admin" ? "admin.html" : "cliente.html";
  });
}

/* ---------- 5. Arranque ---------- */
document.addEventListener("DOMContentLoaded", function () {
  inicializarUsuarios();
  iniciarFormularioRegistro();
  iniciarFormularioLogin();
});
