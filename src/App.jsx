import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { MessageCircle, X, Send, ArrowUpRight, Ruler } from "lucide-react";

const CATEGORIES = ["Todos", "Abstracto", "Botánico", "Óleo", "Textura Minimalista"];

function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function placeholderArt(seed, w = 700, h = 900) {
  const hue1 = hashSeed(seed) % 360;
  const hue2 = (hue1 + 35) % 360;
  const hue3 = (hue1 + 200) % 360;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}'>
    <rect width='100%' height='100%' fill='hsl(${hue1},22%,90%)'/>
    <circle cx='${w * 0.28}' cy='${h * 0.32}' r='${w * 0.42}' fill='hsl(${hue2},40%,74%)' opacity='0.6'/>
    <circle cx='${w * 0.78}' cy='${h * 0.68}' r='${w * 0.36}' fill='hsl(${hue3},35%,66%)' opacity='0.55'/>
    <circle cx='${w * 0.55}' cy='${h * 0.5}' r='${w * 0.22}' fill='hsl(${hue1},30%,80%)' opacity='0.5'/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

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

function buildWhatsAppUrl(text = "") {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  const baseUrl = isMobile
    ? `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}`
    : `https://wa.me/${WHATSAPP_NUMBER}`;

  if (!text) return baseUrl;

  const encodedText = encodeURIComponent(text);
  return isMobile ? `${baseUrl}&text=${encodedText}` : `${baseUrl}?text=${encodedText}`;
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
    return;
  } catch (error) {
    window.location.href = url;
  }
}

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const fallback = setTimeout(() => setVisible(true), 1200);

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          clearTimeout(fallback);
          obs.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -10% 0px" }
    );
    obs.observe(node);
    return () => {
      obs.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return [ref, visible];
}

function ArtCard({ art, index }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const applyTiltFromPoint = useCallback((clientX, clientY) => {
    const node = cardRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const px = (clientX - rect.left) / rect.width - 0.5;
    const py = (clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -10, y: px * 12 });
  }, []);

  const handleMove = useCallback(
    (e) => applyTiltFromPoint(e.clientX, e.clientY),
    [applyTiltFromPoint]
  );

  const handleTouchStart = useCallback(
    (e) => {
      setHovered(true);
      const t = e.touches[0];
      if (t) applyTiltFromPoint(t.clientX, t.clientY);
    },
    [applyTiltFromPoint]
  );

  const handleTouchMove = useCallback(
    (e) => {
      const t = e.touches[0];
      if (t) applyTiltFromPoint(t.clientX, t.clientY);
    },
    [applyTiltFromPoint]
  );

  const reset = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  }, []);

  const fallbackArt = useMemo(
    () => placeholderArt(art.seed, 700, art.tall ? 900 : 700),
    [art.seed, art.tall]
  );

  const handleImageError = useCallback(
    (event) => {
      if (event.currentTarget.src !== fallbackArt) {
        event.currentTarget.src = fallbackArt;
      }
    },
    [fallbackArt]
  );

  const waMessage = `Hola, me interesa la obra "${art.title}" (${art.size}). ¿Me pasás precio y disponibilidad?`;

  return (
    <div
      className={`art-card ${art.tall ? "art-card--tall" : ""}`}
      style={{ animationDelay: `${(index % 6) * 90}ms` }}
    >
      <div className="art-card__media">
        <div
          ref={cardRef}
          className="art-card__frame"
          onMouseMove={handleMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={reset}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={reset}
          onTouchCancel={reset}
          style={{
            transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.02 : 1})`,
          }}
        >
          <img
            src={art.image || fallbackArt}
            alt={art.title}
            className={`art-card__img ${imgLoaded ? "art-card__img--loaded" : ""}`}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={handleImageError}
          />
          <div className="art-card__sheen" style={{ opacity: hovered ? 1 : 0 }} />
        </div>

        <a
          href={buildWhatsAppUrl(waMessage)}
          target="_blank"
          rel="noreferrer noopener"
          onClick={(e) => {
            e.preventDefault();
            openWhatsApp(waMessage);
          }}
          className="art-card__quick-wa"
          aria-label={`Consultar por ${art.title} vía WhatsApp`}
        >
          <WhatsAppIcon size={17} />
        </a>
      </div>

      <div className="art-card__info">
        <h3>{art.title}</h3>
        <p className="art-card__size">
          <Ruler size={13} strokeWidth={1.6} />
          {art.size}
        </p>
        <p className="art-card__price">{art.price}</p>
      </div>
    </div>
  );
}

function WhatsAppIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.91-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.87 1.21 3.07c.15.2 2.09 3.2 5.07 4.48.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.34z" />
      <path d="M12.02 2C6.5 2 2.02 6.48 2.02 12c0 1.85.5 3.58 1.36 5.07L2 22l5.08-1.33A9.94 9.94 0 0012.02 22C17.55 22 22 17.52 22 12S17.55 2 12.02 2zm0 18.13c-1.66 0-3.2-.46-4.52-1.25l-.32-.19-3.02.79.81-2.94-.21-.31A8.11 8.11 0 013.9 12c0-4.48 3.65-8.13 8.12-8.13S20.14 7.52 20.14 12s-3.65 8.13-8.12 8.13z" />
    </svg>
  );
}

function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="chat-widget">
      <div className={`chat-widget__panel ${open ? "chat-widget__panel--open" : ""}`}>
        <div className="chat-widget__header">
          <div className="chat-widget__avatar">
            <WhatsAppIcon size={20} />
          </div>
          <div>
            <p className="chat-widget__name">Atención de Galería</p>
            <p className="chat-widget__status">En línea · responde rápido</p>
          </div>
          <button
            className="chat-widget__close"
            onClick={() => setOpen(false)}
            aria-label="Cerrar chat"
          >
            <X size={18} />
          </button>
        </div>
        <div className="chat-widget__body">
          <div className="chat-widget__bubble">
            Hola 👋 Gracias por visitar la galería. Contanos qué obra te interesó, su tamaño ideal
            o el ambiente que querés decorar, y te ayudamos a elegir la pieza correcta.
          </div>
        </div>
        <button
          className="chat-widget__cta"
          onClick={() => openWhatsApp("Hola! Vi la galería online y quisiera hacer una consulta.")}
        >
          <Send size={16} />
          Continuar por WhatsApp
        </button>
      </div>

      <button
        className={`chat-widget__bubble-btn ${open ? "chat-widget__bubble-btn--active" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Abrir chat de WhatsApp"
      >
        <span className="chat-widget__pulse" />
        {open ? <X size={26} /> : <WhatsAppIcon size={28} />}
      </button>
    </div>
  );
}

function Reveal({ children, className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={`reveal ${visible ? "reveal--in" : ""} ${className}`}>
      {children}
    </div>
  );
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    document.title = "FIFI | Galería de Arte";
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  const heroImage = useMemo(() => placeholderArt("hero-fifi", 900, 1100), []);

  const filtered = useMemo(
    () =>
      activeCategory === "Todos"
        ? ARTWORKS
        : ARTWORKS.filter((a) => a.category === activeCategory),
    [activeCategory]
  );

  const handleCategoryClick = useCallback((category) => setActiveCategory(category), []);

  return (
    <div className="gallery-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Work+Sans:wght@300;400;500;600&display=swap');

        .gallery-root {
          --ivory: #f3ede3;
          --sand: #e8dcc8;
          --graphite: #2a2824;
          --ochre: #a8703c;
          --sage: #5b6350;
          --canvas-white: #fffdf9;
          font-family: 'Work Sans', sans-serif;
          background: var(--ivory);
          color: var(--graphite);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }
        .gallery-root * { box-sizing: border-box; }
        .gallery-root h1, .gallery-root h2, .gallery-root h3 {
          font-family: 'Fraunces', serif;
          margin: 0;
          font-weight: 500;
        }

        .paint-layer {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .blob {
          position: absolute;
          filter: blur(50px);
          opacity: 0.35;
          mix-blend-mode: multiply;
        }
        .blob--1 { top: -8%; right: -10%; width: 46vw; height: 46vw; background: radial-gradient(circle at 30% 30%, var(--ochre), transparent 70%); }
        .blob--2 { bottom: 5%; left: -12%; width: 38vw; height: 38vw; background: radial-gradient(circle at 60% 40%, var(--sage), transparent 70%); }
        .blob--3 { top: 40%; left: 45%; width: 26vw; height: 26vw; background: radial-gradient(circle at 50% 50%, var(--sand), transparent 75%); opacity: 0.5; }

        .content { position: relative; z-index: 1; }

        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 22px 6vw;
        }
        .nav__mark {
          font-family: 'Fraunces', serif;
          font-size: 1.15rem;
          letter-spacing: 0.02em;
        }
        .nav__mark span { color: var(--ochre); }
        @media (max-width: 480px) {
          .nav { padding: 18px 5vw; }
          .nav__mark { font-size: 0.95rem; }
        }

        .hero {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 3rem;
          align-items: center;
          padding: 4vh 6vw 8vh;
          min-height: 72vh;
        }
        @media (max-width: 860px) {
          .hero {
            grid-template-columns: 1fr;
            padding: 3vh 6vw 5vh;
            min-height: auto;
            gap: 2.2rem;
          }
        }
        @media (max-width: 480px) {
          .hero { padding: 2.2vh 5vw 4vh; }
          .hero__visual { aspect-ratio: 4/4.6; }
        }
        .hero__eyebrow-free { color: var(--sage); font-size: 0.95rem; margin-bottom: 1rem; }
        .hero__title {
          font-size: clamp(3rem, 6.5vw, 5rem);
          line-height: 1.15;
          letter-spacing: 0.01em;
          font-style: italic;
          font-optical-sizing: auto;
          color: var(--graphite);
        }
        .hero__desc {
          margin-top: 1.6rem;
          font-size: 1.05rem;
          line-height: 1.6;
          max-width: 46ch;
          color: #4a473f;
        }
        @media (max-width: 480px) {
          .hero__desc { font-size: 0.98rem; margin-top: 1.2rem; }
        }
        .hero__stroke {
          position: relative;
          height: 5px;
          width: 90px;
          margin: 0.7rem 0 0;
          background: var(--ochre);
          border-radius: 3px;
          transform-origin: left;
          animation: strokeGrow 1.1s cubic-bezier(.22,1,.36,1) 0.3s both;
        }
        @keyframes strokeGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }

        .hero__visual {
          position: relative;
          aspect-ratio: 4/5;
          border-radius: 3px;
        }
        .hero__visual img {
          display: block;
          width: 100%; height: 100%; object-fit: cover;
          border-radius: 3px;
          box-shadow: 0 30px 60px -20px rgba(42,40,36,0.35);
        }
        .hero__visual-frame {
          position: absolute;
          inset: 0;
          border: 1.5px solid rgba(255,253,249,0.55);
          border-radius: 3px;
          pointer-events: none;
        }

        .hero-anim { opacity: 0; transform: translateY(22px); transition: opacity .9s ease, transform .9s cubic-bezier(.22,1,.36,1); }
        .hero-anim--in { opacity: 1; transform: translateY(0); }

        .reveal { opacity: 0; transform: translateY(26px); transition: opacity .8s ease, transform .8s cubic-bezier(.22,1,.36,1); }
        .reveal--in { opacity: 1; transform: translateY(0); }

        .filters {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          padding: 0 6vw 2.4rem;
        }
        .filter-btn {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(42,40,36,0.25);
          background: transparent;
          color: var(--graphite);
          padding: 0.6rem 1.3rem;
          border-radius: 999px;
          font-family: 'Work Sans', sans-serif;
          font-size: 0.92rem;
          cursor: pointer;
          transition: color .45s ease, border-color .45s ease;
          z-index: 0;
          touch-action: manipulation;
        }
        .filter-btn:focus-visible,
        .chat-widget__bubble-btn:focus-visible,
        .chat-widget__cta:focus-visible,
        .art-card__quick-wa:focus-visible {
          outline: 2px solid rgba(168,112,60,0.8);
          outline-offset: 2px;
        }
        @media (max-width: 480px) {
          .filters { padding: 0 5vw 2rem; gap: 0.5rem; }
          .filter-btn { padding: 0.6rem 1.05rem; font-size: 0.85rem; }
        }
        .filter-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--graphite);
          border-radius: 50% ;
          transform: scale(0);
          transform-origin: center;
          transition: transform .5s cubic-bezier(.22,1,.36,1);
          z-index: -1;
        }
        .filter-btn:hover::before { transform: scale(2.2); border-radius: 0; }
        .filter-btn:hover { color: var(--canvas-white); border-color: var(--graphite); }
        .filter-btn--active { background: var(--graphite); color: var(--canvas-white); border-color: var(--graphite); }
        .filter-btn--active::before { display: none; }

        .art-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 2rem 1.6rem;
          padding: 0 6vw 8vh;
        }
        @media (max-width: 480px) {
          .art-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 1.6rem 1rem;
            padding: 0 5vw 6vh;
          }
        }
        .art-card {
          animation: cardIn .7s cubic-bezier(.22,1,.36,1) both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .art-card__media { position: relative; }
        .art-card__frame {
          position: relative;
          border-radius: 3px;
          overflow: hidden;
          aspect-ratio: 4/5;
          box-shadow: 0 14px 30px -14px rgba(42,40,36,0.28);
          transition: transform .25s ease-out, box-shadow .3s ease;
          will-change: transform;
        }
        .art-card--tall .art-card__frame { aspect-ratio: 4/5.4; }
        .art-card__frame:hover { box-shadow: 0 26px 46px -16px rgba(42,40,36,0.4); }
        .art-card__img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform .5s ease, opacity .7s ease, filter .7s ease;
          filter: saturate(0.94) contrast(1.02) blur(8px);
          opacity: 0;
          transform: scale(1.08);
        }
        .art-card__img--loaded {
          opacity: 1;
          filter: saturate(0.94) contrast(1.02) blur(0);
          transform: scale(1);
        }
        .art-card__frame:hover .art-card__img--loaded { transform: scale(1.09); }
        .art-card__sheen {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.16), transparent 55%);
          transition: opacity .3s ease;
          pointer-events: none;
        }
        .art-card__quick-wa {
          position: absolute;
          bottom: 12px; right: 12px;
          width: 40px; height: 40px;
          border-radius: 50%;
          background: rgba(255,253,249,0.95);
          color: #3d8f5b;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 6px 16px rgba(0,0,0,0.22);
          z-index: 2;
          transition: transform .25s ease, box-shadow .25s ease;
          touch-action: manipulation;
        }
        .art-card__quick-wa:hover,
        .art-card__quick-wa:active {
          transform: scale(1.08);
          box-shadow: 0 8px 20px rgba(0,0,0,0.28);
        }
        .art-card__info { padding-top: 0.85rem; }
        .art-card__info h3 { font-size: 1.05rem; font-weight: 500; }
        .art-card__size {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.82rem; color: #6b675d; margin: 0.35rem 0;
        }
        .art-card__price { font-size: 0.92rem; color: var(--ochre); margin: 0; }

        .chat-widget {
          position: fixed;
          bottom: calc(20px + env(safe-area-inset-bottom, 0px));
          right: calc(20px + env(safe-area-inset-right, 0px));
          z-index: 40;
          display: flex; flex-direction: column; align-items: flex-end; gap: 14px;
          max-width: calc(100vw - 40px);
        }
        .chat-widget__bubble-btn {
          position: relative;
          width: 56px; height: 56px;
          border-radius: 50%;
          border: none;
          background: #3d8f5b;
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 10px 26px rgba(61,143,91,0.45);
          cursor: pointer;
          animation: floatY 3.4s ease-in-out infinite;
          transition: background .3s ease;
          touch-action: manipulation;
          flex-shrink: 0;
        }
        .chat-widget__bubble-btn--active { background: var(--graphite); animation: none; }
        @keyframes floatY { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .chat-widget__pulse {
          position: absolute; inset: -6px;
          border-radius: 50%;
          border: 2px solid rgba(61,143,91,0.5);
          animation: pulseRing 2.2s ease-out infinite;
        }
        @keyframes pulseRing { 0% { transform: scale(0.85); opacity: 0.8; } 100% { transform: scale(1.5); opacity: 0; } }

        .chat-widget__panel {
          width: min(300px, calc(100vw - 40px));
          background: var(--canvas-white);
          border-radius: 16px;
          box-shadow: 0 24px 60px -14px rgba(42,40,36,0.35);
          overflow: hidden;
          transform-origin: bottom right;
          transform: scale(0.85) translateY(12px);
          opacity: 0;
          pointer-events: none;
          transition: transform .38s cubic-bezier(.34,1.56,.64,1), opacity .28s ease;
        }
        .chat-widget__panel--open { transform: scale(1) translateY(0); opacity: 1; pointer-events: auto; }
        .chat-widget__header {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 14px;
          background: var(--graphite);
          color: var(--ivory);
        }
        .chat-widget__avatar {
          width: 34px; height: 34px; border-radius: 50%;
          background: #3d8f5b; color: #fff;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .chat-widget__name { margin: 0; font-size: 0.9rem; font-weight: 500; }
        .chat-widget__status { margin: 0; font-size: 0.72rem; opacity: 0.7; }
        .chat-widget__close {
          margin-left: auto; background: none; border: none; color: var(--ivory);
          cursor: pointer; opacity: 0.7; padding: 4px;
        }
        .chat-widget__close:hover { opacity: 1; }
        .chat-widget__body { padding: 16px 14px; background: #faf7f1; }
        .chat-widget__bubble {
          background: #fff; border-radius: 12px; padding: 12px 14px;
          font-size: 0.86rem; line-height: 1.5; color: #4a473f;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }
        .chat-widget__cta {
          width: 100%; border: none; background: #3d8f5b; color: #fff;
          padding: 13px; font-size: 0.9rem; font-weight: 500;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          cursor: pointer; transition: background .25s ease;
        }
        .chat-widget__cta:hover { background: #347a4c; }

        .footer {
          padding: 3rem 6vw 4rem;
          display: flex; justify-content: space-between; align-items: center;
          border-top: 1px solid rgba(42,40,36,0.12);
          font-size: 0.85rem; color: #6b675d;
        }
        @media (max-width: 640px) { .footer { flex-direction: column; gap: 10px; text-align: center; } }
      `}</style>

      <div className="paint-layer">
        <div className="blob blob--1" />
        <div className="blob blob--2" />
        <div className="blob blob--3" />
      </div>

      <div className="content">
        <nav className="nav">
          <div className="nav__mark">
            FIFI — Galería de Arte
          </div>
        </nav>

        <header className="hero">
          <div className={`hero-anim ${loaded ? "hero-anim--in" : ""}`}>
            <p className="hero__eyebrow-free">Cuadros para vestir tus paredes</p>
            <h1 className="hero__title">FIFI</h1>
            <div className="hero__stroke" />
            <p className="hero__desc">
              Piezas originales y de edición limitada, elegidas para transformar un muro en el
              punto de partida de un ambiente. Consultá por WhatsApp las opciones de enmarcado
              para cada obra.
            </p>
          </div>
          <div
            className={`hero-anim ${loaded ? "hero-anim--in" : ""} hero__visual`}
            style={{ transitionDelay: "150ms" }}
          >
            <div className="hero__visual-frame" />
            <img src={heroImage} alt="Obra destacada de la galería" />
          </div>
        </header>

        <Reveal>
          <div className="filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                aria-pressed={activeCategory === cat}
                className={`filter-btn ${activeCategory === cat ? "filter-btn--active" : ""}`}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="art-grid" key={activeCategory}>
            {filtered.map((art, i) => (
              <ArtCard key={art.id} art={art} index={i} />
            ))}
          </div>
        </Reveal>

        <footer className="footer">
          <span>FIFI — San Juan</span>
          <span className="footer__link">
            Consultas por encargo <ArrowUpRight size={13} style={{ display: "inline", verticalAlign: "-2px" }} />
          </span>
        </footer>
      </div>

      <ChatWidget />
    </div>
  );
}
