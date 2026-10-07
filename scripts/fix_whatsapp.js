const fs = require("fs");
const path = require("path");

const baseDir = path.join(__dirname, "..");

// 1. Fix JS files (593999999999 -> 593987855906)
["js/carrito.js", "js/producto.js"].forEach((file) => {
  const filePath = path.join(baseDir, file);
  let content = fs.readFileSync(filePath, "utf8");
  content = content.replace(/593999999999/g, "593987855906");
  fs.writeFileSync(filePath, content, "utf8");
  console.log("Fixed WhatsApp number in", file);
});

// 2. Fix Header phone buttons in all HTML files
const htmlFiles = [
  "index.html",
  "catalogo.html",
  "nosotros.html",
  "contacto.html",
  "carrito.html",
  "producto.html",
  "registro.html",
];

htmlFiles.forEach((file) => {
  const filePath = path.join(baseDir, file);
  let content = fs.readFileSync(filePath, "utf8");

  // Replace header phone link (tel:+593987855906 in header)
  const headerLinkRegex =
    /<a class="inline-flex min-h-11 items-center gap-1\.5 font-semibold text-white no-underline hover:text-elite-lime" href="tel:\+593987855906">\s*<span aria-hidden="true">📞<\/span>\s*098&nbsp;785&nbsp;5906\s*<\/a>/gi;

  const newHeaderLink = `<a class="inline-flex min-h-11 items-center gap-1.5 font-semibold text-white no-underline hover:text-elite-lime" href="https://wa.me/593987855906?text=Hola%2C%20quiero%20cotizar%20insumos%20en%20Comercial%20Elite" target="_blank" rel="noopener noreferrer" title="Cotizar por WhatsApp (098 785 5906)">
        <span aria-hidden="true">💬</span> 098&nbsp;785&nbsp;5906
      </a>`;

  content = content.replace(headerLinkRegex, newHeaderLink);

  // Also fix any leftover href="tel:+593987855906" that says (WhatsApp)
  content = content.replace(
    /href="tel:\+593987855906">([^<]*\(WhatsApp\))/gi,
    'href="https://wa.me/593987855906?text=Hola%2C%20quiero%20cotizar%20insumos%20en%20Comercial%20Elite" target="_blank" rel="noopener noreferrer">$1'
  );

  fs.writeFileSync(filePath, content, "utf8");
  console.log("Updated header & WhatsApp links in", file);
});
