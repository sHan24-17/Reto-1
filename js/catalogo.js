// Catálogo: carga data/catalogo.json, renderiza la rejilla y filtra en el
// navegador sin recargar la página (RF-02, RF-04, RNF-04).
(() => {
  const rejilla = document.getElementById("rejillaProductos");
  const contador = document.getElementById("contadorResultados");
  const sinResultados = document.getElementById("sinResultados");
  const errorCarga = document.getElementById("errorCarga");
  const fieldsetCategoria = document.getElementById("filtroCategoria");
  const buscador = document.getElementById("buscador");
  const botonLimpiar = document.getElementById("botonLimpiar");
  const botonLimpiarAlterno = document.getElementById("botonLimpiarAlterno");
  const avisoCarrito = document.getElementById("avisoCarritoGlobal");

  if (!rejilla) return;

  // Botón "Agregar al carrito": Verde de marca distintivo y de alto contraste
  const CLASES_BOTON_AGREGAR =
    "add-carrito relative z-10 mt-1 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-elite px-4 font-bold text-white transition-colors hover:bg-elite-dark active:brightness-75 dark:bg-elitenight dark:text-elitenight-bg dark:hover:bg-elitenight-medium";
  const CLASES_BOTON_AGREGADO =
    "add-carrito relative z-10 mt-1 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-elite-lime px-4 font-bold text-elite-ink transition-colors dark:bg-elite-lime dark:text-elite-ink";

  function confirmarAgregado(boton) {
    const texto = boton.querySelector(".texto-boton-carrito");
    boton.className = CLASES_BOTON_AGREGADO;
    if (texto) texto.textContent = "✓ Agregado";
    window.clearTimeout(boton._temporizadorConfirmacion);
    boton._temporizadorConfirmacion = window.setTimeout(() => {
      boton.className = CLASES_BOTON_AGREGAR;
      if (texto) texto.textContent = "Agregar al carrito";
    }, 1400);
  }

  let productos = [];
  let categorias = [];

  const normalizar = (texto) =>
    (texto || "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const parametros = new URLSearchParams(window.location.search);
  const categoriaInicial = parametros.get("cat");

  function crearFiltrosCategoria() {
    if (!fieldsetCategoria) return;
    categorias.forEach(({ slug, nombre }) => {
      const total = productos.filter((p) => p.categoria === slug).length;
      const id = `filtro-${slug}`;
      const contenedor = document.createElement("div");
      contenedor.className = "flex min-h-9 items-center gap-2";

      const casilla = document.createElement("input");
      casilla.type = "checkbox";
      casilla.id = id;
      casilla.name = "categoria";
      casilla.value = slug;
      casilla.className = "h-5 w-5 accent-elite-dark dark:accent-elitenight-dark";
      if (categoriaInicial === slug) casilla.checked = true;

      const etiqueta = document.createElement("label");
      etiqueta.setAttribute("for", id);
      etiqueta.textContent = `${nombre} (${total})`;

      contenedor.append(casilla, etiqueta);
      fieldsetCategoria.append(contenedor);
    });
  }

  function actualizarBadgesCarrito(datosCarrito) {
    if (!datosCarrito || !datosCarrito.items) return;
    const mapaCantidades = new Map(datosCarrito.items.map((i) => [i.id, i.cantidad]));

    rejilla.querySelectorAll(".badge-en-carrito").forEach((badge) => {
      const id = badge.getAttribute("data-id-badge");
      const cant = mapaCantidades.get(id) || 0;
      if (cant > 0) {
        badge.textContent = `✓ ${cant} añadido${cant > 1 ? "s" : ""}`;
        badge.classList.remove("hidden");
      } else {
        badge.classList.add("hidden");
      }
    });
  }

  function crearTarjeta(producto) {
    const li = document.createElement("li");

    const articulo = document.createElement("article");
    articulo.className =
      "tarjeta-producto relative flex h-full flex-col overflow-hidden rounded-lg border border-elite-border bg-white shadow-[0_1px_3px_rgba(26,26,26,0.12)] dark:border-elitenight-border dark:bg-elitenight-bg";
    articulo.setAttribute("data-categoria", producto.categoria || "");
    articulo.setAttribute(
      "data-buscable",
      normalizar([producto.nombre, producto.id, producto.subcategoria, producto.uso].join(" "))
    );

    const figura = document.createElement("figure");
    figura.className = "m-0 bg-elite-tint dark:bg-elitenight-tint";
    const img = document.createElement("img");
    img.src = producto.imagen;
    img.alt = producto.alt || "";
    img.className = "aspect-[4/3] w-full object-cover";
    img.width = 400;
    img.height = 300;
    img.loading = "lazy";
    const figcaption = document.createElement("figcaption");
    figcaption.className = "sr-only";
    figcaption.textContent = producto.nombre;
    figura.append(img, figcaption);

    const cuerpo = document.createElement("div");
    cuerpo.className = "flex flex-1 flex-col gap-1.5 p-5";

    const h3 = document.createElement("h3");
    h3.className = "mb-0 text-base font-semibold";
    const enlace = document.createElement("a");
    enlace.className =
      "text-elite-dark no-underline after:absolute after:inset-0 after:content-[''] dark:text-elitenight-dark";
    enlace.href = `producto.html?id=${encodeURIComponent(producto.id)}`;
    enlace.textContent = producto.nombre;
    h3.append(enlace);

    const meta = document.createElement("p");
    meta.className = "m-0 text-sm text-elite-text dark:text-elitenight-text";
    meta.textContent = `${producto.id} · ${producto.presentacion}`;

    // Pequeña etiqueta que indica cuántas unidades están en el carrito ("X añadidos")
    const badgeCarrito = document.createElement("span");
    badgeCarrito.className =
      "badge-en-carrito hidden inline-flex w-fit items-center gap-1 rounded-full bg-elite-tint px-2.5 py-0.5 text-xs font-bold text-elite-dark dark:bg-elitenight-tint dark:text-elitenight-dark";
    badgeCarrito.setAttribute("data-id-badge", producto.id);

    cuerpo.append(h3, meta, badgeCarrito);

    if (producto.novedad) {
      const chip = document.createElement("span");
      chip.className =
        "inline-flex w-fit items-center gap-1 rounded-full bg-elite-lime px-3 py-0.5 text-xs font-bold text-elite-ink before:content-['●'] before:text-[0.7em]";
      chip.textContent = "Nuevo ingreso";
      cuerpo.append(chip);
    }

    const precio = document.createElement("p");
    precio.className = "m-0 font-bold text-elite-cuero dark:text-elitenight-cuero";
    precio.textContent = `$${Number(producto.precio).toFixed(2)}`;

    const botonAgregar = document.createElement("button");
    botonAgregar.type = "button";
    botonAgregar.className = CLASES_BOTON_AGREGAR;
    botonAgregar.setAttribute("data-id", producto.id);
    botonAgregar.setAttribute("data-nombre", producto.nombre);
    botonAgregar.setAttribute("aria-label", `Agregar ${producto.nombre} al carrito`);
    botonAgregar.innerHTML = `<span aria-hidden="true">🛒</span><span class="texto-boton-carrito">Agregar al carrito</span>`;

    cuerpo.append(precio, botonAgregar);

    articulo.append(figura, cuerpo);
    li.append(articulo);
    return li;
  }

  function renderizarProductos() {
    rejilla.innerHTML = "";
    const fragmento = document.createDocumentFragment();
    productos.forEach((producto) => fragmento.append(crearTarjeta(producto)));
    rejilla.append(fragmento);
    rejilla.removeAttribute("aria-busy");
  }

  function categoriasSeleccionadas() {
    if (!fieldsetCategoria) return [];
    return Array.from(fieldsetCategoria.querySelectorAll("input:checked")).map(
      (input) => input.value
    );
  }

  function aplicarFiltros() {
    const seleccionadas = categoriasSeleccionadas();
    const termino = normalizar((buscador && buscador.value) ? buscador.value.trim() : "");
    let visibles = 0;

    rejilla.querySelectorAll(".tarjeta-producto").forEach((tarjeta) => {
      const cat = tarjeta.getAttribute("data-categoria");
      const buscable = tarjeta.getAttribute("data-buscable") || "";
      const coincideCategoria = seleccionadas.length === 0 || seleccionadas.includes(cat);
      const coincideBusqueda = termino === "" || buscable.includes(termino);
      const visible = coincideCategoria && coincideBusqueda;
      const li = tarjeta.closest("li");
      if (li) li.hidden = !visible;
      if (visible) visibles += 1;
    });

    if (contador) {
      contador.textContent =
        visibles === 1 ? "1 producto encontrado" : `${visibles} productos encontrados`;
    }
    if (sinResultados) sinResultados.hidden = visibles !== 0;

    if (window.AlmacenCE && window.AlmacenCE.filtros) {
      window.AlmacenCE.filtros
        .guardar({ busqueda: (buscador && buscador.value) ? buscador.value.trim() : "", categorias: seleccionadas })
        .catch(() => {});
    }
  }

  function anunciarCarrito(texto, esError = false) {
    if (!avisoCarrito) return;
    avisoCarrito.setAttribute("role", esError ? "alert" : "status");
    avisoCarrito.className = esError
      ? "mb-3 font-semibold text-error dark:text-error-dark"
      : "mb-3 font-semibold text-elite-dark dark:text-elitenight-dark";
    avisoCarrito.textContent = texto;
  }

  function limpiarFiltros() {
    if (fieldsetCategoria) {
      fieldsetCategoria.querySelectorAll("input:checked").forEach((input) => {
        input.checked = false;
      });
    }
    if (buscador) buscador.value = "";
    aplicarFiltros();
    if (buscador) buscador.focus();
  }

  function iniciar(datos, filtrosGuardados) {
    productos = datos.productos || [];
    categorias = datos.categorias || [];

    crearFiltrosCategoria();
    renderizarProductos();

    if (!categoriaInicial && filtrosGuardados) {
      if (filtrosGuardados.busqueda && buscador) buscador.value = filtrosGuardados.busqueda;
      if (filtrosGuardados.categorias && fieldsetCategoria) {
        filtrosGuardados.categorias.forEach((slug) => {
          const casilla = fieldsetCategoria.querySelector(`input[value="${slug}"]`);
          if (casilla) casilla.checked = true;
        });
      }
    }

    aplicarFiltros();

    if (window.AlmacenCE && window.AlmacenCE.carrito) {
      window.AlmacenCE.carrito.obtener().then(actualizarBadgesCarrito).catch(() => {});
    }

    document.addEventListener("ce:carrito-actualizado", (evento) => {
      actualizarBadgesCarrito(evento.detail);
    });

    if (fieldsetCategoria) fieldsetCategoria.addEventListener("change", aplicarFiltros);
    if (buscador) buscador.addEventListener("input", aplicarFiltros);
    if (botonLimpiar) botonLimpiar.addEventListener("click", limpiarFiltros);
    if (botonLimpiarAlterno) botonLimpiarAlterno.addEventListener("click", limpiarFiltros);

    rejilla.addEventListener("click", (evento) => {
      const boton = evento.target.closest(".add-carrito");
      if (!boton) return;
      const itemId = boton.getAttribute("data-id");
      const itemNombre = boton.getAttribute("data-nombre");
      if (window.AlmacenCE && window.AlmacenCE.carrito) {
        window.AlmacenCE.carrito
          .agregarItem(itemId, 1)
          .then(() => {
            confirmarAgregado(boton);
            anunciarCarrito(`Se agregó ${itemNombre} al carrito.`);
          })
          .catch((error) => anunciarCarrito(error.mensaje ?? "No se pudo agregar al carrito.", true));
      }
    });
  }

  const obtenerDatosCatalogo = window.AlmacenCE && window.AlmacenCE.catalogo
    ? window.AlmacenCE.catalogo.obtener()
    : fetch("data/catalogo.json").then((r) => r.json());

  const obtenerFiltros = window.AlmacenCE && window.AlmacenCE.filtros
    ? window.AlmacenCE.filtros.obtener().catch(() => null)
    : Promise.resolve(null);

  Promise.all([obtenerDatosCatalogo, obtenerFiltros])
    .then(([datos, filtrosGuardados]) => {
      if (errorCarga) errorCarga.hidden = true;
      if (rejilla) rejilla.hidden = false;
      iniciar(datos, filtrosGuardados);
    })
    .catch((error) => {
      console.error("No se pudo cargar el catálogo:", error);
      if (contador) contador.textContent = "";
      if (rejilla) rejilla.hidden = true;
      if (errorCarga) errorCarga.hidden = false;
    });
})();
