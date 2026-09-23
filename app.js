const CATEGORIES = ["Todos", "Abstracto", "Botánico", "Óleo", "Textura Minimalista"];

const ARTWORKS = [
  { id: 1, title: "Marea de Ocre", category: "Abstracto", size: "100x140 cm — Marco de Roble", price: "$185.000", seed: "marea-ocre", tall: true },
  { id: 2, title: "Follaje Suspendido", category: "Botánico", size: "60x80 cm — Marco de Nogal", price: "$96.000", seed: "follaje-suspendido" },
  { id: 3, title: "Veta de Sombra", category: "Óleo", size: "90x120 cm — Sin Marco", price: "$210.000", seed: "veta-sombra", tall: true },
  { id: 4, title: "Lino Crudo", category: "Textura Minimalista", size: "70x70 cm — Marco Flotante", price: "$78.000", seed: "lino-crudo" },
  { id: 5, title: "Bruma de Sena", category: "Abstracto", size: "80x100 cm — Marco de Roble", price: "$142.000", seed: "bruma-sena" },
  { id: 6, title: "Jardín Cerrado", category: "Botánico", size: "100x100 cm — Marco de Nogal", price: "$168.000", seed: "jardin-cerrado", tall: true },
  { id: 7, title: "Capas de Óxido", category: "Óleo", size: "60x90 cm — Sin Marco", price: "$124.000", seed: "capas-oxido" },
  { id: 8, title: "Arena en Reposo", category: "Textura Minimalista", size: "80x80 cm — Marco Flotante", price: "$89.000", seed: "arena-reposo" },
  { id: 9, title: "Corriente Índigo", category: "Abstracto", size: "110x140 cm — Marco de Roble", price: "$198.000", seed: "corriente-indigo", tall: true },
  { id: 10, title: "Hoja de Musgo", category: "Botánico", size: "50x70 cm — Marco de Nogal", price: "$72.000", seed: "hoja-musgo" },
  { id: 11, title: "Pigmento Crudo", category: "Óleo", size: "100x130 cm — Sin Marco", price: "$220.000", seed: "pigmento-crudo", tall: true },
  { id: 12, title: "Piedra Pulida", category: "Textura Minimalista", size: "60x60 cm — Marco Flotante", price: "$64.000", seed: "piedra-pulida" },
];

const WHATSAPP_NUMBER = "5492645059194";

const state = {
  activeCategory: "Todos",
  openChat: false,
  loaded: false
};

function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function placeholderArt(seed, w = 700, h = 900) {
  const hue1 = hashSeed(seed) % 360;
  const hue2 = (hue1 + 35) % 360;
  const hue3 = (hue1 + 200) % 360;
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}'>
      <rect width='100%' height='100%' fill='hsl(${hue1},22%,90%)'/>
      <circle cx='${w * 0.28}' cy='${h * 0.32}' r='${w * 0.42}' fill='hsl(${hue2},40%,74%)' opacity='0.6'/>
      <circle cx='${w * 0.78}' cy='${h * 0.68}' r='${w * 0.36}' fill='hsl(${hue3},35%,66%)' opacity='0.55'/>
      <circle cx='${w * 0.55}' cy='${h * 0.5}' r='${w * 0.22}' fill='hsl(${hue1},30%,80%)' opacity='0.5'/>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function buildWhatsAppUrl(text = "") {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const base = isMobile ? `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}` : `https://wa.me/${WHATSAPP_NUMBER}`;
  if (!text) return base;
  const encodedText = encodeURIComponent(text);
  return isMobile ? `${base}&text=${encodedText}` : `${base}?text=${encodedText}`;
}

function openWhatsApp(text = "Hola! Vi la galería online y quisiera hacer una consulta.") {
  const url = buildWhatsAppUrl(text);
  try {
    const popup = window.open(url, "_blank", "noopener,noreferrer");
    if (!popup) {
      window.location.href = url;
      return;
    }
    popup.opener = null;
  } catch (error) {
    window.location.href = url;
  }
}

function whatsappIcon(size = 24) {
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.91-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.87 1.21 3.07c.15.2 2.09 3.2 5.07 4.48.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.34z"></path>
      <path d="M12.02 2C6.5 2 2.02 6.48 2.02 12c0 1.85.5 3.58 1.36 5.07L2 22l5.08-1.33A9.94 9.94 0 0012.02 22C17.55 22 22 17.52 22 12S17.55 2 12.02 2zm0 18.13c-1.66 0-3.2-.46-4.52-1.25l-.32-.19-3.02.79.81-2.94-.21-.31A8.11 8.11 0 013.9 12c0-4.48 3.65-8.13 8.12-8.13S20.14 7.52 20.14 12s-3.65 8.13-8.12 8.13z"></path>
    </svg>
  `;
}

function getFilteredArtworks() {
  return state.activeCategory === "Todos"
    ? ARTWORKS
    : ARTWORKS.filter((art) => art.category === state.activeCategory);
}

function renderArtCard(art, index) {
  const fallbackArt = placeholderArt(art.seed, 700, art.tall ? 900 : 700);
  const waMessage = `Hola, me interesa la obra "${art.title}" (${art.size}). ¿Me pasás precio y disponibilidad?`;
  return `
    <article class="art-card ${art.tall ? "art-card--tall" : ""}" style="animation-delay: ${(index % 6) * 90}ms;">
      <div class="art-card__media">
        <div class="art-card__frame" data-tilt="${index}">
          <img src="${art.image || fallbackArt}" alt="${art.title}" class="art-card__img art-card__img--loaded" loading="lazy" data-fallback="${fallbackArt}" />
          <div class="art-card__sheen"></div>
        </div>
        <button class="art-card__quick-wa" type="button" aria-label="Consultar por ${art.title} vía WhatsApp" data-wa-message="${waMessage}">
          ${whatsappIcon(17)}
        </button>
      </div>
      <div class="art-card__info">
        <h3>${art.title}</h3>
        <p class="art-card__size">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2 8h20M7 4v16m10-16v16M2 16h20" stroke-linecap="round" stroke-linejoin="round"/></svg>
          ${art.size}
        </p>
        <p class="art-card__price">${art.price}</p>
      </div>
    </article>
  `;
}

function renderChatWidget() {
  return `
    <div class="chat-widget">
      <div class="chat-widget__panel ${state.openChat ? "chat-widget__panel--open" : ""}">
        <div class="chat-widget__header">
          <div class="chat-widget__avatar">
            ${whatsappIcon(20)}
          </div>
          <div>
            <p class="chat-widget__name">Atención de Galería</p>
            <p class="chat-widget__status">En línea · responde rápido</p>
          </div>
          <button class="chat-widget__close" type="button" aria-label="Cerrar chat" data-chat-close="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke-linecap="round"/></svg>
          </button>
        </div>
        <div class="chat-widget__body">
          <div class="chat-widget__bubble">
            Hola 👋 Gracias por visitar la galería. Contanos qué obra te interesó, su tamaño ideal o el ambiente que querés decorar, y te ayudamos a elegir la pieza correcta.
          </div>
        </div>
        <button class="chat-widget__cta" type="button" data-chat-cta="true">
          ${whatsappIcon(16)}
          Continuar por WhatsApp
        </button>
      </div>

      <button class="chat-widget__bubble-btn ${state.openChat ? "chat-widget__bubble-btn--active" : ""}" type="button" aria-label="Abrir chat de WhatsApp" data-chat-toggle="true">
        <span class="chat-widget__pulse"></span>
        ${state.openChat ? '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke-linecap="round"/></svg>' : whatsappIcon(28)}
      </button>
    </div>
  `;
}

function renderApp() {
  const heroImage = placeholderArt("hero-fifi", 900, 1100);
  const filtered = getFilteredArtworks();

  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="gallery-root">
      <div class="paint-layer">
        <div class="blob blob--1"></div>
        <div class="blob blob--2"></div>
        <div class="blob blob--3"></div>
      </div>

      <div class="content">
        <nav class="nav">
          <div class="nav__mark">FIFI — Galería de Arte</div>
        </nav>

        <header class="hero">
          <div class="hero-anim ${state.loaded ? "hero-anim--in" : ""}">
            <p class="hero__eyebrow-free">Cuadros para vestir tus paredes</p>
            <h1 class="hero__title">FIFI</h1>
            <div class="hero__stroke"></div>
            <p class="hero__desc">
              Piezas originales y de edición limitada, elegidas para transformar un muro en el
              punto de partida de un ambiente. Consultá por WhatsApp las opciones de enmarcado
              para cada obra.
            </p>
          </div>

          <div class="hero-anim ${state.loaded ? "hero-anim--in" : ""} hero__visual" style="transition-delay: 150ms;">
            <div class="hero__visual-frame"></div>
            <img src="${heroImage}" alt="Obra destacada de la galería" />
          </div>
        </header>

        <div class="filters">
          ${CATEGORIES.map((category) => `
            <button
              type="button"
              class="filter-btn ${state.activeCategory === category ? "filter-btn--active" : ""}"
              data-category="${category}"
            >
              ${category}
            </button>
          `).join("")}
        </div>

        <div class="art-grid">
          ${filtered.map(renderArtCard).join("")}
        </div>

        <footer class="footer">
          <span>FIFI — San Juan</span>
          <span class="footer__link">Consultas por encargo →</span>
        </footer>
      </div>

      ${renderChatWidget()}
    </div>
  `;

  addCardInteractions();
}

function addCardInteractions() {
  const cardFrames = document.querySelectorAll(".art-card__frame");
  cardFrames.forEach((frame) => {
    frame.addEventListener("mousemove", (event) => {
      const rect = frame.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      const tiltX = py * -10;
      const tiltY = px * 12;
      frame.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
    });

    frame.addEventListener("mouseleave", () => {
      frame.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
    });
  });

  document.querySelectorAll(".art-card__quick-wa").forEach((button) => {
    button.addEventListener("click", () => {
      openWhatsApp(button.dataset.waMessage);
    });
  });

  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeCategory = button.dataset.category;
      renderApp();
    });
  });

  document.querySelector('[data-chat-toggle="true"]')?.addEventListener("click", () => {
    state.openChat = !state.openChat;
    renderApp();
  });

  document.querySelector('[data-chat-close="true"]')?.addEventListener("click", () => {
    state.openChat = false;
    renderApp();
  });

  document.querySelector('[data-chat-cta="true"]')?.addEventListener("click", () => {
    openWhatsApp("Hola! Vi la galería online y quisiera hacer una consulta.");
  });

  document.querySelectorAll(".art-card__img").forEach((img) => {
    img.addEventListener("error", function () {
      const fallback = this.dataset.fallback;
      if (this.src !== fallback) {
        this.src = fallback;
      }
    });
    img.addEventListener("load", function () {
      this.classList.add("art-card__img--loaded");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.title = "FIFI | Galería de Arte";
  state.loaded = true;
  renderApp();
});
