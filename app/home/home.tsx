"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

// ── Types ──────────────────────────────────────────────────────────────────
interface Movie {
  id: number;
  title: string;
  rating: number;
  color: string;
  accent: string;
}

type Genre = "Drama" | "Action & Adventure" | "Independent" | "Comedy";

// ── Data ───────────────────────────────────────────────────────────────────
const suggestions: Movie[] = [
  { id: 1, title: "Sherrybaby", rating: 3, color: "#c8a97a", accent: "#8b6914" },
  { id: 2, title: "America: Freedom to Fascism", rating: 4.5, color: "#1a1a2e", accent: "#e94560" },
  { id: 3, title: "Enron: The Smartest Guys in the Room", rating: 4, color: "#0d0d0d", accent: "#e8e8e8" },
  { id: 4, title: "Super Size Me", rating: 2.5, color: "#f5c518", accent: "#c00" },
];

const recentlyViewed: Movie[] = [
  { id: 5, title: 'Auschwitz: Inside the Nazi State: Episode 1: "Surprising Beginnings"', rating: 4, color: "#2c2c2c", accent: "#888" },
];

const dvdQueue: Movie[] = [
  { id: 6, title: "12 Monkeys", rating: 2, color: "#1a1230", accent: "#7b5ea7" },
  { id: 7, title: "Black Rain", rating: 3, color: "#111", accent: "#c0392b" },
];

const byGenre: Record<Genre, Movie[]> = {
  Drama: [
    { id: 8, title: "Doctor Zhivago", rating: 4, color: "#2c3e50", accent: "#e8d5b7" },
    { id: 9, title: "The World's Fastest Indian", rating: 4.5, color: "#4a3728", accent: "#d4a547" },
    { id: 10, title: "Amadeus", rating: 5, color: "#1a0a2e", accent: "#9b59b6" },
    { id: 11, title: "Chariots of Fire", rating: 3.5, color: "#1e3a5f", accent: "#87ceeb" },
  ],
  "Action & Adventure": [
    { id: 12, title: "Die Hard", rating: 5, color: "#1a0000", accent: "#ff4444" },
    { id: 13, title: "The Terminator", rating: 4.5, color: "#0a0a0a", accent: "#cc0000" },
    { id: 14, title: "Speed", rating: 3.5, color: "#1a1a00", accent: "#ffcc00" },
    { id: 15, title: "Point Break", rating: 4, color: "#001a1a", accent: "#00cccc" },
  ],
  Independent: [
    { id: 16, title: "Reservoir Dogs", rating: 5, color: "#0d0d0d", accent: "#c0392b" },
    { id: 17, title: "Clerks", rating: 4, color: "#f5f5f5", accent: "#333" },
    { id: 18, title: "Slacker", rating: 3, color: "#2c1810", accent: "#a0522d" },
    { id: 19, title: "Pi", rating: 4, color: "#1a1a1a", accent: "#aaa" },
  ],
  Comedy: [
    { id: 20, title: "Office Space", rating: 5, color: "#1a2a1a", accent: "#4CAF50" },
    { id: 21, title: "Rushmore", rating: 4.5, color: "#1a1a2e", accent: "#e94560" },
    { id: 22, title: "The Big Lebowski", rating: 5, color: "#2e1a00", accent: "#d4a017" },
    { id: 23, title: "Best in Show", rating: 4, color: "#1e1e2e", accent: "#9b59b6" },
  ],
};

const genres: Genre[] = ["Drama", "Action & Adventure", "Independent", "Comedy"];

const sideGenres = [
  "Action & Adventure", "Comedy", "Drama", "Independent",
  "Sci-Fi & Fantasy", "Thrillers",
];

const otherGenres = [
  "Anime & Animation", "Children & Family", "Classics", "Documentary",
  "Gay & Lesbian", "Horror", "Romance", "Sports & Fitness", "Television",
];

// ── Estilo reutilizable para botones de control del player ─────────────────
const ctrlBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#fff",
  fontSize: 16,
  cursor: "pointer",
  padding: "2px 6px",
  fontFamily: "Arial, sans-serif",
  lineHeight: 1,
  borderRadius: 3,
  transition: "background 0.15s",
};

// ── Star Rating ────────────────────────────────────────────────────────────
function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const filled = rating >= i;
    const half = !filled && rating >= i - 0.5;
    stars.push(
      <span key={i} style={{ color: "#f4a81d", fontSize: size, lineHeight: 1 }}>
        {filled ? "★" : half ? "½" : "☆"}
      </span>
    );
  }
  return <span style={{ display: "inline-flex", gap: 1 }}>{stars}</span>;
}

// ── Poster Card ────────────────────────────────────────────────────────────
function PosterCard({
  movie,
  showRating = true,
  width = 100,
  height = 130,
  onPlay,
  onFavorite,
}: {
  movie: Movie;
  showRating?: boolean;
  width?: number;
  height?: number;
  onPlay?: (title: string) => void;
  onFavorite?: (title: string) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ textAlign: "center", width }}>
      {/* Título */}
      <div
        style={{
          fontSize: 11,
          color: "#336699",
          marginBottom: 4,
          cursor: "pointer",
          textDecoration: hovered ? "underline" : "none",
          lineHeight: 1.3,
          minHeight: 28,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => onPlay?.(movie.title)}
      >
        {movie.title}
      </div>

      {/* Póster — clic abre el player */}
      <div
        style={{
          width,
          height,
          background: movie.color,
          border: "1px solid #999",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 4px",
          overflow: "hidden",
          position: "relative",
          cursor: "pointer",
        }}
        onClick={() => onPlay?.(movie.title)}
      >
        <div
          style={{
            width: "80%",
            height: "80%",
            border: `2px solid ${movie.accent}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 6,
          }}
        >
          <span
            style={{
              color: movie.accent,
              fontSize: 9,
              textAlign: "center",
              fontFamily: "Georgia, serif",
              fontWeight: "bold",
              lineHeight: 1.3,
            }}
          >
            {movie.title}
          </span>
        </div>
        {/* Overlay play al hacer hover */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.15s",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(204,0,0,0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "#fff", fontSize: 14, paddingLeft: 3 }}>▶</span>
          </div>
        </div>
      </div>

      {/* Botones Play / Favorito */}
      <div style={{ marginBottom: showRating ? 4 : 0, display: "flex", justifyContent: "center", gap: 6 }}>
        <button
          onClick={() => onPlay?.(movie.title)}
          style={{
            background: "linear-gradient(to bottom, #5a9fd4, #2a6496)",
            border: "1px solid #1a4a7a",
            borderRadius: 3,
            color: "#fff",
            fontSize: 11,
            fontWeight: "bold",
            padding: "2px 14px",
            cursor: "pointer",
            fontFamily: "Arial, sans-serif",
          }}
        >
          Play
        </button>
        {onFavorite && (
          <button
            onClick={() => onFavorite(movie.title)}
            style={{
              background: "linear-gradient(to bottom, #cc0000, #990000)",
              border: "1px solid #770000",
              borderRadius: 3,
              color: "#fff",
              fontSize: 11,
              fontWeight: "bold",
              padding: "2px 14px",
              cursor: "pointer",
              fontFamily: "Arial, sans-serif",
            }}
          >
            Favorito
          </button>
        )}
      </div>

      {showRating && <StarRating rating={movie.rating} size={14} />}
    </div>
  );
}

// ── Section Header ─────────────────────────────────────────────────────────
function SectionHeader({ title }: { title: string }) {
  return (
    <div
      style={{
        background: "linear-gradient(to bottom, #4a6fa5, #2d4f7c)",
        color: "#fff",
        fontSize: 13,
        fontWeight: "bold",
        padding: "4px 8px",
        marginBottom: 8,
        fontFamily: "Arial, sans-serif",
      }}
    >
      {title}
    </div>
  );
}

// ── Nav Tab ────────────────────────────────────────────────────────────────
function NavTab({
  label,
  active,
  highlight,
  onClick,
}: {
  label: string;
  active?: boolean;
  highlight?: boolean;
  onClick?: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "5px 12px",
        background: highlight
          ? "linear-gradient(to bottom, #cc0000, #990000)"
          : active
          ? "#fff"
          : hov
          ? "#e0e0e0"
          : "linear-gradient(to bottom, #e8e8e8, #cccccc)",
        border: "1px solid #999",
        borderBottom: active ? "1px solid #fff" : "1px solid #999",
        cursor: "pointer",
        fontSize: 12,
        fontWeight: active ? "bold" : "normal",
        color: highlight ? "#fff" : "#333",
        fontFamily: "Arial, sans-serif",
        userSelect: "none",
        whiteSpace: "nowrap",
      }}
    >
      {label}
      {label === "Movies You'll" && (
        <span style={{ color: "#cc0000", marginLeft: 3 }}>♥</span>
      )}
    </div>
  );
}

// ── Secondary Nav Link ─────────────────────────────────────────────────────
function SecNav({ label, active }: { label: string; active?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <span
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "4px 14px",
        background: active ? "#f5f0e0" : "transparent",
        cursor: "pointer",
        fontSize: 12,
        color: "#333",
        fontFamily: "Arial, sans-serif",
        borderRight: "1px solid #ccc",
        textDecoration: hov && !active ? "underline" : "none",
      }}
    >
      {label}
      {label === "Genres" && <span style={{ marginLeft: 2 }}>▼</span>}
    </span>
  );
}

// ── Sidebar Link ───────────────────────────────────────────────────────────
function SideLink({ label }: { label: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "2px 16px",
        fontSize: 12,
        color: hov ? "#cc0000" : "#336699",
        cursor: "pointer",
        textDecoration: hov ? "underline" : "none",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {label}
    </div>
  );
}

// ── More Link ──────────────────────────────────────────────────────────────
function MoreLink({ label }: { label: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ textAlign: "right", marginTop: 6, paddingRight: 8 }}>
      <span
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          fontSize: 12,
          color: "#336699",
          cursor: "pointer",
          textDecoration: hov ? "underline" : "none",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {label} &gt;
      </span>
    </div>
  );
}

// ── Video Modal ────────────────────────────────────────────────────────────
function VideoModal({ title, onClose }: { title: string; onClose: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSec, setCurrentSec] = useState(0);
  const [volume, setVolumeState] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const totalSec = 6300; // 1 h 45 m (demo)

  const tickerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const fmt = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    return h > 0
      ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
      : `${m}:${String(sec).padStart(2, "0")}`;
  };

  const stopTicker = () => {
    if (tickerRef.current) {
      clearInterval(tickerRef.current);
      tickerRef.current = null;
    }
  };

  const startTicker = () => {
    stopTicker();
    tickerRef.current = setInterval(() => {
      setCurrentSec((c) => {
        if (c >= totalSec) {
          stopTicker();
          setIsPlaying(false);
          return totalSec;
        }
        return c + 1;
      });
    }, 1000);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => {
      if (prev) { stopTicker(); return false; }
      startTicker(); return true;
    });
  };

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setCurrentSec(Math.floor(ratio * totalSec));
  };

  const skipTime = (s: number) =>
    setCurrentSec((c) => Math.max(0, Math.min(totalSec, c + s)));

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) containerRef.current?.requestFullscreen();
    else document.exitFullscreen();
  };

  const resetHideTimer = () => {
    setShowControls(true);
    if (hideRef.current) clearTimeout(hideRef.current);
    hideRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  // ── Atajos de teclado ─────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { stopTicker(); onClose(); }
      if (e.key === " " || e.key === "k") { e.preventDefault(); togglePlay(); }
      if (e.key === "ArrowRight") skipTime(10);
      if (e.key === "ArrowLeft") skipTime(-10);
      if (e.key === "f") toggleFullscreen();
      if (e.key === "m") setIsMuted((v) => !v);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  // Limpieza al desmontar
  useEffect(() => () => { stopTicker(); }, []);

  const progress = totalSec > 0 ? currentSec / totalSec : 0;
  const effectiveVolume = isMuted ? 0 : volume;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.88)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(3px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onMouseMove={resetHideTimer}
    >
      <div
        ref={containerRef}
        style={{
          width: 820,
          maxWidth: "96vw",
          background: "#000",
          borderRadius: 6,
          overflow: "hidden",
          boxShadow: "0 0 60px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.07)",
        }}
      >
        {/* ── Barra de título ─────────────────────────────────────────────── */}
        <div
          style={{
            background: "linear-gradient(to bottom, #1c1c1c, #111)",
            padding: "9px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #2a2a2a",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontWeight: "bold",
                fontSize: 17,
                color: "#cc0000",
                border: "1px solid #cc0000",
                padding: "0 5px",
                lineHeight: 1.3,
              }}
            >
              N
            </span>
            <span
              style={{
                color: "#fff",
                fontFamily: "Arial, sans-serif",
                fontSize: 13,
                fontWeight: "bold",
                maxWidth: 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {title}
            </span>
          </div>
          <button
            onClick={() => { stopTicker(); onClose(); }}
            style={{
              background: "none",
              border: "1px solid #555",
              color: "#aaa",
              padding: "3px 14px",
              cursor: "pointer",
              fontSize: 12,
              borderRadius: 3,
              fontFamily: "Arial, sans-serif",
              flexShrink: 0,
            }}
          >
            ✕ Cerrar
          </button>
        </div>

        {/* ── Área de video (placeholder animado) ─────────────────────────── */}
        <div
          style={{
            width: "100%",
            paddingTop: "56.25%", // 16:9
            position: "relative",
            background: "radial-gradient(ellipse at 40% 50%, #1a1a2e 0%, #000 75%)",
            cursor: "pointer",
          }}
          onClick={togglePlay}
        >
          {/* Contenido interno */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {/* Título grande watermark */}
            <div
              style={{
                color: "rgba(255,255,255,0.06)",
                fontSize: 52,
                fontFamily: "Georgia, serif",
                fontWeight: "bold",
                letterSpacing: 4,
                textAlign: "center",
                padding: "0 24px",
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              {title.substring(0, 22)}
            </div>

            {/* Botón de play/pausa central */}
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: isPlaying ? "rgba(0,0,0,0.45)" : "rgba(204,0,0,0.85)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: isPlaying ? "none" : "0 0 28px rgba(204,0,0,0.5)",
                opacity: isPlaying && !showControls ? 0 : 1,
                transition: "opacity 0.3s, background 0.2s",
                pointerEvents: "none",
              }}
            >
              <span style={{ color: "#fff", fontSize: 26, paddingLeft: isPlaying ? 0 : 5 }}>
                {isPlaying ? "⏸" : "▶"}
              </span>
            </div>

            {/* Barras de ecualizador cuando está reproduciendo */}
            {isPlaying && (
              <div
                style={{
                  display: "flex",
                  gap: 3,
                  alignItems: "flex-end",
                  height: 20,
                  opacity: showControls ? 0.7 : 0.4,
                  transition: "opacity 0.3s",
                  pointerEvents: "none",
                }}
              >
                {[10, 18, 12, 20, 8, 16, 14].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      width: 4,
                      height: h,
                      background: "#cc0000",
                      borderRadius: 2,
                      animation: `eqBar 0.8s ease-in-out ${i * 0.1}s infinite alternate`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Controles (aparecen al hover o cuando pausado) ─────────────── */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%)",
              padding: "28px 14px 10px",
              opacity: showControls || !isPlaying ? 1 : 0,
              transition: "opacity 0.3s",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Barra de progreso */}
            <div
              onClick={seekTo}
              style={{
                height: 4,
                background: "rgba(255,255,255,0.25)",
                borderRadius: 2,
                marginBottom: 10,
                cursor: "pointer",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: `${progress * 100}%`,
                  height: "100%",
                  background: "#cc0000",
                  borderRadius: 2,
                  transition: "width 0.5s linear",
                }}
              />
              {/* Thumb */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: `${progress * 100}%`,
                  transform: "translate(-50%, -50%)",
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#cc0000",
                  boxShadow: "0 0 4px rgba(0,0,0,0.6)",
                }}
              />
            </div>

            {/* Fila de controles */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {/* Play/Pause */}
              <button onClick={togglePlay} style={ctrlBtnStyle} title="Play/Pause (Espacio)">
                {isPlaying ? "⏸" : "▶"}
              </button>

              {/* -10s / +10s */}
              <button onClick={() => skipTime(-10)} style={ctrlBtnStyle} title="-10 segundos (←)">
                ⏮ 10s
              </button>
              <button onClick={() => skipTime(10)} style={ctrlBtnStyle} title="+10 segundos (→)">
                10s ⏭
              </button>

              {/* Tiempo */}
              <span
                style={{
                  color: "#ccc",
                  fontSize: 11,
                  fontFamily: "Arial",
                  whiteSpace: "nowrap",
                  minWidth: 90,
                }}
              >
                {fmt(currentSec)} / {fmt(totalSec)}
              </span>

              <div style={{ flex: 1 }} />

              {/* Mute */}
              <button
                onClick={() => setIsMuted((v) => !v)}
                style={ctrlBtnStyle}
                title="Mute (M)"
              >
                {effectiveVolume === 0 ? "🔇" : effectiveVolume < 50 ? "🔉" : "🔊"}
              </button>

              {/* Volumen slider */}
              <input
                type="range"
                min={0}
                max={100}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolumeState(Number(e.target.value));
                  setIsMuted(false);
                }}
                style={{ width: 72, accentColor: "#cc0000", cursor: "pointer" }}
              />

              {/* Pantalla completa */}
              <button
                onClick={toggleFullscreen}
                style={ctrlBtnStyle}
                title="Pantalla completa (F)"
              >
                ⛶
              </button>
            </div>
          </div>
        </div>

        {/* ── Barra de atajos ──────────────────────────────────────────────── */}
        <div
          style={{
            background: "#111",
            padding: "7px 14px",
            borderTop: "1px solid #222",
          }}
        >
          <span
            style={{
              color: "#555",
              fontSize: 10,
              fontFamily: "Arial, sans-serif",
              letterSpacing: 0.3,
            }}
          >
            Espacio / K: play·pausa &nbsp;·&nbsp; ← →: ±10s &nbsp;·&nbsp; M: mute &nbsp;·&nbsp; F: pantalla completa &nbsp;·&nbsp; ESC: cerrar
          </span>
        </div>
      </div>

      {/* Animación del ecualizador */}
      <style>{`
        @keyframes eqBar {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const [activeGenre, setActiveGenre] = useState<Genre>("Drama");
  const [searchVal, setSearchVal] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [playingTitle, setPlayingTitle] = useState<string | null>(null);

  // ── Supabase helpers ──────────────────────────────────────────────────────
  const ensureUsuario = async (id: string, correo?: string) => {
    const { data, error } = await supabase
      .from("usuarios")
      .upsert([{ id, correo: correo ?? userEmail }], { onConflict: "id" });
    if (error) {
      console.error("Error upserting usuario:", error);
      return false;
    }
    console.log("Usuario upserted:", data);
    return true;
  };

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.warn("Error getting session:", error.message);
      if (!isMounted) return;

      const sessionUser = data?.session?.user;
      if (!sessionUser?.email || !sessionUser?.id) {
        router.push("/login");
        return;
      }
      setUserEmail(sessionUser.email);
      setUserId(sessionUser.id);
      setLoadingUser(false);
    }

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user?.email) { router.push("/login"); return; }
      setUserEmail(session.user.email);
      setUserId(session.user.id);
      setLoadingUser(false);
    });

    return () => {
      isMounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleWatchMovie = async (title: string) => {
    if (!userId) return;
    const ok = await ensureUsuario(userId, userEmail ?? undefined);
    if (!ok) {
      alert("No se pudo asegurar el usuario en la base de datos.");
      return;
    }
    const { error } = await supabase
      .from("historial_visualizacion")
      .insert([{ usuario_id: userId, titulo_pelicula: title }]);
    if (error) {
      console.warn("Error guardando historial:", error.message);
      alert("No se pudo guardar el historial.");
      return;
    }
    setPlayingTitle(title); // ← abre el modal
  };

  const handleAddFavorite = async (title: string) => {
    if (!userId) return;
    const ok = await ensureUsuario(userId, userEmail ?? undefined);
    if (!ok) {
      alert("No se pudo asegurar el usuario en la base de datos.");
      return;
    }
    const { error } = await supabase
      .from("favoritos")
      .insert([{ usuario_id: userId, titulo_pelicula: title }]);
    if (error) {
      if ((error as any)?.code === "23505") {
        alert("Esta película ya está en tus favoritos.");
        return;
      }
      console.warn("Error guardando favorito:", error.message);
      alert("No se pudo guardar el favorito.");
      return;
    }
    alert(`'${title}' se agregó a tus favoritos.`);
  };

  const displayName = userEmail ? userEmail.split("@")[0] : "Usuario";

  return (
    <div
      style={{
        background: "#cc0000",
        minHeight: "100vh",
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: 12,
      }}
    >
      {/* ── Video Modal ── */}
      {playingTitle && (
        <VideoModal
          title={playingTitle}
          onClose={() => setPlayingTitle(null)}
        />
      )}

      {/* ── Top Bar ── */}
      <div
        style={{
          background: "#cc0000",
          padding: "6px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontFamily: "'Georgia', serif",
            fontWeight: "bold",
            fontSize: 28,
            color: "#fff",
            letterSpacing: 3,
            textShadow: "1px 1px 0 #880000",
            border: "2px solid #fff",
            padding: "1px 6px",
          }}
        >
          NETFLIX
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center", color: "#fff", fontSize: 12 }}>
          <span style={{ cursor: "default", opacity: 0.95 }}>
            {loadingUser ? "Cargando usuario..." : `Bienvenido, ${displayName}`}
          </span>
          <span style={{ color: "#ffaaaa" }}>|</span>
          <span onClick={handleLogout} style={{ cursor: "pointer", textDecoration: "underline" }}>
            Cerrar sesión
          </span>
          <span style={{ color: "#ffaaaa" }}>|</span>
          <span style={{ cursor: "pointer" }}>🎁</span>
          <span style={{ cursor: "pointer", textDecoration: "underline" }}>Buy / Redeem Gift</span>
          <span style={{ color: "#ffaaaa" }}>|</span>
          <span style={{ cursor: "pointer", textDecoration: "underline" }}>Help</span>
        </div>
      </div>

      {/* ── Primary Nav ── */}
      <div
        style={{
          background: "#cc0000",
          padding: "0 12px",
          display: "flex",
          alignItems: "flex-end",
          gap: 2,
        }}
      >
        <NavTab label="Browse" />
        <NavTab label="Movies You'll" />
        <NavTab label="Friends" />
        <NavTab label="Queue" />
        <NavTab label="DVD Sale $5.99+" />
        <NavTab label="Watch Now" highlight />

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, paddingBottom: 3 }}>
          <input
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Movies, actors, genres, dire..."
            style={{
              width: 200,
              padding: "3px 6px",
              border: "1px solid #999",
              fontSize: 11,
              fontFamily: "Arial",
              color: "#666",
            }}
          />
          <button
            style={{
              background: "linear-gradient(to bottom, #4a6fa5, #2d4f7c)",
              border: "1px solid #1a4a7a",
              color: "#fff",
              padding: "3px 10px",
              fontSize: 12,
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </div>
      </div>

      {/* ── White Content Area ── */}
      <div style={{ background: "#fff" }}>

        {/* ── Secondary Nav ── */}
        <div
          style={{
            background: "#f0ebe0",
            borderBottom: "1px solid #ccc",
            display: "flex",
            alignItems: "center",
            padding: "0 2px",
          }}
        >
          <SecNav label="Home" active />
          <SecNav label="Genres" />
          <SecNav label="Top 25" />
          <SecNav label="Recent Additions" />
          <SecNav label="Help" />
        </div>

        {/* ── Hero Banner ── */}
        <div
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #2c2c2c 100%)",
            padding: "18px 24px",
            position: "relative",
            overflow: "hidden",
            minHeight: 90,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0, right: 0, bottom: 0,
              width: "60%",
              background: "linear-gradient(to right, transparent, rgba(20,20,40,0.7))",
            }}
          />
          <div style={{ position: "relative" }}>
            <h1
              style={{
                color: "#fff",
                fontSize: 22,
                fontWeight: "bold",
                margin: "0 0 10px",
                fontFamily: "Arial Black, Arial",
              }}
            >
              Watch Movies Instantly On Your PC
            </h1>
            <div style={{ display: "flex", gap: 12, alignItems: "center", color: "#ccc", fontSize: 12 }}>
              <span style={{ fontWeight: "bold", color: "#fff" }}>Instant Viewing</span>
              <span>•</span>
              <span style={{ fontWeight: "bold", color: "#fff" }}>Full-length Movies and TV Series</span>
              <span>•</span>
              <span style={{ fontWeight: "bold", color: "#fff" }}>Included in Your Membership</span>
            </div>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div style={{ display: "flex", gap: 0 }}>

          {/* ── Center Content ── */}
          <div style={{ flex: 1, padding: 8 }}>

            {/* Suggestions For You */}
            <div style={{ border: "1px solid #99aacc", background: "#eef2fa", marginBottom: 8 }}>
              <SectionHeader title="Suggestions For You" />
              <div style={{ display: "flex", gap: 16, padding: "8px 12px 12px" }}>
                {suggestions.map((m) => (
                  <PosterCard
                    key={m.id}
                    movie={m}
                    width={110}
                    height={140}
                    onPlay={handleWatchMovie}
                    onFavorite={handleAddFavorite}
                  />
                ))}
              </div>
              <MoreLink label="More Suggestions For You" />
              <div style={{ height: 6 }} />
            </div>

            {/* Recently Viewed + DVD Queue */}
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>

              {/* Recently Viewed */}
              <div style={{ flex: 1, border: "1px solid #99aacc", background: "#eef2fa" }}>
                <SectionHeader title="Recently Viewed" />
                <div style={{ padding: "8px 12px" }}>
                  {recentlyViewed.map((m) => (
                    <div key={m.id}>
                      <div
                        style={{
                          color: "#336699",
                          fontSize: 12,
                          cursor: "pointer",
                          marginBottom: 6,
                          lineHeight: 1.4,
                        }}
                        onClick={() => handleWatchMovie(m.title)}
                      >
                        {m.title}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button
                          onClick={() => handleWatchMovie(m.title)}
                          style={{
                            background: "linear-gradient(to bottom, #5a9fd4, #2a6496)",
                            border: "1px solid #1a4a7a",
                            borderRadius: 3,
                            color: "#fff",
                            fontSize: 11,
                            fontWeight: "bold",
                            padding: "2px 10px",
                            cursor: "pointer",
                          }}
                        >
                          Play
                        </button>
                        <StarRating rating={m.rating} size={14} />
                      </div>
                    </div>
                  ))}
                </div>
                <MoreLink label="Your Viewing History" />
                <div style={{ height: 6 }} />
              </div>

              {/* From Your DVD Queue */}
              <div style={{ flex: 1, border: "1px solid #99aacc", background: "#eef2fa" }}>
                <SectionHeader title="From Your DVD Queue" />
                <div style={{ display: "flex", gap: 16, padding: "8px 12px 8px", justifyContent: "center" }}>
                  {dvdQueue.map((m) => (
                    <PosterCard
                      key={m.id}
                      movie={m}
                      width={100}
                      height={120}
                      onPlay={handleWatchMovie}
                      onFavorite={handleAddFavorite}
                    />
                  ))}
                </div>
                <MoreLink label="More From Your DVD Queue" />
                <div style={{ height: 6 }} />
              </div>
            </div>

            {/* Genre Tabs */}
            <div style={{ border: "1px solid #99aacc", background: "#eef2fa" }}>
              <div style={{ display: "flex", borderBottom: "1px solid #99aacc", background: "#dce6f0" }}>
                {genres.map((g) => (
                  <div
                    key={g}
                    onClick={() => setActiveGenre(g)}
                    style={{
                      padding: "5px 16px",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: activeGenre === g ? "bold" : "normal",
                      background: activeGenre === g ? "#eef2fa" : "transparent",
                      borderRight: "1px solid #99aacc",
                      color: "#333",
                      borderBottom: activeGenre === g ? "1px solid #eef2fa" : "none",
                      marginBottom: activeGenre === g ? -1 : 0,
                      zIndex: activeGenre === g ? 1 : 0,
                      position: "relative",
                    }}
                  >
                    {g}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 16, padding: "10px 14px 12px" }}>
                {byGenre[activeGenre].map((m) => (
                  <PosterCard
                    key={m.id}
                    movie={m}
                    width={110}
                    height={140}
                    onPlay={handleWatchMovie}
                    onFavorite={handleAddFavorite}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div style={{ width: 180, borderLeft: "1px solid #ccc", flexShrink: 0 }}>

            {/* Video Quality Widget */}
            <div
              style={{
                background: "#f5f5f5",
                borderBottom: "1px solid #ccc",
                padding: "10px 12px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 8, color: "#333" }}>
                Your Video Quality
              </div>
              <div
                style={{
                  background: "#333",
                  borderRadius: 4,
                  padding: 10,
                  display: "inline-flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  marginBottom: 6,
                }}
              >
                <div style={{ display: "flex", gap: 3, alignItems: "flex-end" }}>
                  <div style={{ width: 6, height: 10, background: "#4a9fd4" }} />
                  <div style={{ width: 6, height: 16, background: "#4a9fd4" }} />
                  <div style={{ width: 6, height: 10, background: "#555" }} />
                </div>
                <span style={{ color: "#fff", fontSize: 11 }}>Good</span>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#336699",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                How your Internet speed affects video quality &gt;
              </div>
            </div>

            {/* Browse Sidebar */}
            <div style={{ background: "#fff", borderBottom: "1px solid #ccc" }}>
              <div
                style={{
                  background: "#dce6f0",
                  padding: "4px 8px",
                  fontSize: 13,
                  fontWeight: "bold",
                  borderBottom: "1px solid #ccc",
                  color: "#333",
                }}
              >
                Browse
              </div>

              <div style={{ padding: "6px 0 4px" }}>
                <div
                  style={{
                    fontSize: 11, fontWeight: "bold", color: "#555",
                    padding: "2px 8px 4px", background: "#e8e8e8", margin: "0 0 4px",
                  }}
                >
                  All Watch Now by:
                </div>
                <SideLink label="Title" />
                <SideLink label="Star Rating" />
              </div>

              <div style={{ padding: "0 0 4px" }}>
                <div
                  style={{
                    fontSize: 11, fontWeight: "bold", color: "#555",
                    padding: "2px 8px 4px", background: "#e8e8e8", margin: "0 0 4px",
                  }}
                >
                  Favorite Genres:
                </div>
                {sideGenres.map((g) => <SideLink key={g} label={g} />)}
              </div>

              <div style={{ padding: "0 0 4px" }}>
                <div
                  style={{
                    fontSize: 11, fontWeight: "bold", color: "#555",
                    padding: "2px 8px 4px", background: "#e8e8e8", margin: "0 0 4px",
                  }}
                >
                  Other Genres:
                </div>
                {otherGenres.map((g) => <SideLink key={g} label={g} />)}
              </div>

              <div style={{ padding: "0 0 4px" }}>
                <div
                  style={{
                    fontSize: 11, fontWeight: "bold", color: "#555",
                    padding: "2px 8px 4px", background: "#e8e8e8", margin: "0 0 4px",
                  }}
                >
                  Guides:
                </div>
                <SideLink label="By Studio" />
                <SideLink label="By Television Network" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div
          style={{
            background: "#cc0000",
            padding: "10px 16px",
            display: "flex",
            justifyContent: "center",
            gap: 16,
          }}
        >
          {["Terms of Use", "Privacy Policy", "Help", "Contact Us"].map((l) => (
            <span
              key={l}
              style={{
                color: "#ffcccc",
                fontSize: 11,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}