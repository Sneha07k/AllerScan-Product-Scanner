import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import logo from "../media/logo.svg";

const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulseGlow {
    0%, 100% { opacity: 0.5; transform: translateX(-50%) scale(1); }
    50%       { opacity: 1;   transform: translateX(-50%) scale(1.15); }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.3; }
  }

  .als-input {
    width: 100%;
    box-sizing: border-box;
    padding: 13px 16px;
    border: 1.5px solid rgba(34,197,94,0.2);
    border-radius: 12px;
    font-size: 15px;
    font-family: inherit;
    color: #f0fdf4;
    background: rgba(255,255,255,0.05);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .als-input::placeholder { color: rgba(240,253,244,0.3); }
  .als-input:focus {
    border-color: #22c55e;
    background: rgba(34,197,94,0.07);
    box-shadow: 0 0 0 3px rgba(34,197,94,0.12);
  }

  .als-submit:hover  { background: #16a34a !important; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(34,197,94,0.3) !important; }
  .als-submit:active { transform: translateY(0); }

  .als-ghost:hover {
    background: rgba(34,197,94,0.08) !important;
    border-color: rgba(34,197,94,0.5) !important;
  }

  .als-eye-btn:hover svg { stroke: #4ade80; }

  .als-forgot:hover { color: #4ade80 !important; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation: none !important; transition: none !important; }
  }
`;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (document.getElementById("als-login-kf")) return;
    const tag = document.createElement("style");
    tag.id = "als-login-kf";
    tag.textContent = KEYFRAMES;
    document.head.appendChild(tag);
    return () => document.getElementById("als-login-kf")?.remove();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("user", JSON.stringify(res.data));
      localStorage.setItem("userId", res.data.userId);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0a1f0f",
        padding: "20px",
        fontFamily: "'Inter', -apple-system, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ambient glow */}
      <div
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(34,197,94,0.13) 0%, transparent 70%)",
          top: "-150px",
          left: "50%",
          transform: "translateX(-50%)",
          borderRadius: "50%",
          pointerEvents: "none",
          animation: "pulseGlow 4s ease-in-out infinite",
        }}
      />

      {/* bottom glow */}
      <div
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)",
          bottom: "-150px",
          left: "50%",
          transform: "translateX(-50%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {/* card — dark glass style */}
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(34,197,94,0.15)",
          borderRadius: "24px",
          padding: "clamp(28px, 6vw, 40px)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          animation: "fadeUp 0.5s ease both",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* logo */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <img
            src={logo}
            alt="AllerScan"
            style={{ width: "min(220px, 70vw)", height: "auto" }}
          />
        </div>

        {/* heading */}
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 800,
            color: "#f0fdf4",
            letterSpacing: "-0.5px",
            marginBottom: "6px",
            textAlign: "center",
          }}
        >
          Welcome back
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "rgba(240,253,244,0.45)",
            textAlign: "center",
            marginBottom: "28px",
            lineHeight: 1.5,
          }}
        >
          Sign in to your AllerScan account
        </p>

        {/* error banner */}
        {error && (
          <div
            style={{
              background: "rgba(220,38,38,0.1)",
              border: "1px solid rgba(220,38,38,0.3)",
              borderRadius: "10px",
              padding: "11px 14px",
              fontSize: "13px",
              color: "#fca5a5",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fca5a5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* form */}
        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {/* email */}
          <div>
            <label
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "rgba(240,253,244,0.7)",
                display: "block",
                marginBottom: "7px",
              }}
            >
              Email address
            </label>
            <input
              className="als-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {/* password */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "7px",
              }}
            >
              <label
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "rgba(240,253,244,0.7)",
                }}
              >
                Password
              </label>
              <button
                type="button"
                className="als-forgot"
                onClick={() => navigate("/forgot-password")}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "12px",
                  color: "#4ade80",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  padding: 0,
                  fontWeight: 500,
                  transition: "color 0.2s",
                }}
              >
                Forgot password?
              </button>
            </div>
            <div style={{ position: "relative" }}>
              <input
                className="als-input"
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{ paddingRight: "46px" }}
              />
              <button
                type="button"
                className="als-eye-btn"
                onClick={() => setShowPw((p) => !p)}
                aria-label={showPw ? "Hide password" : "Show password"}
                style={{
                  position: "absolute",
                  right: "13px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  color: "rgba(240,253,244,0.3)",
                  transition: "color 0.2s",
                }}
              >
                {showPw ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* submit */}
          <button
            className="als-submit"
            type="submit"
            disabled={loading}
            style={{
              background: "#22c55e",
              color: "#0a1f0f",
              border: "none",
              borderRadius: "12px",
              padding: "14px",
              fontSize: "15px",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s",
              marginTop: "4px",
              opacity: loading ? 0.65 : 1,
              width: "100%",
              boxShadow: "0 4px 14px rgba(34,197,94,0.2)",
            }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {/* divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            margin: "24px 0",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "rgba(240,253,244,0.1)",
            }}
          />
          <span
            style={{
              fontSize: "12px",
              color: "rgba(240,253,244,0.3)",
              whiteSpace: "nowrap",
            }}
          >
            don't have an account?
          </span>
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "rgba(240,253,244,0.1)",
            }}
          />
        </div>

        {/* signup CTA */}
        <button
          className="als-ghost"
          onClick={() => navigate("/signup")}
          style={{
            width: "100%",
            padding: "13px",
            border: "1.5px solid rgba(34,197,94,0.3)",
            borderRadius: "12px",
            background: "transparent",
            color: "#4ade80",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s",
          }}
        >
          Create an account
        </button>
      </div>
    </div>
  );
}
