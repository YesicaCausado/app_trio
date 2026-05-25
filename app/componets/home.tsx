"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

// ── Types ──────────────────────────────────────────────────────────────────
interface Movie {
  id: number;
  title: string;
  rating: number;
  color: string; // placeholder poster color
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
  "Sci-Fi & Fantasy", "Thrillers"
];

const otherGenres = [
  "Anime & Animation", "Children & Family", "Classics", "Documentary",
  "Gay & Lesbian", "Horror", "Romance", "Sports & Fitness", "Television"
];

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

// ── Poster Card ───────────────────────────────────────────────────────────
function PosterCard({
  movie,
  showRating = true,
  width = 100,
  height = 130,
}: {
  movie: Movie;
  showRating?: boolean;
  width?: number;
  height?: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ textAlign: "center", width }}>
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
      >
        {movie.title}
      </div>
      {/* Poster placeholder */}
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
        }}
      >
        <div style={{
          width: "80%",
          height: "80%",
          border: `2px solid ${movie.accent}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 6,
        }}>
          <span style={{
            color: movie.accent,
            fontSize: 9,
            textAlign: "center",
            fontFamily: "Georgia, serif",
            fontWeight: "bold",
            lineHeight: 1.3,
          }}>
            {movie.title}
          </span>
        </div>
      </div>
      {/* Play button */}
      <div style={{ marginBottom: showRating ? 4 : 0 }}>
        <button style={{
          background: "linear-gradient(to bottom, #5a9fd4, #2a6496)",
          border: "1px solid #1a4a7a",
          borderRadius: 3,
          color: "#fff",
          fontSize: 11,
          fontWeight: "bold",
          padding: "2px 14px",
          cursor: "pointer",
          fontFamily: "Arial, sans-serif",
        }}>
          Play
        </button>
      </div>
      {showRating && <StarRating rating={movie.rating} size={14} />}
    </div>
  );
}

// ── Section Header ─────────────────────────────────────────────────────────
function SectionHeader({ title }: { title: string }) {
  return (
    <div style={{
      background: "linear-gradient(to bottom, #4a6fa5, #2d4f7c)",
      color: "#fff",
      fontSize: 13,
      fontWeight: "bold",
      padding: "4px 8px",
      marginBottom: 8,
      fontFamily: "Arial, sans-serif",
    }}>
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
        color: highlight ? "#fff" : active ? "#333" : "#333",
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

// ── Main App ───────────────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter()
  const [activeGenre, setActiveGenre] = useState<Genre>("Drama");
  const [searchVal, setSearchVal] = useState("");

  return (
    <div style={{
      background: "#cc0000",
      minHeight: "100vh",
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize: 12,
    }}>

      {/* ── Top Bar ── */}
      <div style={{
        background: "#cc0000",
        padding: "6px 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        {/* Logo */}
        <div style={{
          fontFamily: "'Georgia', serif",
          fontWeight: "bold",
          fontSize: 28,
          color: "#fff",
          letterSpacing: 3,
          textShadow: "1px 1px 0 #880000",
          border: "2px solid #fff",
          padding: "1px 6px",
        }}>
          NETFLIX
        </div>

        {/* Top-right links */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", color: "#fff", fontSize: 12 }}>
          <span style={{ cursor: "pointer" }}>Calvin Koo ▼</span>
          <span style={{ color: "#ffaaaa" }}>|</span>
          <span onClick={() => router.push('/login')} style={{ cursor: "pointer", textDecoration: "underline" }}>Login</span>
          <span style={{ color: "#ffaaaa" }}>|</span>
          <span style={{ cursor: "pointer" }}>🎁</span>
          <span style={{ cursor: "pointer", textDecoration: "underline" }}>Buy / Redeem Gift</span>
          <span style={{ color: "#ffaaaa" }}>|</span>
          <span style={{ cursor: "pointer", textDecoration: "underline" }}>Help</span>
        </div>
      </div>

      {/* ── Primary Nav ── */}
      <div style={{
        background: "#cc0000",
        padding: "0 12px",
        display: "flex",
        alignItems: "flex-end",
        gap: 2,
      }}>
        <NavTab label="Browse" />
        <NavTab label="Movies You'll" />
        <NavTab label="Friends" />
        <NavTab label="Queue" />
        <NavTab label="DVD Sale $5.99+" />
        <NavTab label="Watch Now" highlight />

        {/* Search bar */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, paddingBottom: 3 }}>
          <input
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
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
          <button style={{
            background: "linear-gradient(to bottom, #4a6fa5, #2d4f7c)",
            border: "1px solid #1a4a7a",
            color: "#fff",
            padding: "3px 10px",
            fontSize: 12,
            fontWeight: "bold",
            cursor: "pointer",
          }}>
            Search
          </button>
        </div>
      </div>

      {/* ── White Content Area ── */}
      <div style={{ background: "#fff", margin: "0 0" }}>

        {/* ── Secondary Nav ── */}
        <div style={{
          background: "#f0ebe0",
          borderBottom: "1px solid #ccc",
          display: "flex",
          alignItems: "center",
          padding: "0 2px",
        }}>
          <SecNav label="Home" active />
          <SecNav label="Genres" />
          <SecNav label="Top 25" />
          <SecNav label="Recent Additions" />
          <SecNav label="Help" />
        </div>

        {/* ── Hero Banner ── */}
        <div style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #2c2c2c 100%)",
          padding: "18px 24px",
          position: "relative",
          overflow: "hidden",
          minHeight: 90,
        }}>
          <div style={{
            position: "absolute", top: 0, right: 0, bottom: 0,
            width: "60%",
            background: "linear-gradient(to right, transparent, rgba(20,20,40,0.7))",
          }} />
          <div style={{ position: "relative" }}>
            <h1 style={{
              color: "#fff",
              fontSize: 22,
              fontWeight: "bold",
              margin: "0 0 10px",
              fontFamily: "Arial Black, Arial",
            }}>
              Watch Movies Instantly On Your PC
            </h1>
            <div style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              color: "#ccc",
              fontSize: 12,
            }}>
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

          {/* ── Left / Center Content ── */}
          <div style={{ flex: 1, padding: "8px 8px 8px 8px" }}>

            {/* Suggestions For You */}
            <div style={{
              border: "1px solid #99aacc",
              background: "#eef2fa",
              marginBottom: 8,
            }}>
              <SectionHeader title="Suggestions For You" />
              <div style={{
                display: "flex",
                gap: 16,
                padding: "8px 12px 12px",
                justifyContent: "flex-start",
              }}>
                {suggestions.map(m => (
                  <PosterCard key={m.id} movie={m} width={110} height={140} />
                ))}
              </div>
              <MoreLink label="More Suggestions For You" />
              <div style={{ height: 6 }} />
            </div>

            {/* Row: Recently Viewed + DVD Queue */}
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>

              {/* Recently Viewed */}
              <div style={{
                flex: 1,
                border: "1px solid #99aacc",
                background: "#eef2fa",
              }}>
                <SectionHeader title="Recently Viewed" />
                <div style={{ padding: "8px 12px" }}>
                  {recentlyViewed.map(m => (
                    <div key={m.id}>
                      <div style={{
                        color: "#336699",
                        fontSize: 12,
                        cursor: "pointer",
                        marginBottom: 6,
                        lineHeight: 1.4,
                      }}>
                        {m.title}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button style={{
                          background: "linear-gradient(to bottom, #5a9fd4, #2a6496)",
                          border: "1px solid #1a4a7a",
                          borderRadius: 3,
                          color: "#fff",
                          fontSize: 11,
                          fontWeight: "bold",
                          padding: "2px 10px",
                          cursor: "pointer",
                        }}>Play</button>
                        <StarRating rating={m.rating} size={14} />
                      </div>
                    </div>
                  ))}
                </div>
                <MoreLink label="Your Viewing History" />
                <div style={{ height: 6 }} />
              </div>

              {/* From Your DVD Queue */}
              <div style={{
                flex: 1,
                border: "1px solid #99aacc",
                background: "#eef2fa",
              }}>
                <SectionHeader title="From Your DVD Queue" />
                <div style={{
                  display: "flex",
                  gap: 16,
                  padding: "8px 12px 8px",
                  justifyContent: "center",
                }}>
                  {dvdQueue.map(m => (
                    <PosterCard key={m.id} movie={m} width={100} height={120} />
                  ))}
                </div>
                <MoreLink label="More From Your DVD Queue" />
                <div style={{ height: 6 }} />
              </div>
            </div>

            {/* Genre Tabs */}
            <div style={{ border: "1px solid #99aacc", background: "#eef2fa" }}>
              <div style={{
                display: "flex",
                borderBottom: "1px solid #99aacc",
                background: "#dce6f0",
              }}>
                {genres.map(g => (
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

              <div style={{
                display: "flex",
                gap: 16,
                padding: "10px 14px 12px",
              }}>
                {byGenre[activeGenre].map(m => (
                  <PosterCard key={m.id} movie={m} width={110} height={140} />
                ))}
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div style={{ width: 180, borderLeft: "1px solid #ccc", flexShrink: 0 }}>

            {/* Video Quality Widget */}
            <div style={{
              background: "#f5f5f5",
              borderBottom: "1px solid #ccc",
              padding: "10px 12px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: 12, fontWeight: "bold", marginBottom: 8, color: "#333" }}>
                Your Video Quality
              </div>
              <div style={{
                background: "#333",
                borderRadius: 4,
                padding: "10px",
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                marginBottom: 6,
              }}>
                <div style={{ display: "flex", gap: 3, alignItems: "flex-end" }}>
                  <div style={{ width: 6, height: 10, background: "#4a9fd4" }} />
                  <div style={{ width: 6, height: 16, background: "#4a9fd4" }} />
                  <div style={{ width: 6, height: 10, background: "#555" }} />
                </div>
                <span style={{ color: "#fff", fontSize: 11 }}>Good</span>
              </div>
              <div style={{ fontSize: 11, color: "#336699", cursor: "pointer", textDecoration: "underline" }}>
                How your Internet speed affects video quality &gt;
              </div>
            </div>

            {/* Browse Sidebar */}
            <div style={{ background: "#fff", borderBottom: "1px solid #ccc" }}>
              <div style={{
                background: "#dce6f0",
                padding: "4px 8px",
                fontSize: 13,
                fontWeight: "bold",
                borderBottom: "1px solid #ccc",
                color: "#333",
              }}>
                Browse
              </div>

              <div style={{ padding: "6px 0 4px" }}>
                <div style={{
                  fontSize: 11,
                  fontWeight: "bold",
                  color: "#555",
                  padding: "2px 8px 4px",
                  background: "#e8e8e8",
                  margin: "0 0 4px",
                }}>
                  All Watch Now by:
                </div>
                <SideLink label="Title" />
                <SideLink label="Star Rating" />
              </div>

              <div style={{ padding: "0 0 4px" }}>
                <div style={{
                  fontSize: 11,
                  fontWeight: "bold",
                  color: "#555",
                  padding: "2px 8px 4px",
                  background: "#e8e8e8",
                  margin: "0 0 4px",
                }}>
                  Favorite Genres:
                </div>
                {sideGenres.map(g => <SideLink key={g} label={g} />)}
              </div>

              <div style={{ padding: "0 0 4px" }}>
                <div style={{
                  fontSize: 11,
                  fontWeight: "bold",
                  color: "#555",
                  padding: "2px 8px 4px",
                  background: "#e8e8e8",
                  margin: "0 0 4px",
                }}>
                  Other Genres:
                </div>
                {otherGenres.map(g => <SideLink key={g} label={g} />)}
              </div>

              <div style={{ padding: "0 0 4px" }}>
                <div style={{
                  fontSize: 11,
                  fontWeight: "bold",
                  color: "#555",
                  padding: "2px 8px 4px",
                  background: "#e8e8e8",
                  margin: "0 0 4px",
                }}>
                  Guides:
                </div>
                <SideLink label="By Studio" />
                <SideLink label="By Television Network" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{
          background: "#cc0000",
          padding: "10px 16px",
          display: "flex",
          justifyContent: "center",
          gap: 16,
          marginTop: 0,
        }}>
          {['Terms of Use', 'Privacy Policy', 'Help', 'Contact Us'].map(l => (
            <span key={l} style={{
              color: "#ffcccc",
              fontSize: 11,
              cursor: "pointer",
              textDecoration: "underline",
            }}>
              {l}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
