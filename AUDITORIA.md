# Auditoría WCAG 2.2 AA · Comercial Elite

Fecha: 2026-10-02 · Auditoría **no destructiva**: no se modificó ningún archivo del sitio.
Alcance: 7 páginas, `styles.css`, 10 módulos de `js/`, `data/catalogo.json`.

## 1. Resumen

| Severidad | Cantidad | Tema |
|---|---|---|
| CRÍTICO | 1 | El atributo `hidden` no oculta nada en 4 componentes |
| ALTO | 2 | Foco perdido en el carrito · Contraste 2.28:1 en modo oscuro |
| MEDIO | 2 | Salto de encabezado `h1`→`h3` · Objetivos táctiles de 19–21 px |
| BAJO | 3 | `alt` redundante · `innerHTML` con dato del usuario · foco recortado |

## 2. Hallazgos, evidencia y corrección

### CRÍTICO 1 · `hidden` es anulado por las utilidades `display`
Tailwind Play CDN emite `[hidden]:where(:not([hidden=until-found])){display:none}` con especificidad **0**; `.grid`, `.flex` e `.inline-flex` se generan después con la misma especificidad y ganan.

Evidencia (Edge, `getComputedStyle`):

| Archivo:línea | Elemento | `hidden` | `display` real |
|---|---|---|---|
| `producto.html:104` | `#fichaProducto` | `true` | **`grid`** (361 px visibles) |
| `carrito.html:115` | `#botonVaciarCarrito` | `true` | **`inline-flex`** |
| `carrito.html:112` | `#listaCarrito` | `true` | **`flex`** |
| `registro.html:149` | `#botonBorrarRegistro` | `true` | **`inline-flex`** |

Consecuencias reales: con el carrito vacío se ve «Vaciar carrito»; sin datos guardados se ve «Borrar mis datos» junto a *«No tienes datos guardados en este navegador.»*; con un id inexistente (`producto.html?id=NO-EXISTE`) se muestra a la vez el error **y** una ficha vacía con el botón «Agregar al carrito». Afecta **1.3.1** y **4.1.2**.

**Corrección:** añadir a `styles.css` (gana siempre, sea cual sea el orden):
```css
[hidden] { display: none !important; }
```

### ALTO 2 · El foco se pierde al cambiar la cantidad (carrito)
Evidencia: con foco en *«Sumar una unidad de Suela EVA liviana»*, tras el clic `document.activeElement === document.body`. Causa: `renderizar()` reconstruye la lista en `js/carrito.js:161-166` (`listaCarrito.innerHTML = ""`). Además `#listaCarrito` tiene `aria-live="polite"` (`carrito.html:112`) y `#totalCarrito` también, por lo que la lista entera se anuncia en cada pulsación. Afecta **2.4.3**.

**Corrección:** actualizar solo la fila y la celda de cantidad afectadas en vez de recrear el `<ul>`, o guardar/restarurar el foco en el mismo control; y mover `aria-live` a un nodo resumen (p. ej. `#avisoCarrito`) en lugar del contenedor de la lista.

### ALTO 3 · Contraste 2.28:1 en «Agregar al carrito» (modo oscuro)
Evidencia: axe `color-contrast` *serious* y `getComputedStyle` → `color: rgb(255,255,255)`, `background: rgb(217,160,102)`. Causa: `producto.html:145` y `js/producto.js:157` usan `dark:text-elitenight-ink`, pero la paleta `elitenight` (`catalogo.html:44-54`, replicada en las 7 páginas) **no define `ink`**; la clase nunca se genera y gana `text-white`. En claro sí cumple (5.26:1). Afecta **1.4.3**.

**Corrección:** añadir `ink: "#14170F"` a la paleta `elitenight` del `tailwind.config` en línea de las 7 páginas, o cambiar esas dos clases por `dark:text-elite-ink`.

### MEDIO 4 · Salto de encabezado `h1` → `h3` en el catálogo
Evidencia: axe `heading-order` *moderate* en `li > article[data-categoria="cueros"] > h3`. `js/catalogo.js:116` crea el `h3` de cada tarjeta, pero `catalogo.html` no tiene ningún `h2` entre el `h1` y las tarjetas. Afecte **1.3.1**/**2.4.6**.

**Corrección:** envolver `#rejillaProductos` en una sección con `<h2 class="sr-only">Resultados del catálogo</h2>`, o usar `<h2>` en el título de cada tarjeta.

### MEDIO 5 · Objetivos táctiles de 19–21 px (WCAG 2.2 · 2.5.8)
Medido en las 7 páginas: los enlaces sueltos del pie miden 21 px de alto — *Facebook* (67×21), *Instagram* (71×21), *Cómo llegar y contacto* (164×21), *Registrarse* (77×21), *Descargar catálogo (PDF)* (226×21) — y las migas 19 px (*Inicio* 33×19). **Cumplen** los casos de excepción: checkboxes con fila `316×36`, botones `316×44`, tarjetas con overlay `358×496` y los enlaces dentro de oraciones («Ver catálogo», «Regístrate», teléfono y correo del `address`).

**Corrección:** añadir `min-h-11` (o `py-1.5`) a esos enlaces del pie y a los `<li>` de las migas.

### BAJO 6 · `alt` redundante del logo
axe `image-redundant-alt` en las 7 páginas: `<img alt="Comercial Elite">` dentro de un enlace cuyo texto visible ya es «Comercial Elite».

**Corrección:** `alt=""` (el nombre accesible ya lo aporta el texto del enlace).

### BAJO 7 · `innerHTML` con texto libre del usuario
`js/carrito.js:203` interpola `pedido.nombre` —procedente del formulario de registro— dentro de `li.innerHTML`. Riesgo de inyección local (auto-XSS) y de rotura visual si el nombre trae `<` o `&`.

**Corrección:** construir el `<li>` con `createElement`/`textContent`, como ya se hace en `crearFilaCarrito`.

### BAJO 8 · Indicador de foco recortado en el carrusel
`.ventana a { outline: none }` (`styles.css:220`) se sustituye por `.ventana a:focus-visible .ventana-etiqueta` (`styles.css:351`) presente en las 8 ventanas, pero `#diagonales` mide 1312 px con `overflow: hidden` en 1280 px de ancho: los bordes de foco de la primera y la última ventana quedan cortados.

**Corrección:** dar `padding-inline` al carrusel o aplicar el `outline` sobre el elemento que no se recorta.

## 3. Criterios que ya cumple

- Un único `<h1>` por página y jerarquía coherente.
- Skip link funcional: su destino existe en las 7 páginas (`styles.css:49-65`).
- Todos los controles tienen nombre accesible; todos los campos tienen `<label>` o `aria-label`.
- Sin IDs duplicados, sin referencias ARIA rotas, sin `tabindex` positivo y sin `target="_blank"` sin `noopener`.
- Menú móvil: `aria-expanded` correcto, `Escape` cierra y devuelve el foco; sin desbordamiento con el menú abierto.
- **Sin scroll horizontal** en 320, 390, 768 y 1280 px en las 7 páginas, con menú abierto y cerrado.
- Indicador de foco visible de 3 px; `prefers-reduced-motion` contemplado (`styles.css:565`).
- Sin errores de JavaScript ni de consola en ninguna página.
- Contraste AA en los textos y botones principales de los modos claro y oscuro, salvo el hallazgo 3.

## 4. Verificación realizada

- `node --check` en los 10 módulos de `js/` y los 4 scripts de `scripts/`: **sin errores de sintaxis**.
- axe-core (wcag2a/aa, 2.1 aa, 2.2 aa y best-practice) sobre las 7 páginas × 4 anchos: los 8 hallazgos anteriores son las únicas incidencias que devuelve.
- Lectura de estilos computados en Edge para `hidden`/`display`, contraste real, `color-scheme` claro y oscuro, tamaños de objetivos, `aria-live`, foco activo y altura del carrusel.
- Análisis del CSS generado por Tailwind Play CDN (orden de la cascada, `:where()`, tokens de color y variantes `dark:`/`s30`/`max-[54.99em]:`).

## 5. Cambios aplicados

Ninguno. La auditoría fue de solo lectura; los scripts de comprobación quedaron fuera del proyecto, en `C:\Users\lenovo\AppData\Local\Temp\opencode\audit`. Tras aplicar las correcciones de los puntos 1, 2 y 3 conviene repetir esta misma batería y volver a pasar axe-core.