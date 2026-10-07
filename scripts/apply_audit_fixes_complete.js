const fs = require("fs");
const path = require("path");

const baseDir = path.join(__dirname, "..");
const htmlFiles = [
  "index.html",
  "catalogo.html",
  "nosotros.html",
  "contacto.html",
  "carrito.html",
  "producto.html",
  "registro.html",
];

// 1. Update tailwind.config in all 7 HTML files: Add ink: "#14170F" to elitenight
htmlFiles.forEach((file) => {
  const filePath = path.join(baseDir, file);
  let content = fs.readFileSync(filePath, "utf8");

  // Fix elitenight palette: add ink: "#14170F"
  if (content.includes("elitenight: {") && !content.includes('ink: "#14170F"')) {
    content = content.replace(
      /elitenight:\s*\{/,
      'elitenight:\n              ink: "#14170F",'
    );
  }

  // Fix redundant logo alt text in header link
  content = content.replace(
    /<img class="h-14 w-14 shrink-0" src="assets\/img\/logo\.png" alt="Comercial Elite"/g,
    '<img class="h-14 w-14 shrink-0" src="assets/img/logo.png" alt=""'
  );

  // Fix footer links touch targets (ensure inline-flex min-h-11 items-center)
  content = content.replace(
    /class="text-white hover:text-elite-lime focus-visible:text-elite-lime dark:text-elitenight-text dark:hover:text-elitenight-dark dark:focus-visible:text-elitenight-dark"/g,
    'class="inline-flex min-h-11 items-center text-white hover:text-elite-lime focus-visible:text-elite-lime dark:text-elitenight-text dark:hover:text-elitenight-dark dark:focus-visible:text-elitenight-dark"'
  );

  fs.writeFileSync(filePath, content, "utf8");
  console.log("Processed common fixes for:", file);
});

// 2. Specific fix for catalogo.html (MEDIO 4: Heading order h1 -> h2)
const catalogoPath = path.join(baseDir, "catalogo.html");
let catalogoContent = fs.readFileSync(catalogoPath, "utf8");
if (!catalogoContent.includes('id="tituloRejilla"')) {
  catalogoContent = catalogoContent.replace(
    '<ul class="grid grid-cols-1 gap-5 s30:grid-cols-2 s60:grid-cols-3" id="rejillaProductos" aria-busy="true"></ul>',
    '<h2 class="sr-only" id="tituloRejilla">Productos del catálogo</h2>\n          <ul class="grid grid-cols-1 gap-5 s30:grid-cols-2 s60:grid-cols-3" id="rejillaProductos" aria-busy="true" aria-labelledby="tituloRejilla"></ul>'
  );
  fs.writeFileSync(catalogoPath, catalogoContent, "utf8");
  console.log("Applied heading fix to catalogo.html");
}

// 3. Specific fix for carrito.html (CRITICO 1 & ALTO 2)
const carritoPath = path.join(baseDir, "carrito.html");
let carritoContent = fs.readFileSync(carritoPath, "utf8");
// Remove aria-live from listaCarrito
carritoContent = carritoContent.replace(
  '<ul class="flex flex-col gap-4" id="listaCarrito" aria-live="polite"></ul>',
  '<ul class="flex flex-col gap-4" id="listaCarrito"></ul>'
);
// Ensure botonVaciarCarrito is hidden by default in markup if empty
if (!carritoContent.includes('id="botonVaciarCarrito" hidden')) {
  carritoContent = carritoContent.replace(
    'id="botonVaciarCarrito"',
    'id="botonVaciarCarrito" hidden'
  );
}
fs.writeFileSync(carritoPath, carritoContent, "utf8");
console.log("Applied fixes to carrito.html");

// 4. Specific fix for registro.html (CRITICO 1)
const registroPath = path.join(baseDir, "registro.html");
let registroContent = fs.readFileSync(registroPath, "utf8");
if (!registroContent.includes('id="botonBorrarRegistro" hidden')) {
  registroContent = registroContent.replace(
    'id="botonBorrarRegistro"',
    'id="botonBorrarRegistro" hidden'
  );
}
fs.writeFileSync(registroPath, registroContent, "utf8");
console.log("Applied fixes to registro.html");

// 5. Specific fix for js/carrito.js (ALTO 2: Focus preservation on item delete/update)
const carritoJsPath = path.join(baseDir, "js", "carrito.js");
let carritoJsContent = fs.readFileSync(carritoJsPath, "utf8");
if (!carritoJsContent.includes("firstFocusable")) {
  carritoJsContent = carritoJsContent.replace(
    `    if (focusedFocusId) {
      const elToFocus = listaCarrito.querySelector(\`[data-focus-id="\${focusedFocusId}"]\`);
      if (elToFocus) {
        elToFocus.focus();
      }
    }`,
    `    if (focusedFocusId) {
      const elToFocus = listaCarrito.querySelector(\`[data-focus-id="\${focusedFocusId}"]\`);
      if (elToFocus) {
        elToFocus.focus();
      } else if (items.length > 0) {
        const firstFocusable = listaCarrito.querySelector("button, input, a");
        if (firstFocusable) firstFocusable.focus();
      } else {
        const fallbackTarget = document.getElementById("carritoVacio") || document.getElementById("tituloCarrito");
        if (fallbackTarget) {
          fallbackTarget.tabIndex = -1;
          fallbackTarget.focus();
        }
      }
    }`
  );
  fs.writeFileSync(carritoJsPath, carritoJsContent, "utf8");
  console.log("Applied focus fallback fix to js/carrito.js");
}

// 6. Specific fix for js/producto.js (CRITICO 1: ensure ficha is hidden on error)
const productoJsPath = path.join(baseDir, "js", "producto.js");
let productoJsContent = fs.readFileSync(productoJsPath, "utf8");
if (!productoJsContent.includes("ficha.hidden = true;")) {
  productoJsContent = productoJsContent.replace(
    `  function mostrarError() {
    estadoCarga.hidden = true;
    errorProducto.hidden = false;
  }`,
    `  function mostrarError() {
    estadoCarga.hidden = true;
    errorProducto.hidden = false;
    ficha.hidden = true;
  }`
  );
  fs.writeFileSync(productoJsPath, productoJsContent, "utf8");
  console.log("Applied hidden fix to js/producto.js");
}

// 7. Specific fix for styles.css (BAJO 8: carousel focus clipping)
const stylesCssPath = path.join(baseDir, "styles.css");
let stylesCssContent = fs.readFileSync(stylesCssPath, "utf8");

if (!stylesCssContent.includes("box-shadow: 0 0 0 2px var(--fondo);")) {
  stylesCssContent = stylesCssContent.replace(
    `.ventana a:focus-visible .ventana-etiqueta {
  outline: 3px solid currentColor;
  outline-offset: -2px;
}`,
    `.ventana a:focus-visible .ventana-etiqueta {
  outline: 3px solid currentColor;
  outline-offset: -2px;
  box-shadow: 0 0 0 2px var(--fondo);
}`
  );
  stylesCssContent = stylesCssContent.replace(
    `padding: 0.35rem 0.25rem;`,
    `padding: 0.35rem 0.5rem;`
  );
  fs.writeFileSync(stylesCssPath, stylesCssContent, "utf8");
  console.log("Applied carousel focus fix to styles.css");
}

console.log("All audit fixes applied successfully.");
