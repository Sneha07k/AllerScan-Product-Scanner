import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function History() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const fetchHistory = async () => {
    try {
      const res = await API.get(`/history/${userId}`);
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const deleteHistory = async (id) => {
    try {
      await API.delete(`/history/${id}`);

      setHistory((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#021d11 0%,#042816 50%,#021d11 100%)",
        color: "white",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "32px",
              }}
            >
              Scan History
            </h1>

            <p
              style={{
                color: "#9CA3AF",
                marginTop: "6px",
              }}
            >
              Review your previous nutrition scans
            </p>
          </div>

          <button
            onClick={() => navigate("/home")}
            style={{
              background: "#16a34a",
              color: "white",
              border: "none",
              padding: "12px 20px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Home
          </button>
        </div>

        {history.length === 0 ? (
          <div
            style={{
              background: "rgba(10,40,20,0.85)",
              borderRadius: "20px",
              padding: "40px",
              textAlign: "center",
              border: "1px solid rgba(34,197,94,0.2)",
            }}
          >
            <h3>No scans yet</h3>
            <p style={{ color: "#9CA3AF" }}>
              Your scanned products will appear here.
            </p>
          </div>
        ) : (
          history.map((scan) => (
            <div
              key={scan._id}
              style={{
                background: "rgba(10,40,20,0.85)",
                border: "1px solid rgba(34,197,94,0.2)",
                borderRadius: "20px",
                padding: "20px",
                marginBottom: "18px",
                backdropFilter: "blur(12px)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  {scan.imageUrl && (
                    <img
                      src={scan.imageUrl}
                      alt="Product"
                      style={{
                        width: "90px",
                        height: "90px",
                        objectFit: "cover",
                        borderRadius: "12px",
                      }}
                    />
                  )}

                  <h3
                    style={{
                      margin: 0,
                      marginBottom: "8px",
                    }}
                  >
                    {scan.productName}
                  </h3>

                  <div
                    style={{
                      display: "inline-block",
                      padding: "6px 12px",
                      borderRadius: "999px",
                      background: scan.status.toLowerCase().includes("safe")
                        ? "#14532d"
                        : "#7f1d1d",
                      color: scan.status.toLowerCase().includes("safe")
                        ? "#86efac"
                        : "#fca5a5",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    {scan.status}
                  </div>
                </div>

                <button
                  onClick={() => deleteHistory(scan._id)}
                  style={{
                    background: "transparent",
                    border: "1px solid #dc2626",
                    color: "#f87171",
                    borderRadius: "10px",
                    padding: "8px 12px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>

              <div
                style={{
                  marginTop: "16px",
                  color: "#9CA3AF",
                  fontSize: "14px",
                }}
              >
                {new Date(scan.scannedAt).toLocaleString()}
              </div>

              {scan.ingredients?.length > 0 && (
                <div
                  style={{
                    marginTop: "15px",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  {scan.ingredients.map((ingredient, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: "#052e16",
                        color: "#86efac",
                        padding: "6px 10px",
                        borderRadius: "999px",
                        fontSize: "13px",
                        border: "1px solid #166534",
                      }}
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
