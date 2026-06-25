import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

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

  .als-eye-btn:hover { color: #4ade80 !important; }

  .als-verify-btn:hover:not(:disabled) { background: #15803d !important; }
  .als-verify-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .pw-rule {
    font-size: 11px;
    padding: 3px 8px;
    border-radius: 20px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(240,253,244,0.1);
    color: rgba(240,253,244,0.4);
    transition: all 0.2s;
  }
  .pw-rule.met {
    background: rgba(34,197,94,0.12);
    border-color: rgba(34,197,94,0.3);
    color: #4ade80;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation: none !important; transition: none !important; }
  }
`;

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [allergies, setAllergies] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (document.getElementById("als-signup-kf")) return;
    const tag = document.createElement("style");
    tag.id = "als-signup-kf";
    tag.textContent = KEYFRAMES;
    document.head.appendChild(tag);
    return () => document.getElementById("als-signup-kf")?.remove();
  }, []);

  const pwRules = {
    length: password.length >= 8,
    letter: /[A-Za-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const handleSendOtp = async () => {
    if (!email.trim()) {
      setError("Please enter an email first.");
      return;
    }
    try {
      setSendingOtp(true);
      setError("");
      await API.post("/auth/send-otp", { email });
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to send OTP.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!otpSent || !otp.trim()) {
      setError("Please verify your email with the OTP before signing up.");
      return;
    }
    if (!Object.values(pwRules).every(Boolean)) {
      setError(
        "Password must be at least 8 characters and include a letter and a number.",
      );
      return;
    }
    try {
      setLoading(true);
      setError("");
      const allergyList = allergies
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);
      await API.post("/auth/signup", {
        name,
        email,
        password,
        otp,
        allergies: allergyList,
      });
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Signup failed. Please try again.",
      );
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

      {/* card */}
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
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
        {/* icon */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              background: "rgba(34,197,94,0.15)",
              border: "1px solid rgba(34,197,94,0.3)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
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
          Create your account
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
          Join AllerScan and stay allergy-safe
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
          onSubmit={handleSignup}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {/* name */}
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
              Full name
            </label>
            <input
              className="als-input"
              type="text"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          {/* email + verify */}
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
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                className="als-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="als-verify-btn"
                onClick={handleSendOtp}
                disabled={sendingOtp || otpSent}
                style={{
                  padding: "0 16px",
                  borderRadius: "12px",
                  border: "none",
                  background: otpSent ? "rgba(34,197,94,0.2)" : "#16a34a",
                  color: otpSent ? "#4ade80" : "#fff",
                  cursor: sendingOtp || otpSent ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  fontSize: "13px",
                  fontFamily: "inherit",
                  whiteSpace: "nowrap",
                  transition: "background 0.2s",
                  flexShrink: 0,
                }}
              >
                {sendingOtp ? "Sending…" : otpSent ? "Sent ✓" : "Verify"}
              </button>
            </div>
          </div>

          {/* OTP field — shown only after OTP is sent */}
          {otpSent && (
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
                Verification code
              </label>
              <input
                className="als-input"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                autoComplete="one-time-code"
                inputMode="numeric"
              />
            </div>
          )}

          {/* password */}
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
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                className="als-input"
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
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
            {/* password rules */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
                marginTop: "8px",
              }}
            >
              {[
                { key: "length", label: "8+ chars" },
                { key: "letter", label: "Letter" },
                { key: "number", label: "Number" },
              ].map(({ key, label }) => (
                <span
                  key={key}
                  className={`pw-rule${pwRules[key] ? " met" : ""}`}
                >
                  <span
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      background: "currentColor",
                      display: "inline-block",
                    }}
                  />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* allergies */}
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
              Allergies{" "}
              <span style={{ color: "rgba(240,253,244,0.3)", fontWeight: 400 }}>
                (optional)
              </span>
            </label>
            <textarea
              className="als-input"
              placeholder="milk, peanuts, soy…"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              rows={3}
              style={{ resize: "vertical", lineHeight: 1.5 }}
            />
            <p
              style={{
                fontSize: "12px",
                color: "rgba(240,253,244,0.3)",
                marginTop: "5px",
              }}
            >
              Separate multiple allergies with commas
            </p>
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
            {loading ? "Creating account…" : "Create account"}
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
            already have an account?
          </span>
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "rgba(240,253,244,0.1)",
            }}
          />
        </div>

        {/* login CTA */}
        <button
          className="als-ghost"
          onClick={() => navigate("/")}
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
          Sign in instead
        </button>
      </div>
    </div>
  );
}
