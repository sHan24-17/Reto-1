"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const RAIZ = path.resolve(__dirname, "..");
const ARCHIVOS = {
  html: fs.readdirSync(RAIZ).filter((n) => n.endsWith(".html")).sort(),
  js: [
    ...fs.readdirSync(path.join(RAIZ, "js")).filter((n) => n.endsWith(".js")).map((n) => path.join("js", n)),
    ...fs.readdirSync(path.join(RAIZ, "scripts")).filter((n) => n.endsWith(".js")).map((n) => path.join("scripts", n)),
  ],
};

function leer(rel) {
  return fs.readFileSync(path.join(RAIZ, rel), "utf8");
}

function existe(rel) {
  return fs.existsSync(path.join(RAIZ, rel));
}

function sinQuery(url) {
  return url.split(/[?#]/)[0];
}

function enlacesDe(html) {
  const refs = [];
  const re = /(?:href|src)="([^"]+)"/g;
  let m;
  while ((m = re.exec(html)) !== null) refs.push(m[1]);
  return refs;
}

test("el JavaScript pasa la comprobación de sintaxis de node", () => {
  for (const rel of ARCHIVOS.js) {
    assert.doesNotThrow(
      () => execFileSync(process.execPath, ["--check", path.join(RAIZ, rel)], { stdio: "pipe" }),
      `${rel} tiene un error de sintaxis`,
    );
  }
});

test("data/catalogo.json es válido y tiene la estructura esperada", () => {
  const datos = JSON.parse(leer("data/catalogo.json"));

  assert.ok(datos.empresa && typeof datos.empresa.nombre === "string", "falta empresa.nombre");
  assert.ok(Array.isArray(datos.categorias) && datos.categorias.length > 0, "falta categorias");
  assert.ok(Array.isArray(datos.productos) && datos.productos.length > 0, "falta productos");

  const slugs = new Set(datos.categorias.map((c) => c.slug));
  assert.equal(slugs.size, datos.categorias.length, "slugs de categoría duplicados");

  const ids = new Set();
  for (const p of datos.productos) {
    assert.match(p.id, /^CE-\d{4}$/, `id inválido: ${p.id}`);
    assert.ok(!ids.has(p.id), `id duplicado: ${p.id}`);
    ids.add(p.id);
    assert.ok(slugs.has(p.categoria), `${p.id} usa categoría inexistente: ${p.categoria}`);
    assert.equal(typeof p.precio, "number", `${p.id} sin precio numérico`);
    assert.ok(p.precio > 0, `${p.id} con precio no positivo`);
    assert.ok(typeof p.nombre === "string" && p.nombre.length > 0, `${p.id} sin nombre`);
    assert.ok(existe(p.imagen), `${p.id} referencia imagen inexistente: ${p.imagen}`);
    for (const img of p.imagenes || []) {
      assert.ok(existe(img.src), `${p.id} referencia galería inexistente: ${img.src}`);
      assert.ok(img.alt && img.alt.length > 10, `${p.id} imagen sin alt descriptivo`);
    }
  }
});

test("cada página HTML declara lang, charset, título y un h1", () => {
  assert.ok(ARCHIVOS.html.length >= 7, "faltan páginas HTML");
  for (const archivo of ARCHIVOS.html) {
    const html = leer(archivo);
    assert.match(html, /<html[^>]*\slang="[a-z]{2}"/, `${archivo}: falta lang`);
    assert.match(html, /<meta[^>]*charset="UTF-8"/i, `${archivo}: falta meta charset UTF-8`);
    const titulo = html.match(/<title>([^<]*)<\/title>/);
    assert.ok(titulo && titulo[1].trim().length > 0, `${archivo}: falta <title>`);
    assert.ok((html.match(/<h1[\s>]/g) || []).length === 1, `${archivo}: debe tener exactamente un <h1>`);
    assert.match(html, /<meta[^>]+name="viewport"/, `${archivo}: falta viewport`);
  }
});

test("todos los enlaces y recursos internos de las páginas existen", () => {
  for (const archivo of ARCHIVOS.html) {
    const html = leer(archivo);
    for (const ref of enlacesDe(html)) {
      if (/^(https?:|mailto:|tel:|data:|javascript:|#|\/\/)/i.test(ref)) continue;
      const destino = sinQuery(ref);
      if (!destino) continue;
      assert.ok(existe(destino), `${archivo}: referencia rota -> ${ref}`);
    }
  }
});

test("todo recurso referenciado desde data/catalogo.json existe", () => {
  const datos = JSON.parse(leer("data/catalogo.json"));
  const recursos = [datos.productos.map((p) => p.imagen), datos.productos.flatMap((p) => (p.imagenes || []).map((i) => i.src))].flat();
  for (const rel of recursos) {
    assert.ok(existe(rel), `recurso inexistente: ${rel}`);
  }
});

test("sitemap.xml y robots.txt apuntan a páginas existentes", () => {
  const sitemap = leer("sitemap.xml");
  const locs = [...sitemap.matchAll(/<loc>[^<]*\/([^/<]+)<\/loc>/g)].map((m) => m[1]);
  assert.ok(locs.length >= 6, "el sitemap tiene muy pocas URLs");
  for (const pagina of locs) {
    assert.ok(existe(pagina), `sitemap: página inexistente -> ${pagina}`);
  }
  assert.match(leer("robots.txt"), /Sitemap:\s*\S+\/sitemap\.xml/);
});

test("el README documenta el proyecto", () => {
  const readme = leer("README.md");
  assert.match(readme, /^#\s+\S/m, "el README no tiene título");
  for (const seccion of ["Estructura", "Arquitectura", "ejecutar", "Despliegue"]) {
    assert.ok(readme.includes(seccion), `el README no menciona: ${seccion}`);
  }
});
