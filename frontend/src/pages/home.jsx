import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulseGlow {
    0%, 100% { opacity: 0.4; }
    50%       { opacity: 0.8; }
  }

  .h-logout:hover {
    background: rgba(220,38,38,0.1) !important;
    border-color: rgba(220,38,38,0.3) !important;
    color: #fca5a5 !important;
  }
  .h-scan-btn:hover  { background: #16a34a !important; transform: translateY(-1px); }
  .h-scan-btn:active { transform: translateY(0); }

  .h-quick:hover {
    background: rgba(34,197,94,0.06) !important;
    border-color: rgba(34,197,94,0.3) !important;
  }
  .h-add-btn:hover { background: rgba(34,197,94,0.18) !important; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation: none !important; transition: none !important; }
  }
`;

const QUICK_ACTIONS = [
  {
    label: "Manage allergies",
    sub: "Add or remove items",
    route: "/allergies",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#22c55e"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    label: "Scan history",
    sub: "See past results",
    route: "/history",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#22c55e"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const nutritionFacts = [
    "Many packaged foods use 'contains' labels, but may-contain warnings are voluntary.",
    "Ingredients are listed in descending order by weight.",
    "A product labeled 'fat-free' can still contain sugar.",
    "Whole grain products are generally richer in fiber than refined grain products.",
    "High sodium intake is linked to increased blood pressure.",
    "Artificial colors and flavors are not necessarily unhealthy, but some people prefer to avoid them.",
    "A serving size may be much smaller than what people actually consume.",
    "Added sugars are different from naturally occurring sugars in fruits and milk.",
    "Even vegan products can contain allergens such as soy, wheat, or nuts.",
    "Checking ingredient lists is often more informative than looking only at calories.",
  ];

  const [factIndex, setFactIndex] = useState(0);

  const nextFact = () => {
    setFactIndex((prev) => (prev + 1) % nutritionFacts.length);
  };

  useEffect(() => {
    if (document.getElementById("als-home-kf")) return;
    const tag = document.createElement("style");
    tag.id = "als-home-kf";
    tag.textContent = KEYFRAMES;
    document.head.appendChild(tag);
    return () => document.getElementById("als-home-kf")?.remove();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          navigate("/");
          return;
        }
        const res = await API.get(`/user/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.error(err);
        navigate("/");
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    navigate("/");
  };

  if (!user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a1f0f",
          fontFamily: "'Inter', sans-serif",
          color: "rgba(240,253,244,0.5)",
          fontSize: "15px",
        }}
      >
        Loading…
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a1f0f",
        fontFamily: "'Inter', -apple-system, sans-serif",
        color: "#f0fdf4",
        paddingBottom: "60px",
      }}
    >
      {/* ── Top bar ── */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "28px 24px 32px",
          borderBottom: "1px solid rgba(34,197,94,0.12)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        {/* glow */}
        <div
          style={{
            position: "absolute",
            width: "320px",
            height: "320px",
            background:
              "radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)",
            top: "-100px",
            left: "50%",
            transform: "translateX(-50%)",
            borderRadius: "50%",
            pointerEvents: "none",
            animation: "pulseGlow 4s ease-in-out infinite",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* avatar + greeting */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "50%",
                background: "rgba(34,197,94,0.18)",
                border: "1.5px solid rgba(34,197,94,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                fontWeight: 700,
                color: "#4ade80",
                flexShrink: 0,
              }}
            >
              {getInitials(user.name)}
            </div>
            <div>
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  letterSpacing: "-0.4px",
                  margin: 0,
                }}
              >
                {getGreeting()}, {user.name.split(" ")[0]}!
              </p>
              <p
                style={{
                  fontSize: "13px",
                  color: "rgba(240,253,244,0.4)",
                  margin: "2px 0 0",
                }}
              >
                {formatDate()}
              </p>
            </div>
          </div>
          {/* logout */}
          <button
            className="h-logout"
            onClick={handleLogout}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(240,253,244,0.12)",
              color: "rgba(240,253,244,0.5)",
              borderRadius: "10px",
              padding: "8px 14px",
              fontSize: "12px",
              fontFamily: "inherit",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Sign out
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div
        style={{ padding: "24px 24px 0", maxWidth: "600px", margin: "0 auto" }}
      >
        {/* Allergies stat — single card, full width */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(34,197,94,0.12)",
            borderRadius: "14px",
            padding: "20px",
            marginBottom: "24px",
            animation: "fadeUp 0.5s ease both",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "rgba(34,197,94,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#22c55e"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <div
              style={{
                fontSize: "30px",
                fontWeight: 800,
                color: "#f0fdf4",
                lineHeight: 1,
              }}
            >
              {user.allergies.length}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "rgba(240,253,244,0.4)",
                marginTop: "4px",
              }}
            >
              Allergies tracked
            </div>
          </div>
        </div>

        {/* Scan CTA */}
        <button
          className="h-scan-btn"
          onClick={() => navigate("/scan")}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "14px",
            background: "#22c55e",
            color: "#0a1f0f",
            border: "none",
            fontSize: "16px",
            fontWeight: 800,
            fontFamily: "inherit",
            cursor: "pointer",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            boxShadow: "0 4px 20px rgba(34,197,94,0.25)",
            marginBottom: "24px",
            animation: "fadeUp 0.5s 0.1s ease both",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          Scan a product
        </button>

        {/* Quick actions */}
        <p
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "rgba(240,253,244,0.4)",
            letterSpacing: "0.6px",
            textTransform: "uppercase",
            margin: "0 0 12px",
          }}
        >
          Quick actions
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginBottom: "24px",
          }}
        >
          {QUICK_ACTIONS.map(({ label, sub, route, icon }) => (
            <div
              key={label}
              className="h-quick"
              onClick={() => navigate(route)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigate(route)}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(34,197,94,0.12)",
                borderRadius: "14px",
                padding: "16px",
                cursor: "pointer",
                transition: "all 0.2s",
                animation: "fadeUp 0.5s 0.15s ease both",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "rgba(34,197,94,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {icon}
              </div>
              <div
                style={{ fontSize: "13px", fontWeight: 600, color: "#f0fdf4" }}
              >
                {label}
              </div>
              <div
                style={{ fontSize: "11px", color: "rgba(240,253,244,0.35)" }}
              >
                {sub}
              </div>
            </div>
          ))}
        </div>

        {/* Allergies */}
        <p
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "rgba(240,253,244,0.4)",
            letterSpacing: "0.6px",
            textTransform: "uppercase",
            margin: "0 0 12px",
          }}
        >
          Your allergies
        </p>
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(34,197,94,0.12)",
            borderRadius: "16px",
            padding: "18px",
            marginBottom: "24px",
            animation: "fadeUp 0.5s 0.2s ease both",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "14px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "rgba(240,253,244,0.7)",
              }}
            >
              {user.allergies.length} item
              {user.allergies.length !== 1 ? "s" : ""} tracked
            </span>
            <button
              className="h-add-btn"
              onClick={() => navigate("/allergies")}
              style={{
                background: "rgba(34,197,94,0.1)",
                border: "1px dashed rgba(34,197,94,0.3)",
                color: "#4ade80",
                borderRadius: "20px",
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "background 0.2s",
              }}
            >
              + Add
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {user.allergies.length > 0 ? (
              user.allergies.map((a, i) => (
                <span
                  key={i}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 600,
                    background: "rgba(239,68,68,0.12)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    color: "#fca5a5",
                  }}
                >
                  {a}
                </span>
              ))
            ) : (
              <span
                style={{ fontSize: "13px", color: "rgba(240,253,244,0.35)" }}
              >
                No allergies added yet.
              </span>
            )}
          </div>
        </div>

        {/* Safety tip */}
        <div
          style={{
            background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.15)",
            borderRadius: "16px",
            padding: "16px",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <button
              onClick={nextFact}
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: "rgba(34,197,94,0.15)",
                border: "1px solid rgba(34,197,94,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4ade80"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0114.13-3.36L23 10" />
                <path d="M20.49 15a9 9 0 01-14.13 3.36L1 14" />
              </svg>
            </button>

            <div
              style={{
                flex: 1,
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#4ade80",
                  margin: "0 0 6px",
                }}
              >
                Did you know?
              </p>

              <p
                style={{
                  fontSize: "13px",
                  color: "rgba(240,253,244,0.75)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {nutritionFacts[factIndex]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
