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

// Fix 1: Add `ink: "#14170F"` to elitenight in tailwind.config across all HTML files (ALTO 3)
// Fix 2: Change logo alt="Comercial Elite" to alt="" (BAJO 6)
// Fix 3: Increase touch target height for footer links and breadcrumbs (MEDIO 5)

htmlFiles.forEach((file) => {
  const filePath = path.join(baseDir, file);
  let content = fs.readFileSync(filePath, "utf8");

  // 1. Add ink: "#14170F" to elitenight palette
  if (content.includes("elitenight: {") && !content.includes('ink: "#14170F"')) {
    content = content.replace(
      /elitenight:\s*\{/,
      `elitenight:\n            ink: "#14170F",`
    );
  }

  // 2. Fix redundant logo alt text in header
  content = content.replace(
    /<img class="h-14 w-14 shrink-0" src="assets\/img\/logo\.png" alt="Comercial Elite"/g,
    '<img class="h-14 w-14 shrink-0" src="assets/img/logo.png" alt=""'
  );

  // 3. Fix breadcrumbs touch targets (min-h-11 / py-1.5)
  content = content.replace(
    /<ol class="flex flex-wrap gap-1\.5">/g,
    '<ol class="flex flex-wrap items-center gap-1.5">'
  );
  content = content.replace(
    /<li class="after:mx-1\.5 after:text-elite-border after:content-\['›'\] last:after:content-none dark:after:text-elitenight-border"><a href="index\.html">Inicio<\/a><\/li>/g,
    '<li class="inline-flex min-h-11 items-center after:mx-1.5 after:text-elite-border after:content-[\'›\'] last:after:content-none dark:after:text-elitenight-border"><a class="inline-flex min-h-11 items-center py-1" href="index.html">Inicio</a></li>'
  );

  // 4. Fix footer links touch targets (min-h-11)
  content = content.replace(
    /class="text-white hover:text-elite-lime focus-visible:text-elite-lime dark:text-elitenight-text dark:hover:text-elitenight-dark dark:focus-visible:text-elitenight-dark"/g,
    'class="inline-flex min-h-11 items-center text-white hover:text-elite-lime focus-visible:text-elite-lime dark:text-elitenight-text dark:hover:text-elitenight-dark dark:focus-visible:text-elitenight-dark"'
  );

  fs.writeFileSync(filePath, content, "utf8");
  console.log("Applied audit fixes to", file);
});

// Specific fix for catalogo.html: MEDIO 4 (h1 -> h2 heading hierarchy)
const catalogoPath = path.join(baseDir, "catalogo.html");
let catalogoContent = fs.readFileSync(catalogoPath, "utf8");

if (!catalogoContent.includes('<h2 class="sr-only" id="tituloRejilla">')) {
  catalogoContent = catalogoContent.replace(
    '<ul class="grid grid-cols-1 gap-5 s30:grid-cols-2 s60:grid-cols-3" id="rejillaProductos" aria-busy="true"></ul>',
    '<h2 class="sr-only" id="tituloRejilla">Productos del catálogo</h2>\n          <ul class="grid grid-cols-1 gap-5 s30:grid-cols-2 s60:grid-cols-3" id="rejillaProductos" aria-busy="true" aria-labelledby="tituloRejilla"></ul>'
  );
  fs.writeFileSync(catalogoPath, catalogoContent, "utf8");
  console.log("Added h2 heading hierarchy fix to catalogo.html");
}

// Specific fix for carrito.html: ALTO 2 (remove aria-live from list container)
const carritoPath = path.join(baseDir, "carrito.html");
let carritoContent = fs.readFileSync(carritoPath, "utf8");
carritoContent = carritoContent.replace(
  '<ul class="flex flex-col gap-4" id="listaCarrito" aria-live="polite"></ul>',
  '<ul class="flex flex-col gap-4" id="listaCarrito"></ul>'
);
fs.writeFileSync(carritoPath, carritoContent, "utf8");
console.log("Removed aria-live from listaCarrito in carrito.html");
