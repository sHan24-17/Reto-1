const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..");
const jsonPath = path.join(rootDir, "data", "catalogo.json");
const storagePath = path.join(rootDir, "js", "storage.js");

const datosCatalogo = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
let storageContent = fs.readFileSync(storagePath, "utf8");

const target = "window.AlmacenCE = { carrito, registro, filtros, sesionCliente, pedidos, cookies };";

const catalogoCode = `
  // ---- Catálogo de productos con respaldo para file:// o fallos de red ----
  const DATOS_CATALOGO_RESPALDO = ${JSON.stringify(datosCatalogo)};

  const catalogo = {
    obtener() {
      return fetch("data/catalogo.json")
        .then((respuesta) => {
          if (!respuesta.ok) throw new Error("HTTP " + respuesta.status);
          return respuesta.json();
        })
        .catch((err) => {
          console.warn("Usando datos de respaldo del catálogo:", err);
          return DATOS_CATALOGO_RESPALDO;
        });
    },
  };

  window.AlmacenCE = { catalogo, carrito, registro, filtros, sesionCliente, pedidos, cookies };`;

if (!storageContent.includes(target)) {
  console.error("Target string not found!");
  process.exit(1);
}

storageContent = storageContent.replace(target, catalogoCode);
fs.writeFileSync(storagePath, storageContent, "utf8");
console.log("js/storage.js updated successfully!");
