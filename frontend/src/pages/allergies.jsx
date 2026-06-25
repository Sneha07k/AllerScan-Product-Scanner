import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Allergies() {
  const [allergies, setAllergies] = useState([]);
    const [newAllergy, setNewAllergy] = useState("");
    const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  const fetchAllergies = async () => {
    try {
      const res = await API.get(`/allergies/${userId}`);
      setAllergies(res.data.allergies || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAllergies();
  }, []);

  const addAllergy = async () => {
    if (!newAllergy.trim()) return;

    try {
      await API.post("/allergies", {
        userId,
        allergy: newAllergy,
      });

      setNewAllergy("");
      fetchAllergies();
    } catch (err) {
      console.error(err);
    }
  };

  const removeAllergy = async (allergy) => {
    try {
      await API.delete("/allergies", {
        data: {
          userId,
          allergy,
        },
      });

      fetchAllergies();
    } catch (err) {
      console.error(err);
    }
  };

  const suggestions = [
    "Milk",
    "Peanuts",
    "Soy",
    "Eggs",
    "Wheat",
    "Fish",
    "Shellfish",
    "Tree Nuts",
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #021d11 0%, #042816 50%, #021d11 100%)",
        color: "white",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            marginBottom: "6px",
            fontSize: "28px",
          }}
        >
          Manage Allergies
        </h1>

        <p
          style={{
            color: "#9CA3AF",
            marginBottom: "30px",
          }}
        >
          Add or remove allergens that should be checked during scans.
        </p>

        {/* Add Allergy Card */}

        <div
          style={{
            background: "rgba(10,40,20,0.85)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: "18px",
            padding: "20px",
            marginBottom: "25px",
          }}
        >
          <h3>Add Allergy</h3>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "15px",
            }}
          >
            <input
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              placeholder="Enter allergy..."
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: "12px",
                border: "1px solid #14532d",
                background: "#062814",
                color: "white",
                outline: "none",
              }}
            />

            <button
              onClick={addAllergy}
              style={{
                background: "#16a34a",
                color: "white",
                border: "none",
                padding: "14px 20px",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Add
            </button>
          </div>
        </div>

        {/* Current Allergies */}

        <div
          style={{
            background: "rgba(10,40,20,0.85)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: "18px",
            padding: "20px",
            marginBottom: "25px",
          }}
        >
          <h3>Your Allergies</h3>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              marginTop: "15px",
            }}
          >
            {allergies.length === 0 ? (
              <p style={{ color: "#9CA3AF" }}>No allergies added yet.</p>
            ) : (
              allergies.map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 14px",
                    borderRadius: "999px",
                    background: "#4c1d1d",
                    border: "1px solid #ef4444",
                  }}
                >
                  <span>{item}</span>

                  <button
                    onClick={() => removeAllergy(item)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#f87171",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Suggestions */}

        <div
          style={{
            background: "rgba(10,40,20,0.85)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: "18px",
            padding: "20px",
          }}
        >
          <h3>Common Allergens</h3>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "15px",
            }}
          >
            {suggestions.map((item) => (
              <button
                key={item}
                onClick={() => setNewAllergy(item)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "999px",
                  border: "1px solid #166534",
                  background: "#052e16",
                  color: "#86efac",
                  cursor: "pointer",
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "25px",
        }}
      >
        <button
          onClick={() => navigate("/home")}
          style={{
            background: "#16a34a",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "12px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 0 15px rgba(34,197,94,0.25)",
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
