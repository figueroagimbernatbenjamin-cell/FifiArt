import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { MessageCircle, X, Send, ArrowUpRight, Ruler } from "lucide-react";
import logoFifi from "./assets/fifi-logo.png";

const CATEGORIES = ["Todos", "Abstracto", "Botánico", "Textura Minimalista"];

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

const REAL_ART_IMAGES = {
  1: new URL("../Cuadro 1.JPG", import.meta.url).href,
  2: new URL("../Cuadro 2.JPG", import.meta.url).href,
  3: new URL("../Cuadro 3.JPG", import.meta.url).href,
  4: new URL("../Cuadro 4.JPG", import.meta.url).href,
  5: new URL("../Cuadro 5.JPG", import.meta.url).href,
  6: new URL("../Cuadro 6 Mejorado.PNG", import.meta.url).href,
  7: new URL("../Cuadro 7 Mejorado.jpg", import.meta.url).href,
  8: new URL("../Cuadro 8.JPG", import.meta.url).href,
  9: new URL("../Cuadro 9.JPG", import.meta.url).href,
  10: new URL("../Cuadro 10.JPG", import.meta.url).href,
  11: new URL("../Cuadro 11.JPG", import.meta.url).href,
  12: new URL("../Cuadro 12.JPG", import.meta.url).href,
  13: new URL("../Cuadro 13.JPG", import.meta.url).href,
  14: new URL("../Cuadro 14.JPG", import.meta.url).href,
};

const ARTWORKS = [
  { id: 1, title: "Cuadro 1", category: "Abstracto", size: "", price: "Vendido", seed: "cuadro-1", tall: true, image: REAL_ART_IMAGES[1], imagePosition: "50% 36%", sold: true },
  { id: 2, title: "Cuadro 2", category: "Botánico", size: "90x80 cm", previousPrice: "$300.000", price: "$250.000", seed: "cuadro-2", image: REAL_ART_IMAGES[2], imagePosition: "50% 52%", sold: false },
  { id: 3, title: "Cuadro 3", category: "Abstracto", size: "", price: "Vendido", seed: "cuadro-3", tall: true, image: REAL_ART_IMAGES[3], imagePosition: "50% 44%", sold: true },
  { id: 4, title: "Cuadro 4", category: "Textura Minimalista", size: "90x70 cm", previousPrice: "$320.000", price: "$280.000", seed: "cuadro-4", image: REAL_ART_IMAGES[4], imagePosition: "50% 50%", sold: false },
  { id: 5, title: "Cuadro 5", category: "Abstracto", size: "1,10 x 90 cm", previousPrice: "$400.000", price: "$350.000", seed: "cuadro-5", image: REAL_ART_IMAGES[5], imagePosition: "50% 52%", sold: false },
  { id: 6, title: "Cuadro 6", category: "Botánico", size: "", price: "Vendido", seed: "cuadro-6", tall: true, image: REAL_ART_IMAGES[6], imagePosition: "50% 38%", sold: true },
  { id: 7, title: "Cuadro 7", category: "Abstracto", size: "", price: "Vendido", seed: "cuadro-7", image: REAL_ART_IMAGES[7], imagePosition: "50% 50%", sold: true },
  { id: 8, title: "Cuadro 8", category: "Textura Minimalista", size: "", price: "Vendido", seed: "cuadro-8", image: REAL_ART_IMAGES[8], imagePosition: "50% 50%", sold: true },
  { id: 9, title: "Cuadro 9", category: "Abstracto", size: "1,30 x 90 cm", price: "Vendido", seed: "cuadro-9", tall: true, image: REAL_ART_IMAGES[9], imagePosition: "50% 40%", sold: true },
  { id: 10, title: "Cuadro 10", category: "Botánico", size: "70x90 cm", previousPrice: "$300.000", price: "$260.000", seed: "cuadro-10", tall: true, image: REAL_ART_IMAGES[10], imagePosition: "50% 48%", sold: false },
  { id: 11, title: "Cuadro 11", category: "Abstracto", size: "", price: "Vendido", seed: "cuadro-11", tall: true, image: REAL_ART_IMAGES[11], imagePosition: "50% 40%", sold: true },
  { id: 12, title: "Cuadro 12", category: "Botánico", size: "50x60 cm", previousPrice: "$300.000", price: "$260.000", seed: "cuadro-12", tall: true, image: REAL_ART_IMAGES[12], imagePosition: "50% 50%", sold: false },
  { id: 13, title: "Cuadro 13", category: "Abstracto", size: "50x65 cm", previousPrice: "$230.000", price: "$200.000", seed: "cuadro-13", tall: true, image: REAL_ART_IMAGES[13], imagePosition: "50% 50%", sold: false },
  { id: 14, title: "Cuadro 14", category: "Abstracto", size: "60x90 cm", previousPrice: "$310.000", price: "$280.000", seed: "cuadro-14", image: REAL_ART_IMAGES[14], imagePosition: "50% 50%", sold: false },
];

const WHATSAPP_NUMBER = "5492645059194";

function buildWhatsAppUrl(text = "") {
  const query = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${WHATSAPP_NUMBER}${query}`;
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

function ArtCard({ art, index, onCategoryClick, onImageClick }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const applyTiltFromPoint = useCallback((clientX, clientY) => {
    const node = cardRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const px = (clientX - rect.left) / rect.width - 0.5;
    const py = (clientY - rect.top) / rect.height - 0.5;
    const originX = ((clientX - rect.left) / rect.width) * 100;
    const originY = ((clientY - rect.top) / rect.height) * 100;
    setTilt({ x: py * -10, y: px * 12 });
    setZoomOrigin({ x: Math.min(100, Math.max(0, originX)), y: Math.min(100, Math.max(0, originY)) });
  }, []);

  const handleMove = useCallback(
    (e) => applyTiltFromPoint(e.clientX, e.clientY),
    [applyTiltFromPoint]
  );

  const handleTouchStart = useCallback(() => setHovered(true), []);

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

  const waMessage = art.sold
    ? `Hola, me interesa algo parecido al cuadro "${art.title}"${art.size ? ` (${art.size})` : ""}. ¿Podés recomendarme una obra similar o sugerirme alguna opción en ese estilo?`
    : `Hola, me interesa la obra "${art.title}" (${art.size}). ¿Me pasás precio y disponibilidad?`;

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
          onTouchEnd={reset}
          onTouchCancel={reset}
          onClick={() => onImageClick(art)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onImageClick(art);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={`Ampliar imagen de ${art.title}`}
          style={{
            transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.02 : 1})`,
            transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
          }}
        >
          <img
            src={art.image || fallbackArt}
            alt={art.title}
            className={`art-card__img ${imgLoaded ? "art-card__img--loaded" : ""}`}
            loading="lazy"
            style={{
              objectFit: "cover",
              objectPosition: art.imagePosition || "center center",
              background: "#efe9df",
            }}
            onLoad={() => setImgLoaded(true)}
            onError={handleImageError}
          />
          <div className="art-card__sheen" style={{ opacity: hovered ? 1 : 0 }} />
        </div>

        <a
          href={buildWhatsAppUrl(waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="art-card__quick-wa"
          aria-label={`Consultar por ${art.title} vía WhatsApp`}
        >
          <WhatsAppIcon size={17} />
        </a>
      </div>

      <div className="art-card__info">
        <h3>{art.title}</h3>
        <button
          type="button"
          className="art-card__category"
          aria-label={`Ver obras de la categoría ${art.category}`}
          onClick={() => onCategoryClick(art.category)}
        >
          {art.category}
        </button>
        {art.size && (
          <p className="art-card__size">
            <Ruler size={13} strokeWidth={1.6} />
            {art.size}
          </p>
        )}
        {art.sold ? (
          <p className="art-card__price">Vendido</p>
        ) : (
          <p className="art-card__price">
            {art.previousPrice && (
              <span className="art-card__previous-price">
                Antes: <del>{art.previousPrice}</del>
              </span>
            )}
            <span className="art-card__current-price">{art.price}</span>
          </p>
        )}
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
        <a
          href={buildWhatsAppUrl("Hola! Vi la galería online y quisiera hacer una consulta.")}
          target="_blank"
          rel="noopener noreferrer"
          className="chat-widget__cta"
        >
          <Send size={16} />
          Continuar por WhatsApp
        </a>
      </div>

      <button
        className={`chat-widget__bubble-btn ${open ? "chat-widget__bubble-btn--active" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar chat de WhatsApp" : "Abrir chat de WhatsApp"}
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
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const zoomCloseRef = useRef(null);

  useEffect(() => {
    document.title = "FIFI | Galería de Arte";
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!selectedArtwork) return;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = "hidden";
    zoomCloseRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSelectedArtwork(null);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedArtwork]);

  const featuredWorks = ARTWORKS.slice(-3);

  const filtered = useMemo(
    () =>
      activeCategory === "Todos"
        ? ARTWORKS
        : ARTWORKS.filter((a) => a.category === activeCategory),
    [activeCategory]
  );

  const handleCategoryClick = useCallback((category) => setActiveCategory(category), []);
  const handleImageClick = useCallback((art) => setSelectedArtwork(art), []);

  const scrollToGallery = useCallback(() => {
    const gallery = document.getElementById("galeria");
    if (gallery) {
      gallery.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

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
          .gallery-root {
            -webkit-tap-highlight-color: transparent;
            -webkit-user-select: none;
            user-select: none;
          }
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
          gap: 1rem;
        }
        .nav__mark {
          font-family: 'Fraunces', serif;
          font-size: 1.15rem;
          letter-spacing: 0.02em;
        }
        .nav__mark span { color: var(--ochre); }
        .nav__actions {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        .nav__button {
          appearance: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(42,40,36,0.2);
          background: rgba(255,255,255,0.35);
          color: var(--graphite);
          border-radius: 999px;
          padding: 0.7rem 1.1rem;
          font-family: 'Work Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: transform .2s ease, background .2s ease, color .2s ease, border-color .2s ease;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          text-decoration: none;
        }
        .nav__button:hover,
        .nav__button:active {
          transform: translateY(-1px);
        }
        .nav__button--primary {
          background: #3d8f5b;
          border-color: #3d8f5b;
          color: white;
          box-shadow: 0 8px 20px rgba(61,143,91,0.25);
        }
        .nav__button--primary:hover,
        .nav__button--primary:active {
          background: #347a4c;
        }
        .nav__button--ghost {
          background: rgba(255,255,255,0.3);
        }
        @media (max-width: 480px) {
          .nav {
            padding: 18px 5vw;
            flex-direction: column;
            align-items: flex-start;
          }
          .nav__mark { font-size: 0.95rem; }
          .nav__actions {
            width: 100%;
            justify-content: space-between;
            gap: 0.45rem;
          }
          .nav__button {
            flex: 1 1 0;
            padding: 0.62rem 0.9rem;
            font-size: 0.78rem;
            min-height: 42px;
          }
        }

        .hero {
          display: grid;
          grid-template-columns: minmax(260px, 0.8fr) minmax(0, 1.2fr);
          gap: clamp(2rem, 5vw, 5rem);
          align-items: center;
          padding: 3vh 6vw 6vh;
          min-height: min(780px, calc(100vh - 76px));
        }
        @media (max-width: 760px) {
          .hero {
            grid-template-columns: 1fr;
            padding: 3vh 6vw 5vh;
            min-height: auto;
            gap: 1.8rem;
          }
        }
        @media (max-width: 480px) {
          .hero {
            padding: 1.6vh 5vw 3vh;
            gap: 1.2rem;
          }
          .hero__portfolio {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 0.8rem;
          }
          .hero__eyebrow-free {
            margin-bottom: 0.5rem;
            font-size: 0.8rem;
          }
          .hero__title {
            font-size: clamp(2.4rem, 13vw, 3.5rem);
          }
          .hero__desc {
            margin-top: 1rem;
            font-size: 0.94rem;
          }
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
        .hero__logo {
          display: block;
          height: 1em;
          width: auto;
          max-width: 100%;
          object-fit: contain;
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

        .hero__portfolio {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          align-items: start;
          gap: 1rem;
        }
        .hero__cta {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          margin-top: 1.7rem;
          padding: 0.8rem 1.1rem;
          border: 0;
          background: #3d8f5b;
          color: white;
          font: 500 0.9rem 'Work Sans', sans-serif;
          cursor: pointer;
          transition: background .2s ease, transform .2s ease;
        }
        .hero__cta:hover { background: #347a4c; transform: translateY(-2px); }
        .hero__meta {
          margin-top: 1rem;
          color: var(--sage);
          font-size: 0.82rem;
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
          -webkit-tap-highlight-color: transparent;
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
          .filter-btn {
            padding: 0.6rem 1.05rem;
            font-size: 0.85rem;
            min-height: 42px;
          }
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
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 1.2rem 0.8rem;
            padding: 0 5vw 6vh;
          }
          .art-card__info h3 {
            font-size: 0.95rem;
          }
          .art-card__size,
          .art-card__price {
            font-size: 0.75rem;
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
          border-radius: 12px;
          overflow: hidden;
          touch-action: pan-y;
          aspect-ratio: 4/5;
          padding: 10px;
          background: linear-gradient(145deg, rgba(255,255,255,0.38), rgba(106,92,72,0.12));
          border: 1px solid rgba(42,40,36,0.08);
          box-shadow: 0 18px 36px -18px rgba(42,40,36,0.32), inset 0 0 0 1px rgba(255,255,255,0.3);
          transition: transform .25s ease-out, box-shadow .3s ease;
          will-change: transform;
          cursor: zoom-in;
        }
        .art-card__frame:focus-visible {
          outline: 2px solid rgba(168,112,60,0.8);
          outline-offset: 3px;
        }
        .art-card--tall .art-card__frame { aspect-ratio: 4/5.4; }
        .art-card__frame:hover { box-shadow: 0 30px 52px -20px rgba(42,40,36,0.42), inset 0 0 0 1px rgba(255,255,255,0.35); }
        .art-card__frame::after {
          content: "";
          position: absolute;
          inset: 10px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.4);
          pointer-events: none;
          box-shadow: inset 0 0 0 1px rgba(40,33,27,0.06);
        }
        .art-card__img {
          width: 100%; height: 100%;
          display: block;
          object-fit: cover;
          object-position: center;
          border-radius: 8px;
          border: none;
          padding: 0;
          transition: transform .55s ease, opacity .7s ease, filter .7s ease;
          filter: saturate(1.04) contrast(1.08) blur(0);
          opacity: 0;
          transform: scale(1.04);
          background: #efe9df !important;
          box-shadow: inset 0 0 0 1px rgba(42,40,36,0.04);
        }
        .art-card__img--loaded {
          opacity: 1;
          filter: saturate(0.96) contrast(1.02) blur(0);
          transform: scale(1.04);
        }
        .art-card__frame:hover .art-card__img--loaded { transform: scale(1.12); }
        .artwork-zoom {
          --graphite: #2a2824;
          position: fixed;
          inset: 0;
          z-index: 100;
          display: grid;
          place-items: center;
          padding: 24px;
          background: rgba(30,29,27,0.36);
          -webkit-backdrop-filter: blur(12px) saturate(0.82);
          backdrop-filter: blur(12px) saturate(0.82);
          animation: artworkZoomBackdrop .28s ease both;
        }
        .artwork-zoom__panel {
          position: relative;
          width: fit-content;
          max-width: min(88vw, 720px);
          max-height: 88vh;
          padding: 12px;
          border: 1px solid rgba(255,255,255,0.62);
          border-radius: 22px;
          background: rgba(255,253,249,0.94);
          box-shadow: 0 32px 100px rgba(25,23,20,0.3), 0 8px 24px rgba(25,23,20,0.12);
          animation: artworkZoomIn .42s cubic-bezier(.22,1,.36,1) both;
        }
        .artwork-zoom__image {
          display: block;
          width: min(82vw, 640px);
          height: min(78vh, 800px);
          object-fit: contain;
          object-position: center;
          border-radius: 14px;
          background: #eee8de;
        }
        .artwork-zoom__caption {
          margin: 11px 42px 1px 3px;
          color: var(--graphite);
          font: 500 0.9rem 'Work Sans', sans-serif;
        }
        .artwork-zoom__close {
          position: absolute;
          top: 18px;
          right: 18px;
          z-index: 1;
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          padding: 0;
          border: 1px solid rgba(42,40,36,0.08);
          border-radius: 50%;
          background: rgba(255,253,249,0.92);
          color: var(--graphite);
          cursor: pointer;
          box-shadow: 0 3px 12px rgba(0,0,0,0.12);
          transition: transform .2s ease, background .2s ease;
        }
        .artwork-zoom__close:hover {
          transform: scale(1.06);
          background: #fff;
        }
        @keyframes artworkZoomBackdrop {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes artworkZoomIn {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (max-width: 600px) {
          .artwork-zoom { padding: 16px; }
          .artwork-zoom__panel {
            max-width: 90vw;
            max-height: 86vh;
            padding: 9px;
            border-radius: 18px;
          }
          .artwork-zoom__image {
            width: min(86vw, 520px);
            height: min(72vh, 660px);
            border-radius: 12px;
          }
          .artwork-zoom__close { top: 13px; right: 13px; width: 36px; height: 36px; }
          .artwork-zoom__caption { margin-top: 9px; font-size: 0.84rem; }
        }
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
          -webkit-tap-highlight-color: transparent;
        }
        .art-card__quick-wa:hover,
        .art-card__quick-wa:active {
          transform: scale(1.08);
          box-shadow: 0 8px 20px rgba(0,0,0,0.28);
        }
        @media (max-width: 480px) {
          .art-card__quick-wa {
            width: 46px;
            height: 46px;
            bottom: 10px;
            right: 10px;
          }
        }
        .art-card__info { padding-top: 0.35rem; }
        .art-card__info h3 { font-size: 1.05rem; font-weight: 500; }
        .art-card__category {
          display: block;
          border: 0;
          padding: 0;
          margin: 0.12rem 0 0.2rem;
          background: transparent;
          color: var(--sage);
          font: 500 0.72rem 'Work Sans', sans-serif;
          text-align: left;
          cursor: pointer;
        }
        .art-card__category:hover { text-decoration: underline; }
        .art-card__size {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.82rem; color: #6b675d; margin: 0.35rem 0;
        }
        .art-card__price { font-size: 0.92rem; color: var(--ochre); margin: 0; }
        .art-card__previous-price {
          display: block;
          margin-bottom: 0.08rem;
          color: #777166;
          font-size: 0.76rem;
          line-height: 1.25;
        }
        .art-card__current-price {
          display: block;
          color: var(--ochre);
          font-size: 1.08rem;
          font-weight: 600;
          line-height: 1.25;
        }
        @media (max-width: 480px) {
          .art-card__previous-price { font-size: 0.68rem; }
          .art-card__current-price { font-size: 0.94rem; }
        }

        .chat-widget {
          position: fixed;
          bottom: calc(20px + env(safe-area-inset-bottom, 0px));
          right: calc(20px + env(safe-area-inset-right, 0px));
          z-index: 40;
          display: flex; flex-direction: column; align-items: flex-end; gap: 14px;
          max-width: calc(100vw - 40px);
        }
        @media (max-width: 480px) {
          .chat-widget {
            right: max(12px, env(safe-area-inset-right));
            bottom: max(12px, env(safe-area-inset-bottom));
          }
          .chat-widget__bubble-btn {
            width: 60px;
            height: 60px;
          }
          .chat-widget__panel {
            width: min(280px, calc(100vw - 24px));
          }
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
          -webkit-tap-highlight-color: transparent;
        }
        .chat-widget__bubble-btn--active { background: var(--graphite); animation: none; }
        .chat-widget__bubble-btn:hover,
        .chat-widget__bubble-btn:focus-visible { animation-play-state: paused; }
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
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          text-decoration: none;
        }
        .chat-widget__cta:hover { background: #347a4c; }

        .footer {
          padding: 3rem 6vw 4rem;
          display: flex; justify-content: space-between; align-items: center;
          border-top: 1px solid rgba(42,40,36,0.12);
          font-size: 0.85rem; color: #6b675d;
        }
        @media (max-width: 640px) { .footer { flex-direction: column; gap: 10px; text-align: center; } }
        @media (hover: none), (pointer: coarse) {
          .chat-widget__bubble-btn { animation: none; }
          .art-card__frame,
          .art-card__frame:hover,
          .art-card__quick-wa,
          .art-card__quick-wa:hover,
          .filter-btn,
          .nav__button {
            transition: none;
          }
          .art-card__frame:hover .art-card__img--loaded {
            transform: scale(1);
          }
          .art-card__img {
            transform: scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .gallery-root *,
          .gallery-root *::before,
          .gallery-root *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
          .artwork-zoom,
          .artwork-zoom__panel,
          .artwork-zoom__close {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
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

          <div className="nav__actions">
            <button
              type="button"
              className="nav__button nav__button--ghost"
              onClick={scrollToGallery}
            >
              Ver galería
            </button>
            <a
              href={buildWhatsAppUrl("Hola! Vi la galería online y quiero consultar por las obras disponibles.")}
              target="_blank"
              rel="noopener noreferrer"
              className="nav__button nav__button--primary"
            >
              WhatsApp
            </a>
          </div>
        </nav>

        <header className="hero">
          <div className={`hero-anim ${loaded ? "hero-anim--in" : ""}`}>
            <p className="hero__eyebrow-free">Portfolio de arte · San Juan</p>
            <h1 className="hero__title">
              <img className="hero__logo" src={logoFifi} alt="FIFI" />
            </h1>
            <div className="hero__stroke" />
            <p className="hero__desc">
              Obras originales hechas para transformar espacios. Explorá la colección y consultá
              por disponibilidad, medidas y enmarcado.
            </p>
            <button type="button" className="hero__cta" onClick={scrollToGallery}>
              Ver todas las obras <ArrowUpRight size={17} />
            </button>
            <p className="hero__meta">14 obras originales · piezas disponibles y vendidas</p>
          </div>
          {activeCategory === "Todos" && (
            <div className="hero__portfolio" aria-label="Obras destacadas del portfolio">
              {featuredWorks.map((art, index) => (
                <ArtCard
                  key={art.id}
                  art={art}
                  index={index}
                  onCategoryClick={handleCategoryClick}
                  onImageClick={handleImageClick}
                />
              ))}
            </div>
          )}
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
          <div id="galeria" className="art-grid" key={activeCategory}>
            {filtered.map((art, index) => (
              <ArtCard
                key={art.id}
                art={art}
                index={index}
                onCategoryClick={handleCategoryClick}
                onImageClick={handleImageClick}
              />
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
      {selectedArtwork && (
        <div
          className="artwork-zoom"
          role="presentation"
          onClick={() => setSelectedArtwork(null)}
        >
          <div
            className="artwork-zoom__panel"
            role="dialog"
            aria-modal="true"
            aria-label={`Vista ampliada de ${selectedArtwork.title}`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="artwork-zoom__close"
              ref={zoomCloseRef}
              onClick={() => setSelectedArtwork(null)}
              aria-label="Cerrar imagen ampliada"
            >
              <X size={19} />
            </button>
            <img
              className="artwork-zoom__image"
              src={selectedArtwork.image || placeholderArt(selectedArtwork.seed, 700, selectedArtwork.tall ? 900 : 700)}
              alt={selectedArtwork.title}
              style={{ objectPosition: selectedArtwork.imagePosition || "center center" }}
            />
            <p className="artwork-zoom__caption">{selectedArtwork.title}</p>
          </div>
        </div>
      )}
    </div>
  );
}
