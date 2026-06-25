// import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";

/* ─── responsive hook ─────────────────────────────────────────── */
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < breakpoint,
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);
  return isMobile;
}

/* ─── keyframe CSS injected once ──────────────────────────────── */
const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes pulseGlow {
    0%, 100% { opacity: 0.6; transform: translateX(-50%) scale(1); }
    50%       { opacity: 1;   transform: translateX(-50%) scale(1.12); }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.3; }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes scanBeam {
    0%   { top: 20px;              opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    100% { top: calc(100% - 20px); opacity: 0; }
  }
  @keyframes alertPop {
    from { opacity: 0; transform: scale(0.95); }
    to   { opacity: 1; transform: scale(1); }
  }

  /* hover states (can't do in inline styles) */
  .als-feature-card:hover {
    background: rgba(255,255,255,0.06) !important;
    border-color: rgba(34,197,94,0.3) !important;
    transform: translateY(-3px);
  }
  .als-btn-primary:hover  { background: #16a34a !important; transform: translateY(-1px); }
  .als-btn-secondary:hover { border-color: rgba(240,253,244,0.4) !important; color: #f0fdf4 !important; }
  .als-nav-btn:hover { background: rgba(34,197,94,0.22) !important; border-color: rgba(34,197,94,0.6) !important; }
  .als-footer-link:hover { text-decoration: underline; }

  /* reduced-motion: kill all animations */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation: none !important; transition: none !important; }
  }
`;

/* ─── feature data ─────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: "📷",
    title: "Instant Label Scan",
    desc: "Point your camera at any food label and get a full allergen breakdown in under 2 seconds.",
  },
  {
    icon: "👤",
    title: "Your Allergy Profile",
    desc: "Set up your personal allergens once. AllerScan flags only what matters to you.",
  },
  {
    icon: "🔔",
    title: "Smart Alerts",
    desc: "Clear red and green signals — no jargon, no guesswork. Safe or not safe, right away.",
  },
];

const STATS = [
  { num: "500+", label: "Allergens tracked" },
  { num: "<2s", label: "Scan time" },
  { num: "99.2%", label: "Accuracy rate" },
];

/* ─── component ────────────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile(640);
  const px = isMobile ? "20px" : "40px"; // horizontal gutter

  /* inject keyframes once */
  useEffect(() => {
    if (document.getElementById("als-kf")) return;
    const tag = document.createElement("style");
    tag.id = "als-kf";
    tag.textContent = KEYFRAMES;
    document.head.appendChild(tag);
    return () => document.getElementById("als-kf")?.remove();
  }, []);

  /* ── shared tokens ── */
  const green = "#22c55e";
  const greenLight = "#4ade80";
  const darkBg = "#0a1f0f";
  const cardBg = "#111f14";
  const textMain = "#f0fdf4";

  return (
    <div
      style={{
        fontFamily: "'Inter',-apple-system,sans-serif",
        background: darkBg,
        color: textMain,
        minHeight: "100vh",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {/* ambient glow – smaller on mobile */}
      <div
        style={{
          position: "absolute",
          borderRadius: "50%",
          pointerEvents: "none",
          width: isMobile ? "320px" : "600px",
          height: isMobile ? "320px" : "600px",
          background:
            "radial-gradient(circle,rgba(34,197,94,0.12) 0%,transparent 70%)",
          top: "-80px",
          left: "50%",
          transform: "translateX(-50%)",
          animation: "pulseGlow 4s ease-in-out infinite",
        }}
      />

      {/* ── NAV ── */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: `16px ${px}`,
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: 34,
              height: 34,
              background: green,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              color: darkBg,
              fontWeight: 700,
            }}
          >
            ⬡
          </div>
          <span
            style={{
              fontSize: isMobile ? 17 : 20,
              fontWeight: 700,
              color: textMain,
              letterSpacing: "-0.5px",
            }}
          >
            Aller<span style={{ color: green }}>Scan</span>
          </span>
        </div>
        <button
          className="als-nav-btn"
          onClick={() => navigate("/signup")}
          style={{
            background: "rgba(34,197,94,0.12)",
            border: "1px solid rgba(34,197,94,0.3)",
            color: greenLight,
            padding: isMobile ? "7px 16px" : "9px 22px",
            borderRadius: "100px",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s",
            fontFamily: "inherit",
          }}
        >
          Get started →
        </button>
      </nav>

      {/* ── HERO ── */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: `${isMobile ? "40px" : "60px"} ${px} 40px`,
          position: "relative",
          zIndex: 5,
        }}
      >
        {/* live badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.25)",
            color: greenLight,
            fontSize: 12,
            fontWeight: 500,
            padding: "6px 14px",
            borderRadius: "100px",
            marginBottom: 24,
            animation: "fadeUp 0.6s ease both",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              background: green,
              borderRadius: "50%",
              animation: "blink 1.5s ease-in-out infinite",
              display: "inline-block",
            }}
          />
          AI-powered allergy detection
        </div>

        {/* headline */}
        <h1
          style={{
            fontSize: isMobile
              ? "clamp(28px,8vw,36px)"
              : "clamp(36px,4.5vw,52px)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-1.5px",
            color: textMain,
            maxWidth: 580,
            marginBottom: 18,
            animation: "fadeUp 0.6s 0.1s ease both",
            opacity: 0,
          }}
        >
          Know what's in your food.{" "}
          <em style={{ color: green, fontStyle: "normal" }}>Instantly.</em>
        </h1>

        {/* subtext */}
        <p
          style={{
            fontSize: isMobile ? 15 : 17,
            color: "rgba(240,253,244,0.6)",
            maxWidth: 420,
            lineHeight: 1.65,
            marginBottom: 32,
            animation: "fadeUp 0.6s 0.2s ease both",
            opacity: 0,
          }}
        >
          Scan any ingredient label and get a real-time allergy alert — tailored
          to your personal allergy profile.
        </p>

        {/* CTA buttons */}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexDirection: isMobile ? "column" : "row",
            width: isMobile ? "100%" : "auto",
            maxWidth: isMobile ? 320 : "none",
            animation: "fadeUp 0.6s 0.3s ease both",
            marginBottom: 56,
            opacity: 0,
          }}
        >
          <button
            className="als-btn-primary"
            onClick={() => navigate("/signup")}
            style={{
              background: green,
              color: darkBg,
              border: "none",
              padding: "14px 32px",
              borderRadius: "100px",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s",
              width: isMobile ? "100%" : "auto",
            }}
          >
            Get Started Free
          </button>
          <button
            className="als-btn-secondary"
            onClick={() => navigate("/login")}
            style={{
              background: "transparent",
              color: "rgba(240,253,244,0.7)",
              border: "1px solid rgba(240,253,244,0.2)",
              padding: "14px 28px",
              borderRadius: "100px",
              fontSize: 15,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s",
              width: isMobile ? "100%" : "auto",
            }}
          >
            Sign in
          </button>
        </div>

        {/* ── SCANNER WIDGET ── */}
        <div
          style={{
            animation: "fadeUp 0.6s 0.4s ease both",
            opacity: 0,
            marginBottom: 64,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: isMobile ? "min(280px, 90vw)" : "280px",
              background: cardBg,
              border: "1px solid rgba(34,197,94,0.2)",
              borderRadius: 20,
              padding: 20,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* scan beam */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                height: 2,
                background:
                  "linear-gradient(90deg,transparent,#22c55e,transparent)",
                boxShadow: "0 0 12px #22c55e",
                animation: "scanBeam 2.2s ease-in-out infinite",
              }}
            />

            {/* corner brackets */}
            {[
              {
                top: 12,
                left: 12,
                borderTopWidth: 2,
                borderLeftWidth: 2,
                borderRadius: "4px 0 0 0",
              },
              {
                top: 12,
                right: 12,
                borderTopWidth: 2,
                borderRightWidth: 2,
                borderRadius: "0 4px 0 0",
              },
              {
                bottom: 12,
                left: 12,
                borderBottomWidth: 2,
                borderLeftWidth: 2,
                borderRadius: "0 0 0 4px",
              },
              {
                bottom: 12,
                right: 12,
                borderBottomWidth: 2,
                borderRightWidth: 2,
                borderRadius: "0 0 4px 0",
              },
            ].map((pos, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: 20,
                  height: 20,
                  borderColor: green,
                  borderStyle: "solid",
                  borderWidth: 0,
                  ...pos,
                }}
              />
            ))}

            {/* ingredient lines */}
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "rgba(240,253,244,0.5)",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Ingredients
            </div>
            {["100%", "80%", "90%", "60%", "100%", "70%"].map((w, i) => (
              <div
                key={i}
                style={{
                  height: 8,
                  borderRadius: 4,
                  marginBottom: 8,
                  background: "rgba(240,253,244,0.08)",
                  width: w,
                }}
              />
            ))}

            {/* alerts */}
            <div
              style={{
                marginTop: 16,
                padding: "10px 12px",
                background: "rgba(220,38,38,0.15)",
                border: "1px solid rgba(220,38,38,0.3)",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                gap: 8,
                animation: "alertPop 0.3s 2.2s ease both",
                opacity: 0,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  background: "#f87171",
                  borderRadius: "50%",
                  flexShrink: 0,
                  display: "inline-block",
                  animation: "blink 1s ease-in-out infinite",
                }}
              />
              <span style={{ fontSize: 12, color: "#fca5a5", fontWeight: 500 }}>
                Contains peanuts — allergen detected
              </span>
            </div>
            <div
              style={{
                marginTop: 8,
                padding: "10px 12px",
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.25)",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                gap: 8,
                animation: "alertPop 0.3s 2.5s ease both",
                opacity: 0,
              }}
            >
              <span style={{ fontSize: 14, color: greenLight }}>✓</span>
              <span style={{ fontSize: 12, color: "#86efac", fontWeight: 500 }}>
                No gluten ingredients found
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* divider */}
      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg,transparent,rgba(34,197,94,0.15),transparent)",
          margin: "0 0 52px",
        }}
      />

      {/* ── FEATURES ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)",
          gap: 16,
          padding: `0 ${px}`,
          marginBottom: 56,
          position: "relative",
          zIndex: 5,
          animation: "fadeUp 0.6s 0.5s ease both",
          opacity: 0,
        }}
      >
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="als-feature-card"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(34,197,94,0.12)",
              borderRadius: 16,
              padding: "22px 18px",
              transition: "all 0.2s",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                background: "rgba(34,197,94,0.12)",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                marginBottom: 12,
              }}
            >
              {f.icon}
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: textMain,
                marginBottom: 8,
              }}
            >
              {f.title}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "rgba(240,253,244,0.45)",
                lineHeight: 1.6,
              }}
            >
              {f.desc}
            </div>
          </div>
        ))}
      </div>

      {/* ── STATS ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "repeat(3,1fr)"
            : "auto 1px auto 1px auto",
          alignItems: "center",
          justifyContent: "center",
          gap: isMobile ? "12px" : "48px",
          padding: `0 ${px} 56px`,
          animation: "fadeUp 0.6s 0.6s ease both",
          opacity: 0,
          position: "relative",
          zIndex: 5,
        }}
      >
        {STATS.map((s, i) => (
          <React.Fragment key={s.label}>
            <div style={{ textAlign: "center" }}>
              <span
                style={{
                  fontSize: isMobile ? 24 : 32,
                  fontWeight: 800,
                  color: green,
                  letterSpacing: "-1px",
                  display: "block",
                }}
              >
                {s.num}
              </span>

              <div
                style={{
                  fontSize: isMobile ? 11 : 13,
                  color: "rgba(240,253,244,0.45)",
                  marginTop: 4,
                }}
              >
                {s.label}
              </div>
            </div>

            {!isMobile && i < STATS.length - 1 && (
              <div
                style={{
                  width: 1,
                  height: 40,
                  background: "rgba(34,197,94,0.15)",
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── FOOTER CTA ── */}
      <div
        style={{
          textAlign: "center",
          padding: `0 ${px} 56px`,
          position: "relative",
          zIndex: 5,
          animation: "fadeUp 0.6s 0.7s ease both",
          opacity: 0,
        }}
      >
        <button
          className="als-btn-primary"
          onClick={() => navigate("/signup")}
          style={{
            background: green,
            color: darkBg,
            border: "none",
            padding: "14px 32px",
            borderRadius: "100px",
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s",
            width: isMobile ? "100%" : "auto",
            maxWidth: isMobile ? 320 : "none",
          }}
        >
          Create your free account
        </button>
        <p
          style={{
            fontSize: 13,
            color: "rgba(240,253,244,0.35)",
            marginTop: 14,
          }}
        >
          Already have an account?{" "}
          <button
            className="als-footer-link"
            onClick={() => navigate("/login")}
            style={{
              color: greenLight,
              background: "none",
              border: "none",
              fontFamily: "inherit",
              fontSize: 13,
              padding: 0,
              cursor: "pointer",
            }}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
