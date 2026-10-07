const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..");
const jsonPath = path.join(rootDir, "data", "catalogo.json");
const pdfPath = path.join(rootDir, "assets", "catalogo.pdf");

const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const { empresa, categorias, productos } = data;

const doc = new PDFDocument({
  size: "A4",
  margin: 36, // 0.5 inch margins = 36 pt
  bufferPages: true,
});

const writeStream = fs.createWriteStream(pdfPath);
doc.pipe(writeStream);

// Colors
const COLOR_DARK = "#14170F";
const COLOR_GREEN = "#4E6E1C";
const COLOR_LIME = "#93DC1D";
const COLOR_TINT = "#E9F4D7";
const COLOR_BORDER = "#A7C577";
const COLOR_TEXT = "#1A1A1A";
const COLOR_MUTED = "#555555";
const COLOR_CUERO = "#8B5E34";

// Page dimensions
const pageWidth = doc.page.width;
const pageHeight = doc.page.height;
const margin = 36;
const contentWidth = pageWidth - margin * 2;

function drawHeader(isFirstPage = false) {
  if (isFirstPage) {
    // Top banner
    doc.rect(0, 0, pageWidth, 100).fill(COLOR_DARK);

    // Title
    doc.fillColor("#FFFFFF").fontSize(22).font("Helvetica-Bold").text("Comercial Elite", margin, 24);

    doc.fillColor(COLOR_LIME).fontSize(12).font("Helvetica-Bold").text("Insumos para calzado y marroquinería en Quito", margin, 52);

    doc
      .fillColor("#E2E8F0")
      .fontSize(9)
      .font("Helvetica")
      .text(`Dirección: ${empresa.direccion}  |  WhatsApp: ${empresa.telefonoVisible}  |  Email: ${empresa.correo}`, margin, 72);

    doc.y = 115;
  } else {
    // Compact Header
    doc.rect(0, 0, pageWidth, 40).fill(COLOR_DARK);
    doc.fillColor("#FFFFFF").fontSize(12).font("Helvetica-Bold").text("Comercial Elite", margin, 14);
    doc.fillColor(COLOR_LIME).fontSize(10).font("Helvetica").text("Catálogo Oficial de Productos", pageWidth - margin - 180, 15, { align: "right" });
    doc.y = 55;
  }
}

// Draw first page header
drawHeader(true);

// Catalog Intro
doc.fillColor(COLOR_DARK).fontSize(14).font("Helvetica-Bold").text("Catálogo Completo de Insumos", margin, doc.y);
doc.moveDown(0.3);
doc
  .fillColor(COLOR_TEXT)
  .fontSize(9.5)
  .font("Helvetica")
  .text(
    "Distribución directa para talleres, fábricas pequeñas y artesanos del calzado y la marroquinería en Quito. Precios y stock al día.",
    margin,
    doc.y,
    { width: contentWidth }
  );

doc.moveDown(0.8);

// Group products by category
const productosPorCategoria = {};
categorias.forEach((cat) => {
  productosPorCategoria[cat.slug] = productos.filter((p) => p.categoria === cat.slug);
});

categorias.forEach((cat) => {
  const prods = productosPorCategoria[cat.slug] || [];
  if (prods.length === 0) return;

  // Check if we need space for category header + at least 1 product (approx 120pt)
  if (doc.y > pageHeight - margin - 140) {
    doc.addPage();
    drawHeader(false);
  }

  // Category Header Banner
  const catY = doc.y;
  doc.rect(margin, catY, contentWidth, 24).fill(COLOR_GREEN);
  doc
    .fillColor("#FFFFFF")
    .fontSize(11)
    .font("Helvetica-Bold")
    .text(cat.nombre.toUpperCase(), margin + 10, catY + 6);

  doc.y = catY + 30;

  prods.forEach((p) => {
    // Card height ~85pt
    if (doc.y > pageHeight - margin - 90) {
      doc.addPage();
      drawHeader(false);
    }

    const itemY = doc.y;
    const cardHeight = 82;

    // Card background
    doc
      .rect(margin, itemY, contentWidth, cardHeight)
      .fillAndStroke(COLOR_TINT, COLOR_BORDER);

    // Code badge
    doc.rect(margin + 10, itemY + 10, 65, 18).fill(COLOR_DARK);
    doc.fillColor("#FFFFFF").fontSize(9).font("Helvetica-Bold").text(p.id, margin + 10, itemY + 14, { width: 65, align: "center" });

    // Product Title
    doc
      .fillColor(COLOR_DARK)
      .fontSize(11)
      .font("Helvetica-Bold")
      .text(p.nombre, margin + 85, itemY + 11, { width: contentWidth - 180 });

    // Price badge
    doc
      .fillColor(COLOR_CUERO)
      .fontSize(13)
      .font("Helvetica-Bold")
      .text(`$${p.precio.toFixed(2)}`, margin + contentWidth - 85, itemY + 10, { width: 75, align: "right" });

    // Novedad tag
    if (p.novedad) {
      doc.rect(margin + contentWidth - 85, itemY + 28, 75, 14).fill(COLOR_LIME);
      doc.fillColor(COLOR_DARK).fontSize(7.5).font("Helvetica-Bold").text("¡NOVEDAD!", margin + contentWidth - 85, itemY + 31, { width: 75, align: "center" });
    }

    // Product details
    doc
      .fillColor(COLOR_TEXT)
      .fontSize(8.5)
      .font("Helvetica")
      .text(`Presentación: `, margin + 10, itemY + 36, { continued: true })
      .font("Helvetica-Bold")
      .text(p.presentacion, { continued: true })
      .font("Helvetica")
      .text(`   |   Subcategoría: `, { continued: true })
      .font("Helvetica-Bold")
      .text(p.subcategoria);

    doc
      .font("Helvetica")
      .text(`Colores disponibles: `, margin + 10, itemY + 50, { continued: true })
      .font("Helvetica-Bold")
      .text(p.colores.join(", "));

    doc
      .font("Helvetica")
      .fillColor(COLOR_MUTED)
      .text(`Uso recomendado: ${p.uso}`, margin + 10, itemY + 64, { width: contentWidth - 20 });

    doc.y = itemY + cardHeight + 10;
  });

  doc.moveDown(0.5);
});

// Footers and Page Numbers
const totalPages = doc.bufferedPageRange().count;
for (let i = 0; i < totalPages; i++) {
  doc.switchToPage(i);

  // Footer bar
  const footerY = pageHeight - 30;
  doc.rect(0, footerY - 5, pageWidth, 35).fill(COLOR_DARK);

  doc
    .fillColor("#FFFFFF")
    .fontSize(8)
    .font("Helvetica")
    .text(
      `Comercial Elite — Quito, Ecuador  |  Tel: ${empresa.telefonoVisible}  |  Email: ${empresa.correo}`,
      margin,
      footerY + 2
    );

  doc
    .fillColor(COLOR_LIME)
    .fontSize(8)
    .font("Helvetica-Bold")
    .text(`Página ${i + 1} de ${totalPages}`, pageWidth - margin - 100, footerY + 2, { align: "right" });
}

doc.end();

writeStream.on("finish", () => {
  console.log(`PDF catalog generated successfully (${fs.statSync(pdfPath).size} bytes, ${totalPages} pages).`);
});
