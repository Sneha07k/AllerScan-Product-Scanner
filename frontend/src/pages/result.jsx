import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../services/api";

const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes pulseGlow {
    0%, 100% { opacity: 0.4; }
    50%       { opacity: 0.9; }
  }

  .r-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(34,197,94,0.12);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 16px;
    animation: fadeUp 0.45s ease both;
  }
  .r-section-title {
    font-size: 11px;
    font-weight: 600;
    color: rgba(240,253,244,0.4);
    letter-spacing: 0.6px;
    text-transform: uppercase;
    margin: 0 0 14px;
  }
  .r-card-heading {
    font-size: 15px;
    font-weight: 700;
    color: #f0fdf4;
    margin: 0 0 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .r-allergen-tag {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    background: rgba(239,68,68,0.12);
    border: 1px solid rgba(239,68,68,0.25);
    color: #fca5a5;
  }
  .r-safe-tag {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    background: rgba(34,197,94,0.12);
    border: 1px solid rgba(34,197,94,0.25);
    color: #4ade80;
  }
  .r-insight-item {
    font-size: 13px;
    color: rgba(240,253,244,0.65);
    line-height: 1.6;
    padding: 8px 0;
    border-bottom: 1px solid rgba(240,253,244,0.06);
    display: flex;
    gap: 8px;
    align-items: flex-start;
  }
  .r-insight-item:last-child { border-bottom: none; }
  .r-ingredient-row {
    padding: 10px 0;
    border-bottom: 1px solid rgba(240,253,244,0.06);
  }
  .r-ingredient-row:last-child { border-bottom: none; }
  .r-explain-btn {
    background: rgba(34,197,94,0.1);
    border: 1px solid rgba(34,197,94,0.25);
    color: #4ade80;
    border-radius: 8px;
    padding: 4px 10px;
    font-size: 11px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s;
    margin-left: 10px;
    white-space: nowrap;
  }
  .r-explain-btn:hover { background: rgba(34,197,94,0.2); }
  .r-explain-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .r-nutrition-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 9px 0;
    border-bottom: 1px solid rgba(240,253,244,0.06);
    font-size: 13px;
  }
  .r-nutrition-row:last-child { border-bottom: none; }
  .r-ask-input {
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
    margin-bottom: 12px;
  }
  .r-ask-input::placeholder { color: rgba(240,253,244,0.3); }
  .r-ask-input:focus {
    border-color: #22c55e;
    background: rgba(34,197,94,0.07);
    box-shadow: 0 0 0 3px rgba(34,197,94,0.12);
  }
  .r-ask-btn {
    width: 100%;
    padding: 13px;
    border-radius: 12px;
    background: #22c55e;
    color: #0a1f0f;
    border: none;
    font-size: 15px;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 14px rgba(34,197,94,0.2);
  }
  .r-ask-btn:hover:not(:disabled) { background: #16a34a; transform: translateY(-1px); }
  .r-ask-btn:disabled { opacity: 0.55; cursor: not-allowed; }
  .r-back-btn {
    width: 100%;
    padding: 13px;
    border: 1.5px solid rgba(34,197,94,0.3);
    border-radius: 12px;
    background: transparent;
    color: #4ade80;
    font-size: 15px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 8px;
  }
  .r-back-btn:hover { background: rgba(34,197,94,0.08); border-color: rgba(34,197,94,0.5); }

  .r-ocr-toggle {
    width: 100%;
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: inherit;
    padding: 0;
  }
  .r-spinner {
    width: 18px; height: 18px;
    border: 2px solid rgba(34,197,94,0.2);
    border-top-color: #22c55e;
    border-radius: 50%;
    display: inline-block;
    animation: spin 0.7s linear infinite;
    vertical-align: middle;
  }
  .r-score-bar-track {
    width: 100%;
    height: 8px;
    background: rgba(255,255,255,0.07);
    border-radius: 99px;
    overflow: hidden;
    margin-top: 10px;
  }

  @media (min-width: 640px) {
    .r-nutrition-grid {
      display: grid !important;
      grid-template-columns: 1fr 1fr;
      gap: 0 24px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation: none !important; transition: none !important; }
  }
`;

function ScoreBar({ score }) {
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";
  const label = score >= 70 ? "Good" : score >= 40 ? "Average" : "Poor";
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span style={{ fontSize: "32px", fontWeight: 800, color: "#f0fdf4" }}>
          {score}
        </span>
        <span
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color,
            padding: "4px 10px",
            borderRadius: "20px",
            background: `${color}1a`,
            border: `1px solid ${color}40`,
          }}
        >
          {label}
        </span>
      </div>
      <div className="r-score-bar-track">
        <div
          style={{
            width: `${score}%`,
            height: "100%",
            background: color,
            borderRadius: "99px",
            transition: "width 1s ease",
          }}
        />
      </div>
      <p
        style={{
          fontSize: "11px",
          color: "rgba(240,253,244,0.35)",
          margin: "6px 0 0",
        }}
      >
        out of 100
      </p>
    </div>
  );
}

const NUTRITION_FIELDS = [
  { key: "calories", label: "Calories" },
  { key: "protein", label: "Protein" },
  { key: "fat", label: "Fat" },
  { key: "carbohydrates", label: "Carbohydrates" },
  { key: "sugar", label: "Sugar" },
  { key: "fiber", label: "Fiber" },
  { key: "sodium", label: "Sodium" },
];

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const [ingredientInfo, setIngredientInfo] = useState({});
  const [loadingIngredient, setLoadingIngredient] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [asking, setAsking] = useState(false);
  const [ocrOpen, setOcrOpen] = useState(false);

  useEffect(() => {
    if (document.getElementById("als-result-kf")) return;
    const tag = document.createElement("style");
    tag.id = "als-result-kf";
    tag.textContent = KEYFRAMES;
    document.head.appendChild(tag);
    return () => document.getElementById("als-result-kf")?.remove();
  }, []);

  const result = location.state;

  if (!result) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a1f0f",
          fontFamily: "'Inter', sans-serif",
          gap: "16px",
        }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(240,253,244,0.2)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
        <p
          style={{
            color: "rgba(240,253,244,0.5)",
            fontSize: "15px",
            margin: 0,
          }}
        >
          No scan result found
        </p>
        <button
          className="r-back-btn"
          style={{ maxWidth: "200px" }}
          onClick={() => navigate("/scan")}
        >
          Go to scanner
        </button>
      </div>
    );
  }

  const explainIngredient = async (ingredient) => {
    setLoadingIngredient(ingredient);
    try {
      const res = await API.post("/llm/ingredient-explanation", { ingredient });
      setIngredientInfo((prev) => ({
        ...prev,
        [ingredient]: res.data.explanation,
      }));
    } catch {
      alert("Failed to get explanation");
    }
    setLoadingIngredient(null);
  };

  const askQuestion = async () => {
    if (!question.trim()) return;
    setAsking(true);
    try {
      const res = await API.post("/llm/ask-product", {
        question,
        ocr_text: result.ocr_text,
        ingredients: result.ingredients,
        nutrition: result.nutrition,
      });
      setAnswer(res.data.answer);
    } catch {
      alert("Failed to get answer");
    }
    setAsking(false);
  };

  const score = result.nutrition_rating?.score ?? 0;
  const hasAllergens = result.allergens_detected?.length > 0;

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
          padding: "24px 20px 28px",
          borderBottom: "1px solid rgba(34,197,94,0.12)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "300px",
            height: "300px",
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
            maxWidth: "720px",
            margin: "0 auto",
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <button
            onClick={() => navigate("/scan")}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(240,253,244,0.12)",
              borderRadius: "10px",
              padding: "8px 10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              color: "rgba(240,253,244,0.6)",
              flexShrink: 0,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div>
            <h1
              style={{
                fontSize: "18px",
                fontWeight: 800,
                letterSpacing: "-0.4px",
                margin: 0,
              }}
            >
              Product Analysis
            </h1>
            <p
              style={{
                fontSize: "12px",
                color: "rgba(240,253,244,0.4)",
                margin: "2px 0 0",
              }}
            >
              Scan complete
            </p>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div
        style={{ maxWidth: "720px", margin: "0 auto", padding: "20px 16px 0" }}
      >
        {/* Product image — top of body, centered */}
        {result.imageUrl && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
              animation: "fadeUp 0.45s ease both",
            }}
          >
            <img
              src={result.imageUrl}
              alt="Scanned Product"
              style={{
                width: "220px",
                maxWidth: "100%",
                borderRadius: "16px",
                border: "1px solid rgba(34,197,94,0.2)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              }}
            />
          </div>
        )}

        {/* Vegan + Allergen summary row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          {/* Vegan status */}
          <div className="r-card" style={{ margin: 0 }}>
            <p className="r-section-title" style={{ margin: "0 0 10px" }}>
              Vegan status
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: result.vegan
                    ? "rgba(34,197,94,0.15)"
                    : "rgba(239,68,68,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {result.vegan ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#f87171"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                )}
              </div>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: result.vegan ? "#4ade80" : "#f87171",
                }}
              >
                {result.vegan ? "Vegan" : "Not vegan"}
              </span>
            </div>
          </div>

          {/* Allergen summary */}
          <div
            className="r-card"
            style={{
              margin: 0,
              background: hasAllergens
                ? "rgba(239,68,68,0.06)"
                : "rgba(34,197,94,0.04)",
              borderColor: hasAllergens
                ? "rgba(239,68,68,0.2)"
                : "rgba(34,197,94,0.15)",
            }}
          >
            <p className="r-section-title" style={{ margin: "0 0 10px" }}>
              Allergens
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: hasAllergens
                    ? "rgba(239,68,68,0.15)"
                    : "rgba(34,197,94,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {hasAllergens ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#f87171"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                )}
              </div>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: hasAllergens ? "#f87171" : "#4ade80",
                }}
              >
                {hasAllergens
                  ? `${result.allergens_detected.length} found`
                  : "All clear"}
              </span>
            </div>
          </div>
        </div>

        {/* Allergens detail */}
        {hasAllergens && (
          <div className="r-card">
            <p className="r-card-heading">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f87171"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              Allergens detected
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {result.allergens_detected.map((a, i) => (
                <span key={i} className="r-allergen-tag">
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Nutrition rating */}
        <div className="r-card">
          <p className="r-section-title">Nutrition rating</p>
          <ScoreBar score={score} />
          {result.nutrition_rating?.rating && (
            <p
              style={{
                fontSize: "13px",
                color: "rgba(240,253,244,0.5)",
                margin: "10px 0 0",
              }}
            >
              {result.nutrition_rating.rating}
            </p>
          )}
        </div>

        {/* Nutrition table */}
        <div className="r-card">
          <p className="r-card-heading">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
              <path d="M7 2v20" />
              <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
            </svg>
            Nutrition facts
          </p>
          <div className="r-nutrition-grid" style={{ display: "block" }}>
            {NUTRITION_FIELDS.map(({ key, label }) => (
              <div key={key} className="r-nutrition-row">
                <span style={{ color: "rgba(240,253,244,0.5)" }}>{label}</span>
                <span style={{ fontWeight: 600, color: "#f0fdf4" }}>
                  {result.nutrition?.[key] || "N/A"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Nutrition insights */}
        {result.nutrition_summary?.length > 0 && (
          <div className="r-card">
            <p className="r-card-heading">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#22c55e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Nutrition insights
            </p>
            {result.nutrition_summary.map((item, i) => (
              <div key={i} className="r-insight-item">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0, marginTop: "3px" }}
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {item}
              </div>
            ))}
          </div>
        )}

        {/* Ingredients */}
        <div className="r-card">
          <p className="r-card-heading">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="2" />
            </svg>
            Ingredients
            <span
              style={{
                marginLeft: "auto",
                fontSize: "12px",
                color: "rgba(240,253,244,0.35)",
                fontWeight: 400,
              }}
            >
              {result.ingredients?.length || 0} items
            </span>
          </p>
          {result.ingredients?.length > 0 ? (
            result.ingredients.map((ingredient, i) => (
              <div key={i} className="r-ingredient-row">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#f0fdf4",
                    }}
                  >
                    {ingredient}
                  </span>
                  <button
                    className="r-explain-btn"
                    disabled={loadingIngredient === ingredient}
                    onClick={() => explainIngredient(ingredient)}
                  >
                    {loadingIngredient === ingredient ? (
                      <>
                        <span
                          className="r-spinner"
                          style={{
                            width: "10px",
                            height: "10px",
                            borderWidth: "1.5px",
                          }}
                        />{" "}
                        Loading…
                      </>
                    ) : ingredientInfo[ingredient] ? (
                      "Explained"
                    ) : (
                      "Explain"
                    )}
                  </button>
                </div>
                {ingredientInfo[ingredient] && (
                  <p
                    style={{
                      fontSize: "12px",
                      color: "rgba(240,253,244,0.5)",
                      margin: "8px 0 0",
                      lineHeight: 1.6,
                    }}
                  >
                    {ingredientInfo[ingredient]}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p
              style={{
                fontSize: "13px",
                color: "rgba(240,253,244,0.35)",
                margin: 0,
              }}
            >
              No ingredients extracted.
            </p>
          )}
        </div>

        {/* OCR text */}
        <div className="r-card">
          <button
            className="r-ocr-toggle"
            onClick={() => setOcrOpen((o) => !o)}
          >
            <p className="r-card-heading" style={{ margin: 0 }}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#22c55e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              Raw OCR text
            </p>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(240,253,244,0.4)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: ocrOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
                flexShrink: 0,
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {ocrOpen && (
            <pre
              style={{
                marginTop: "14px",
                fontSize: "12px",
                color: "rgba(240,253,244,0.45)",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                lineHeight: 1.7,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(240,253,244,0.06)",
                borderRadius: "10px",
                padding: "12px",
                fontFamily: "monospace",
              }}
            >
              {result.ocr_text}
            </pre>
          )}
        </div>

        {/* Ask AI */}
        <div className="r-card">
          <p className="r-card-heading">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Ask about this product
          </p>
          <input
            className="r-ask-input"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askQuestion()}
            placeholder="Is this healthy for weight loss?"
          />
          <button
            className="r-ask-btn"
            onClick={askQuestion}
            disabled={asking || !question.trim()}
          >
            {asking ? (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <span className="r-spinner" /> Thinking…
              </span>
            ) : (
              "Ask AI"
            )}
          </button>
          {answer && (
            <div
              style={{
                marginTop: "14px",
                padding: "14px",
                background: "rgba(34,197,94,0.06)",
                border: "1px solid rgba(34,197,94,0.15)",
                borderRadius: "12px",
                fontSize: "13px",
                color: "rgba(240,253,244,0.75)",
                lineHeight: 1.7,
              }}
            >
              {answer}
            </div>
          )}
        </div>

        {/* Scan again */}
        <button className="r-back-btn" onClick={() => navigate("/scan")}>
          Scan another product
        </button>
      </div>
    </div>
  );
}
