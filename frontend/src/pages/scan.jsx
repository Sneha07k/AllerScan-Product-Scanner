import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Scan() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (loading) return;

    if (!image) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    try {
      setLoading(true);

      const res = await API.post("/scan/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const userId = localStorage.getItem("userId");

      await API.post("/history/", {
        userId,
        productName: "Scanned Product",
        status:
          res.data.allergens_detected?.length > 0
            ? "Contains Allergens"
            : "Safe",
        ingredients: res.data.ingredients || [],
        imageUrl: res.data.imageUrl,
      });

      navigate("/result", {
        state: res.data,
      });
    } catch (error) {
      console.error(error);
      alert("Failed to analyze product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#021d11 0%,#042816 50%,#021d11 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "550px",
          background: "rgba(10,40,20,0.85)",
          borderRadius: "24px",
          padding: "35px",
          border: "1px solid rgba(34,197,94,0.2)",
          backdropFilter: "blur(12px)",
          textAlign: "center",
          color: "white",
        }}
      >
        <h1
          style={{
            marginBottom: "10px",
          }}
        >
          Scan Product
        </h1>

        <p
          style={{
            color: "#9CA3AF",
            marginBottom: "25px",
          }}
        >
          Upload a product image to analyze ingredients, allergens, and
          nutrition.
        </p>

        <label
          style={{
            display: "block",
            padding: "40px",
            border: "2px dashed #16a34a",
            borderRadius: "16px",
            textAlign: "center",
            cursor: "pointer",
            color: "#86EFAC",
            marginBottom: "20px",
          }}
        >
          📷 Tap to Scan Product
          <input
            type="file"
            accept="image/*"
            capture="environment"
            hidden
            disabled={loading}
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>

        {image && !loading && (
          <p
            style={{
              color: "#86EFAC",
              marginBottom: "20px",
            }}
          >
            Selected: {image.name}
          </p>
        )}

        {loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                border: "6px solid rgba(255,255,255,0.15)",
                borderTop: "6px solid #22c55e",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />

            <h3
              style={{
                marginTop: "25px",
              }}
            >
              Analyzing Product...
            </h3>

            <p
              style={{
                color: "#9CA3AF",
              }}
            >
              Extracting ingredients and nutrition
            </p>

            <style>
              {`
                @keyframes spin {
                  from {
                    transform: rotate(0deg);
                  }
                  to {
                    transform: rotate(360deg);
                  }
                }
              `}
            </style>
          </div>
        ) : (
          <button
            onClick={handleSubmit}
            style={{
              width: "100%",
              padding: "14px",
              background: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontWeight: "600",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Scan Product
          </button>
        )}
      </div>
    </div>
  );
}
