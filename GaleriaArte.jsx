import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { X, Send, ArrowUpRight, Ruler, ArrowLeft, ArrowRight } from "lucide-react";

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

function buildArtworkImages(seed, tall, primaryImage = null, count = 3) {
  const list = primaryImage ? [primaryImage] : [];
  while (list.length < count) {
    list.push(placeholderArt(`${seed}-${list.length + 1}`, 700, tall ? 900 : 700));
  }
  return list;
}

const ARTWORKS = [
  {
    id: 1,
    title: "Cuadro 1",
    category: "Abstracto",
    size: "80 x 100 cm — Sin Marco",
    price: "$135.000",
    seed: "cuadro-1",
    tall: false,
    image: "https://user35230.na.imgto.link/public/20260922/cuadro-1.avif",
    images: buildArtworkImages("cuadro-1", false, "https://user35230.na.imgto.link/public/20260922/cuadro-1.avif", 3),
  },
  {
    id: 2,
    title: "Cuadro 2",
    category: "Abstracto",
    size: "80 x 100 cm — Sin Marco",
    price: "$135.000",
    seed: "cuadro-2",
    tall: false,
    image: "https://user35230.na.imgto.link/public/20260922/cuadro-2.avif",
    images: buildArtworkImages("cuadro-2", false, "https://user35230.na.imgto.link/public/20260922/cuadro-2.avif", 3),
  },
  {
    id: 3,
    title: "Cuadro 3",
    category: "Abstracto",
    size: "80 x 100 cm — Sin Marco",
    price: "$135.000",
    seed: "cuadro-3",
    tall: false,
    image: "https://user35230.na.imgto.link/public/20260922/cuadro-3.avif",
    images: buildArtworkImages("cuadro-3", false, "https://user35230.na.imgto.link/public/20260922/cuadro-3.avif", 3),
  },
  {
    id: 4,
    title: "Cuadro 4",
    category: "Abstracto",
    size: "80 x 100 cm — Sin Marco",
    price: "$135.000",
    seed: "cuadro-4",
    tall: false,
    image: "https://user35230.na.imgto.link/public/20260922/cuadro-4.avif",
    images: buildArtworkImages("cuadro-4", false, "https://user35230.na.imgto.link/public/20260922/cuadro-4.avif", 3),
  },
  {
    id: 5,
    title: "Cuadro 5",
    category: "Abstracto",
    size: "80 x 100 cm — Sin Marco",
    price: "$135.000",
    seed: "cuadro-5",
    tall: false,
    image: "https://user35230.na.imgto.link/public/20260922/cuadro-5.avif",
    images: buildArtworkImages("cuadro-5", false, "https://user35230.na.imgto.link/public/20260922/cuadro-5.avif", 3),
  },
  {
    id: 6,
    title: "Cuadro 6",
    category: "Abstracto",
    size: "80 x 100 cm — Sin Marco",
    price: "$135.000",
    seed: "cuadro-6",
    tall: false,
    image: "https://user35230.na.imgto.link/public/20260922/cuadro-6-mejorado.avif",
    images: buildArtworkImages("cuadro-6", false, "https://user35230.na.imgto.link/public/20260922/cuadro-6-mejorado.avif", 3),
  },
  {
    id: 7,
    title: "Cuadro 7",
    category: "Abstracto",
    size: "80 x 100 cm — Sin Marco",
    price: "$135.000",
    seed: "cuadro-7",
    tall: false,
    image: "https://user35230.na.imgto.link/public/20260922/cuadro-7-mejorado.avif",
    images: buildArtworkImages("cuadro-7", false, "https://user35230.na.imgto.link/public/20260922/cuadro-7-mejorado.avif", 3),
  },
  {
    id: 8,
    title: "Cuadro 8",
    category: "Abstracto",
    size: "80 x 100 cm — Sin Marco",
    price: "$135.000",
    seed: "cuadro-8",
    tall: false,
    image: "https://user35230.na.imgto.link/public/20260922/cuadro-8.avif",
    images: buildArtworkImages("cuadro-8", false, "https://user35230.na.imgto.link/public/20260922/cuadro-8.avif", 3),
  },
  {
    id: 9,
    title: "Cuadro 9",
    category: "Abstracto",
    size: "80 x 100 cm — Sin Marco",
    price: "$135.000",
    seed: "cuadro-9",
    tall: false,
    image: "https://user35230.na.imgto.link/public/20260922/cuadro-9.avif",
    images: buildArtworkImages("cuadro-9", false, "https://user35230.na.imgto.link/public/20260922/cuadro-9.avif", 3),
  },
  {
    id: 10,
    title: "Cuadro 10",
    category: "Abstracto",
    size: "80 x 100 cm — Sin Marco",
    price: "$135.000",
    seed: "cuadro-10",
    tall: false,
    image: "https://user35230.na.imgto.link/public/20260922/cuadro-10.avif",
    images: buildArtworkImages("cuadro-10", false, "https://user35230.na.imgto.link/public/20260922/cuadro-10.avif", 3),
  },
  {
    id: 11,
    title: "Cuadro 11",
    category: "Abstracto",
    size: "80 x 100 cm — Sin Marco",
    price: "$135.000",
    seed: "cuadro-11",
    tall: false,
    image: "https://user35230.na.imgto.link/public/20260922/cuadro-11.avif",
    images: buildArtworkImages("cuadro-11", false, "https://user35230.na.imgto.link/public/20260922/cuadro-11.avif", 3),
  }
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

function ArtCard({ art, index, onOpenGallery }) {
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

  const handleMove = useCallback((e) => applyTiltFromPoint(e.clientX, e.clientY), [applyTiltFromPoint]);
  const handleTouchStart = useCallback((e) => {
    setHovered(true);
    const t = e.touches[0];
    if (t) applyTiltFromPoint(t.clientX, t.clientY);
  }, [applyTiltFromPoint]);
  const handleTouchMove = useCallback((e) => {
    const t = e.touches[0];
    if (t) applyTiltFromPoint(t.clientX, t.clientY);
  }, [applyTiltFromPoint]);
  const reset = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  }, []);

  const fallbackArt = useMemo(() => placeholderArt(art.seed, 700, art.tall ? 900 : 700), [art.seed, art.tall]);
  const galleryImages = useMemo(() => art.images && art.images.length ? art.images : [art.image || fallbackArt], [art.images, art.image, fallbackArt]);
  const handleImageError = useCallback((event) => {
    if (event.currentTarget.src !== fallbackArt) {
      event.currentTarget.src = fallbackArt;
    }
  }, [fallbackArt]);

  const waMessage = `Hola, me interesa la obra "${art.title}" (${art.size}). ¿Me pasás precio y disponibilidad?`;

  return (
    <div
      className={`art-card ${art.tall ? "art-card--tall" : ""}`}
      style={{
        animationDelay: `${(index % 6) * 120}ms`,
        '--card-delay': `${(index % 6) * 120}ms`,
      }}
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
          onClick={() => onOpenGallery(galleryImages, 0)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onOpenGallery(galleryImages, 0);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={`Ver más fotos de ${art.title}`}
          style={{
            transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.02 : 1})`,
          }}
        >
          <img
            src={galleryImages[0] || fallbackArt}
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
            e.stopPropagation();
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
          <button className="chat-widget__close" onClick={() => setOpen(false)} aria-label="Cerrar chat">
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
  const [studioIndex, setStudioIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [galleryScale, setGalleryScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const zoomTimerRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    document.title = "FIFI | Galería de Arte";
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!galleryImages.length) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setGalleryImages([]);
        setSelectedImageIndex(0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [galleryImages]);

  const heroImage = useMemo(
    () => "https://user35230.na.imgto.link/public/20260922/fifi-4x5-transparente.avif",
    []
  );
  const filtered = useMemo(
    () => activeCategory === "Todos" ? ARTWORKS : ARTWORKS.filter((a) => a.category === activeCategory),
    [activeCategory]
  );
  const studioWorks = useMemo(() => ARTWORKS, []);
  const moveStudio = useCallback((direction) => {
    setStudioIndex((prev) => (prev + direction + studioWorks.length) % studioWorks.length);
  }, [studioWorks.length]);

  const handleCategoryClick = useCallback((category) => setActiveCategory(category), []);
  const openArtworkGallery = useCallback((images, startIndex = 0) => {
    if (!images || !images.length) return;
    setGalleryImages(images);
    setSelectedImageIndex(startIndex);
    setGalleryScale(1);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
  }, []);
  const closeArtworkGallery = useCallback(() => {
    setGalleryImages([]);
    setSelectedImageIndex(0);
    setGalleryScale(1);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
    if (zoomTimerRef.current) clearTimeout(zoomTimerRef.current);
  }, []);

  const startZoomHold = useCallback((event) => {
    if (zoomTimerRef.current) clearTimeout(zoomTimerRef.current);
    if (event && typeof event.clientX === "number") {
      dragStartRef.current = {
        x: event.clientX,
        y: event.clientY,
        panX: pan.x,
        panY: pan.y,
      };
    }
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setIsDragging(true);
    setGalleryScale(1.8);
  }, [pan.x, pan.y]);

  const stopZoomHold = useCallback((event) => {
    if (zoomTimerRef.current) clearTimeout(zoomTimerRef.current);
    event?.currentTarget?.releasePointerCapture?.(event.pointerId);
    setIsDragging(false);
    setGalleryScale(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleGalleryPointerMove = useCallback((event) => {
    if (!isDragging || galleryScale <= 1) return;
    const dx = event.clientX - dragStartRef.current.x;
    const dy = event.clientY - dragStartRef.current.y;
    setPan({
      x: dragStartRef.current.panX + dx * 0.9,
      y: dragStartRef.current.panY + dy * 0.9,
    });
  }, [galleryScale, isDragging]);

  useEffect(() => {
    return () => {
      if (zoomTimerRef.current) clearTimeout(zoomTimerRef.current);
    };
  }, []);

  return (
    <div className="gallery-root page-shell">
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
          animation: blobFloat 18s ease-in-out infinite alternate;
        }
        @keyframes blobFloat {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(12px, -14px, 0) scale(1.04); }
          100% { transform: translate3d(-10px, 18px, 0) scale(0.98); }
        }
        .blob--1 { top: -8%; right: -10%; width: 46vw; height: 46vw; background: radial-gradient(circle at 30% 30%, var(--ochre), transparent 70%); animation-delay: 0.2s; }
        .blob--2 { bottom: 5%; left: -12%; width: 38vw; height: 38vw; background: radial-gradient(circle at 60% 40%, var(--sage), transparent 70%); animation-delay: 1.2s; }
        .blob--3 { top: 40%; left: 45%; width: 26vw; height: 26vw; background: radial-gradient(circle at 50% 50%, var(--sand), transparent 75%); opacity: 0.5; animation-delay: 2.4s; }

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
        .nav__location {
          font-size: 0.8rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(42, 40, 36, 0.72);
        }
        @media (max-width: 480px) {
          .nav { padding: 18px 5vw; }
          .nav__mark { font-size: 0.95rem; }
          .nav__location { letter-spacing: 0.1em; font-size: 0.68rem; }
        }

        .hero {
          display: grid;
          grid-template-columns: 1.08fr 1.12fr;
          gap: 2.5rem;
          align-items: center;
          padding: 0 6vw 8vh;
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
        .hero__eyebrow-free {
          color: var(--sage);
          font-size: clamp(1.15rem, 2vw, 2rem);
          margin: 0 0 1.2rem;
          letter-spacing: 0.01em;
          font-weight: 400;
          font-family: 'Fraunces', serif;
          font-style: normal;
        }
        .hero__title {
          font-size: clamp(5.5rem, 9vw, 12rem);
          line-height: 0.85;
          letter-spacing: -0.06em;
          font-style: italic;
          font-optical-sizing: auto;
          color: var(--graphite);
          margin: 0;
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
          height: 3px;
          width: min(280px, 62vw);
          margin: 1.8rem 0 0;
          background: linear-gradient(90deg, var(--ochre) 0%, rgba(168,112,60,0.88) 55%, rgba(168,112,60,0.58) 100%);
          border-radius: 999px;
          transform-origin: left center;
          animation: strokeGrow 1.15s cubic-bezier(.22,1,.36,1) 0.3s both;
          box-shadow: 0 1px 0 rgba(42,40,36,0.04), 0 6px 18px rgba(168,112,60,0.18);
        }
        @keyframes strokeGrow {
          from { transform: scaleX(0.25); opacity: 0; }
          to { transform: scaleX(1); opacity: 1; }
        }

        .hero__visual {
          position: relative;
          aspect-ratio: 4/5;
          width: min(100%, 620px);
          justify-self: end;
          border-radius: 0;
          overflow: hidden;
          background: transparent;
          box-shadow: none;
          margin: 0;
          padding: 0;
          line-height: 0;
        }
        .hero__visual img {
          display: block;
          width: 100%; height: 100%; object-fit: cover;
          object-position: center center;
          border-radius: 0;
          box-shadow: none;
          background: transparent;
          margin: 0;
          padding: 0;
        }
        .hero__visual-frame {
          position: absolute;
          inset: 0;
          border: none;
          background: transparent;
          border-radius: 0;
          pointer-events: none;
        }

        .hero-anim { opacity: 0; transform: translateY(22px); transition: opacity .9s ease, transform .9s cubic-bezier(.22,1,.36,1); }
        .hero-anim--in { opacity: 1; transform: translateY(0); }

        .reveal {
          opacity: 0;
          transform: translateY(26px);
          transition: opacity .9s ease, transform .9s cubic-bezier(.22,1,.36,1);
          transition-delay: 0.08s;
        }
        .reveal--in { opacity: 1; transform: translateY(0); }

        .page-shell {
          opacity: 0;
          transform: translateY(18px);
          animation: pageEnter 1s cubic-bezier(.22,1,.36,1) forwards;
        }
        @keyframes pageEnter {
          0% { opacity: 0; transform: translateY(22px); }
          100% { opacity: 1; transform: translateY(0); }
        }

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
          border-radius: 50%;
          transform: scale(0);
          transform-origin: center;
          transition: transform .5s cubic-bezier(.22,1,.36,1);
          z-index: -1;
        }
        .filter-btn:hover::before { transform: scale(2.2); border-radius: 0; }
        .filter-btn:hover { color: var(--canvas-white); border-color: var(--graphite); }
        .filter-btn--active { background: var(--graphite); color: var(--canvas-white); border-color: var(--graphite); }
        .filter-btn--active::before { display: none; }

        .studio {
          padding: 0 6vw 3.5rem;
        }
        .studio__shell {
          position: relative;
          background: rgba(255, 253, 249, 0.36);
          border: 1px solid rgba(42, 40, 36, 0.08);
          padding: 1.2rem 1rem 1.4rem;
        }
        .studio__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .studio__title {
          font-size: clamp(1.35rem, 2vw, 2rem);
          letter-spacing: -0.04em;
        }
        .studio__nav {
          display: flex;
          gap: 0.65rem;
        }
        .studio__arrow {
          border: none;
          background: transparent;
          color: rgba(42, 40, 36, 0.8);
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform .2s ease, opacity .2s ease, color .2s ease;
          opacity: 0.8;
          animation: arrowPulse 3.2s ease-in-out infinite;
        }
        @keyframes arrowPulse {
          0%, 100% {
            transform: translateX(0) scale(1);
            opacity: 0.7;
          }
          40% {
            transform: translateX(3px) scale(1.06);
            opacity: 1;
          }
          60% {
            transform: translateX(-2px) scale(1.03);
            opacity: 0.85;
          }
        }
        .studio__arrow:hover {
          transform: translateY(-1px) scale(1.08);
          color: var(--graphite);
          opacity: 1;
        }
        .studio__viewport {
          display: grid;
          grid-template-columns: 52px minmax(0, 1fr) 52px;
          align-items: center;
          gap: 0.75rem;
          max-width: 900px;
          margin: 0 auto;
        }
        .studio__artframe {
          position: relative;
          width: min(100%, 620px);
          margin: 0 auto;
          aspect-ratio: 4 / 5;
          overflow: hidden;
          background: #ece3d8;
          box-shadow: 0 26px 52px -30px rgba(42, 40, 36, 0.4);
          animation: studioImageIn .7s cubic-bezier(.22,1,.36,1) both;
        }
        @keyframes studioImageIn {
          0% {
            opacity: 0;
            transform: translateY(18px) scale(0.97) rotate(-1.2deg);
            filter: blur(4px);
          }
          35% {
            opacity: 0.7;
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(0deg);
            filter: blur(0);
          }
        }
        .studio__artframe img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          filter: saturate(0.96) contrast(1.04);
        }
        .studio__info {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 1rem;
          margin-top: 1rem;
        }
        .studio__eyebrow {
          margin: 0 0 0.25rem;
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #7c756d;
        }
        .studio__name {
          margin: 0;
          font-size: clamp(1.4rem, 2vw, 2.1rem);
          letter-spacing: -0.04em;
        }
        .studio__specs {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
          text-align: right;
          color: #504a43;
        }
        .studio__specs span {
          font-size: 0.82rem;
          color: #7c756d;
        }
        .studio__specs strong {
          font-size: clamp(1rem, 1.6vw, 1.25rem);
          font-weight: 500;
          color: var(--ochre);
          font-style: normal;
        }
        @media (max-width: 480px) {
          .studio { padding: 0 5vw 2.6rem; }
          .studio__shell { padding: 0.9rem 0.8rem 1.1rem; }
          .studio__viewport { grid-template-columns: 40px minmax(0, 1fr) 40px; }
          .studio__info { flex-direction: column; align-items: flex-start; }
          .studio__specs { align-items: flex-start; text-align: left; }
        }

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
          opacity: 0;
          transform: translateY(24px) scale(0.985);
          animation: cardIn .8s cubic-bezier(.22,1,.36,1) both;
          animation-delay: var(--card-delay, 0ms);
        }
        @keyframes cardIn {
          0% {
            opacity: 0;
            transform: translateY(24px) scale(0.985);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
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
        .art-card__quick-wa:hover, .art-card__quick-wa:active {
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

        .gallery-zoom {
          position: fixed;
          inset: 0;
          z-index: 60;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: rgba(24, 18, 12, 0.72);
          backdrop-filter: blur(10px);
        }
        .gallery-zoom__panel {
          position: relative;
          width: min(860px, calc(100vw - 32px));
          max-height: 90vh;
          background: rgba(255, 253, 249, 0.97);
          border: none;
          border-radius: 0;
          box-shadow: 0 30px 70px rgba(22, 18, 12, 0.35);
          overflow: hidden;
          animation: galleryZoomIn .38s cubic-bezier(.22,1,.36,1) both;
        }
        @keyframes galleryZoomIn {
          from { opacity: 0; transform: scale(0.96) translateY(16px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .gallery-zoom__close {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 3;
          width: 38px; height: 38px; border-radius: 50%;
          border: none; background: rgba(42,40,36,0.8); color: white;
          display: flex; align-items: center; justify-content: center; cursor: pointer;
        }
        .gallery-zoom__main {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          background: #f8f1e7;
        }
        .gallery-zoom__img-wrap {
          position: relative;
          width: 100%;
          min-height: min(72vh, 760px);
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f4efe7;
          overflow: hidden;
          cursor: zoom-in;
          touch-action: none;
          padding: 18px;
        }
        .gallery-zoom__img {
          display: block;
          max-width: 100%;
          max-height: 72vh;
          width: auto;
          height: auto;
          object-fit: contain;
          object-position: center;
          background: transparent;
          border-radius: 0;
          outline: none;
          transform-origin: center center;
          transition: transform .25s cubic-bezier(.22,1,.36,1), filter .25s ease;
          will-change: transform;
        }
        .gallery-zoom__img--active { cursor: zoom-out; }
        .gallery-zoom__thumbs {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(78px, 1fr));
          gap: 10px;
          padding: 14px 14px 18px;
          background: rgba(255,253,249,0.8);
        }
        .gallery-zoom__thumb {
          border: 2px solid transparent;
          background: transparent;
          padding: 0; border-radius: 10px; overflow: hidden; cursor: pointer;
          transition: border-color .2s ease, transform .2s ease;
        }
        .gallery-zoom__thumb img {
          width: 100%; height: 92px; object-fit: cover; display: block;
        }
        .gallery-zoom__thumb--active {
          border-color: rgba(168,112,60,0.9);
          transform: translateY(-1px);
        }

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
          <div className="nav__mark">FIFI — Galería de Arte</div>
          <div className="nav__location">San Juan, Argentina</div>
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
          <div className={`hero-anim ${loaded ? "hero-anim--in" : ""} hero__visual`} style={{ transitionDelay: "150ms" }}>
            <div className="hero__visual-frame" />
            <img src={heroImage} alt="Obra destacada de la galería" />
          </div>
        </header>

        <Reveal>
          <section className="studio" aria-label="Estudio de obras destacadas">
            <div className="studio__shell">
              <div className="studio__header">
                <h2 className="studio__title">Estudio</h2>
              </div>

              <div className="studio__viewport">
                <button type="button" className="studio__arrow" aria-label="Ver obra anterior" onClick={() => moveStudio(-1)}>
                  <ArrowLeft size={18} />
                </button>

                <div className="studio__artframe" key={studioWorks[studioIndex]?.id} onClick={() => openArtworkGallery(studioWorks[studioIndex].images, 0)}>
                  <img src={studioWorks[studioIndex]?.image} alt={studioWorks[studioIndex]?.title} />
                </div>

                <button type="button" className="studio__arrow" aria-label="Ver obra siguiente" onClick={() => moveStudio(1)}>
                  <ArrowRight size={18} />
                </button>
              </div>

              <div className="studio__info">
                <div>
                  <p className="studio__eyebrow">Obra destacada</p>
                  <h3 className="studio__name">{studioWorks[studioIndex]?.title}</h3>
                </div>
                <div className="studio__specs">
                  <span>{studioWorks[studioIndex]?.size}</span>
                  <strong>{studioWorks[studioIndex]?.price}</strong>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

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
              <ArtCard key={art.id} art={art} index={i} onOpenGallery={openArtworkGallery} />
            ))}
          </div>
        </Reveal>

        {galleryImages.length > 0 && (
          <div className="gallery-zoom" onClick={closeArtworkGallery}>
            <div className="gallery-zoom__panel" onClick={(e) => e.stopPropagation()}>
              <button className="gallery-zoom__close" onClick={closeArtworkGallery} aria-label="Cerrar vista ampliada">
                <X size={18} />
              </button>

              <div className="gallery-zoom__main">
                <div
                  className={`gallery-zoom__img-wrap ${galleryScale > 1 ? "gallery-zoom__img--active" : ""}`}
                  onPointerDown={startZoomHold}
                  onPointerMove={handleGalleryPointerMove}
                  onPointerUp={stopZoomHold}
                  onPointerLeave={stopZoomHold}
                  onPointerCancel={stopZoomHold}
                  onWheel={(event) => {
                    event.preventDefault();
                    const nextScale = Math.min(2.4, Math.max(1, galleryScale + (event.deltaY < 0 ? 0.12 : -0.12)));
                    setGalleryScale(nextScale);
                    if (nextScale <= 1) setPan({ x: 0, y: 0 });
                  }}
                >
                  <img
                    className="gallery-zoom__img"
                    src={galleryImages[selectedImageIndex] || galleryImages[0]}
                    alt="Vista ampliada de la obra"
                    style={{
                      transform: `translate(${pan.x}px, ${pan.y}px) scale(${galleryScale})`,
                      filter: galleryScale > 1 ? "saturate(1.05) contrast(1.03)" : "none",
                    }}
                  />
                </div>

                <div className="gallery-zoom__thumbs">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={`${img}-${idx}`}
                      type="button"
                      className={`gallery-zoom__thumb ${idx === selectedImageIndex ? "gallery-zoom__thumb--active" : ""}`}
                      onClick={() => setSelectedImageIndex(idx)}
                      aria-label={`Ver foto ${idx + 1}`}
                    >
                      <img src={img} alt={`Foto ${idx + 1}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

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
