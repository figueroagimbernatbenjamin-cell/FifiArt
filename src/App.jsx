import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { MessageCircle, X, Send, ArrowUpRight, Ruler, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import logoFifi from "./assets/fifi-logo.png";
import "./App.css";
import {
  CATEGORIES,
  ARTWORKS,
  placeholderArt,
  buildWhatsAppUrl,
} from "./data/artworks";

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
    : art.size || art.price
      ? `Hola, me interesa la obra "${art.title}"${art.size ? ` (${art.size})` : ""}. ¿Me pasás precio y disponibilidad?`
      : `Hola, me interesa la obra "${art.title}". ¿Me pasás más información?`;

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
            decoding="async"
            style={{
              objectFit: "cover",
              objectPosition: art.imagePosition || "center center",
              background: "#efe9df",
            }}
            onLoad={() => setImgLoaded(true)}
            onError={handleImageError}
          />
          <div className="art-card__sheen" style={{ opacity: hovered ? 1 : 0 }} />

          <div className="art-card__badges">
            {art.sold ? (
              <span className="art-card__badge art-card__badge--sold">Vendido</span>
            ) : (
              <span className="art-card__badge art-card__badge--available">Disponible</span>
            )}
          </div>

          <div className="art-card__expand-hint" aria-hidden="true">
            <Maximize2 size={13} />
            <span>Ampliar</span>
          </div>
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
        <p className="art-card__technique">Técnica mixta sobre lienzo</p>
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
        ) : art.price ? (
          <p className="art-card__price">
            {art.previousPrice && (
              <span className="art-card__previous-price">
                Antes: <del>{art.previousPrice}</del>
              </span>
            )}
            <span className="art-card__current-price">{art.price}</span>
          </p>
        ) : null}
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
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const zoomCloseRef = useRef(null);

  const availableCount = useMemo(
    () => ARTWORKS.filter((art) => !art.sold).length,
    []
  );

  useEffect(() => {
    document.title = "FIFI | Galería de Arte";
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  const featuredWorks = useMemo(
    () =>
      ARTWORKS.filter((art) => !art.sold)
        .sort((a, b) => {
          const priceA = Number(String(a.price).replace(/[^\d]/g, ""));
          const priceB = Number(String(b.price).replace(/[^\d]/g, ""));
          return priceB - priceA;
        })
        .slice(0, 3)
        .map((art) => ({ ...art, tall: true })),
    []
  );

  const filtered = useMemo(
    () =>
      ARTWORKS.filter((a) => {
        const matchesCategory =
          activeCategory === "Todos" || a.category === activeCategory;
        const matchesAvailability = onlyAvailable ? !a.sold : true;
        return matchesCategory && matchesAvailability;
      }),
    [activeCategory, onlyAvailable]
  );

  const activeGalleryList = useMemo(() => {
    return filtered.length > 0 ? filtered : ARTWORKS;
  }, [filtered]);

  const currentIndex = useMemo(() => {
    if (!selectedArtwork) return -1;
    const idx = activeGalleryList.findIndex((a) => a.id === selectedArtwork.id);
    return idx !== -1 ? idx : ARTWORKS.findIndex((a) => a.id === selectedArtwork.id);
  }, [selectedArtwork, activeGalleryList]);

  const handlePrev = useCallback(() => {
    if (!selectedArtwork) return;
    const idx = activeGalleryList.findIndex((a) => a.id === selectedArtwork.id);
    const prevIdx = idx > 0 ? idx - 1 : activeGalleryList.length - 1;
    setSelectedArtwork(activeGalleryList[prevIdx]);
  }, [selectedArtwork, activeGalleryList]);

  const handleNext = useCallback(() => {
    if (!selectedArtwork) return;
    const idx = activeGalleryList.findIndex((a) => a.id === selectedArtwork.id);
    const nextIdx = idx < activeGalleryList.length - 1 ? idx + 1 : 0;
    setSelectedArtwork(activeGalleryList[nextIdx]);
  }, [selectedArtwork, activeGalleryList]);

  useEffect(() => {
    if (!selectedArtwork) return;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = "hidden";
    zoomCloseRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSelectedArtwork(null);
      if (event.key === "ArrowLeft") handlePrev();
      if (event.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);

    let startX = 0;
    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
    };
    const handleTouchEnd = (e) => {
      const endX = e.changedTouches[0].clientX;
      const diff = endX - startX;
      if (diff > 50) handlePrev();
      else if (diff < -50) handleNext();
    };
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [selectedArtwork, handlePrev, handleNext]);

  const modalWaMessage = useMemo(() => {
    if (!selectedArtwork) return "";
    if (selectedArtwork.sold) {
      return `Hola! Me encantó la obra "${selectedArtwork.title}" (${selectedArtwork.category}). Como figura vendida, ¿podrías asesorarme para un encargo similar?`;
    }
    return selectedArtwork.size || selectedArtwork.price
      ? `Hola! Estoy interesado/a en adquirir la obra "${selectedArtwork.title}" (${selectedArtwork.size || selectedArtwork.category}). ¿Podrías brindarme más detalles para coordinar compra y envío?`
      : `Hola! Me interesa la obra "${selectedArtwork.title}". ¿Podrías brindarme más información sobre disponibilidad y medidas?`;
  }, [selectedArtwork]);

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
            <p className="hero__meta">
              {ARTWORKS.length} obras originales · {availableCount} disponibles para entrega inmediata
            </p>
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
            <button
              type="button"
              aria-pressed={onlyAvailable}
              className={`filter-btn filter-btn--availability ${onlyAvailable ? "filter-btn--active" : ""}`}
              onClick={() => setOnlyAvailable((prev) => !prev)}
            >
              <span className="availability-dot" />
              Solo disponibles ({availableCount})
            </button>
          </div>
        </Reveal>

        <Reveal>
          <div id="galeria" className="art-grid" key={`${activeCategory}-${onlyAvailable}`}>
            {filtered.length === 0 ? (
              <div className="art-grid-empty">
                <p className="art-grid-empty__text">No hay obras disponibles en esta categoría por el momento.</p>
                <button
                  type="button"
                  className="filter-btn filter-btn--active"
                  onClick={() => {
                    setActiveCategory("Todos");
                    setOnlyAvailable(false);
                  }}
                >
                  Ver todas las obras
                </button>
              </div>
            ) : (
              filtered.map((art, index) => (
                <ArtCard
                  key={art.id}
                  art={art}
                  index={index}
                  onCategoryClick={handleCategoryClick}
                  onImageClick={handleImageClick}
                />
              ))
            )}
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
          {/* Navigation Arrows */}
          <button
            type="button"
            className="artwork-zoom__nav artwork-zoom__nav--prev"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Obra anterior (Flecha izquierda)"
          >
            <ChevronLeft size={28} />
          </button>

          <button
            type="button"
            className="artwork-zoom__nav artwork-zoom__nav--next"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Obra siguiente (Flecha derecha)"
          >
            <ChevronRight size={28} />
          </button>

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

            <div className="artwork-zoom__image-wrap">
              <img
                className="artwork-zoom__image"
                src={selectedArtwork.image || placeholderArt(selectedArtwork.seed, 700, selectedArtwork.tall ? 900 : 700)}
                alt={selectedArtwork.title}
                decoding="async"
                style={{ objectPosition: selectedArtwork.imagePosition || "center center" }}
              />
            </div>

            <div className="artwork-zoom__details">
              <div className="artwork-zoom__info">
                <div className="artwork-zoom__tags">
                  <span className="artwork-zoom__counter">
                    {currentIndex + 1} de {activeGalleryList.length}
                  </span>
                  <span className="artwork-zoom__category">{selectedArtwork.category}</span>
                  {selectedArtwork.sold ? (
                    <span className="artwork-zoom__badge artwork-zoom__badge--sold">Vendido</span>
                  ) : (
                    <span className="artwork-zoom__badge artwork-zoom__badge--available">Disponible</span>
                  )}
                </div>

                <h2 className="artwork-zoom__title">{selectedArtwork.title}</h2>
                <p className="artwork-zoom__desc">
                  {selectedArtwork.size ? `Medidas: ${selectedArtwork.size}` : "Medidas a consultar"} · Técnica mixta sobre lienzo
                </p>
              </div>

              <div className="artwork-zoom__cta-group">
                {selectedArtwork.price && !selectedArtwork.sold && (
                  <div className="artwork-zoom__price">
                    {selectedArtwork.previousPrice && (
                      <span className="artwork-zoom__price-prev">
                        Antes: <del>{selectedArtwork.previousPrice}</del>
                      </span>
                    )}
                    <span className="artwork-zoom__price-curr">{selectedArtwork.price}</span>
                  </div>
                )}
                <a
                  href={buildWhatsAppUrl(modalWaMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="artwork-zoom__wa-btn"
                >
                  <WhatsAppIcon size={18} />
                  {selectedArtwork.sold ? "Consultar por encargo similar" : "Consultar por esta obra"}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
