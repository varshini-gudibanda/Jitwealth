import { useEffect, useState } from "react";
import AppNavbar from "../components/AppNavbar";
import api from "../api/client";

/* ================= MAIN ================= */

export default function Calculator() {
  const [prevClose, setPrevClose] = useState("");
  const [signal, setSignal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const p = Number(prevClose);

  /* Fetch signal from backend */
  useEffect(() => {
    if (!p || p <= 0) {
      setSignal(null);
      setError(null);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.calculateSignal(p);
        setSignal(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to calculate signal:", err);
        setError(err.message || "Failed to calculate signal");
        setSignal(null);
        setLoading(false);
      }
    })();
  }, [p]);

  return (
    <>
      <AppNavbar />

      <div
        style={{
          minHeight: "100vh",
          paddingTop: "130px",
          paddingBottom: "140px",
          background:
            "radial-gradient(circle at top, rgba(201,162,77,0.22), #050505)",
          color: "#fff",
        }}
      >
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <h1
            style={{
              fontSize: "48px",
              fontWeight: "900",
              background:
                "linear-gradient(90deg,#FFD980,#C9A24D,#FFD980)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            JIT AI SIGNAL ENGINE
          </h1>
          <p style={{ color: "#ccc", marginTop: "12px" }}>
            Enter previous close price to generate signal instantly
          </p>
        </div>

        {/* INPUT CARD */}
        <div
          style={{
            maxWidth: "420px",
            margin: "0 auto 60px",
            background: "rgba(255,255,255,0.09)",
            backdropFilter: "blur(16px)",
            padding: "30px",
            borderRadius: "26px",
            border: "1px solid rgba(201,162,77,0.6)",
            boxShadow: "0 0 60px rgba(201,162,77,0.45)",
            textAlign: "center",
          }}
        >
          <input
            type="number"
            placeholder="Enter Previous Close (Ex: 2571)"
            value={prevClose}
            onChange={(e) => setPrevClose(e.target.value)}
            style={{
              width: "100%",
              padding: "18px",
              fontSize: "22px",
              textAlign: "center",
              borderRadius: "16px",
              border: "2px solid #C9A24D",
              background: "#000",
              color: "#fff",
              outline: "none",
            }}
          />
        </div>

        {/* RESULT */}
        {error && (
          <div
            style={{
              maxWidth: "600px",
              margin: "30px auto",
              background: "rgba(255,77,77,0.2)",
              border: "1px solid #ff4d4d",
              borderRadius: "16px",
              padding: "20px",
              color: "#ff9999",
              textAlign: "center",
            }}
          >
            Error: {error}
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", color: "#C9A24D", fontSize: "18px" }}>
            Calculating signal...
          </div>
        )}

        {signal && !loading && (
          <>
            {/* AI METRICS */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "60px",
                marginBottom: "50px",
              }}
            >
              <Metric label="Signal Strength" value={signal.strength} />
              <Metric label="AI Confidence" value={`${signal.confidence}%`} />
            </div>

            {/* SIGNAL CARDS */}
            <div
              style={{
                maxWidth: "1100px",
                margin: "auto",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))",
                gap: "40px",
              }}
            >
              <SignalCard title="BUY SIGNAL" data={signal.buy} color="#00ff9d" />
              <SignalCard title="SELL SIGNAL" data={signal.sell} color="#ff4d4d" />
            </div>
          </>
        )}
      </div>
    </>
  );
}

/* ================= COMPONENTS ================= */

function Metric({ label, value }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: "#aaa", fontSize: "14px" }}>{label}</div>
      <div style={{ fontSize: "26px", fontWeight: "800", color: "#C9A24D" }}>
        {value}
      </div>
    </div>
  );
}

function SignalCard({ title, data, color }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(16px)",
        borderRadius: "26px",
        padding: "28px",
        border: `1px solid ${color}`,
        boxShadow: `0 0 60px ${color}55`,
      }}
    >
      <h3 style={{ textAlign: "center", color, letterSpacing: "2px" }}>
        {title}
      </h3>

      <Row label="ENTRY" value={data.entry} highlight />
      <Row label="STOP LOSS" value={data.sl} danger />
      <Row label="TARGET 1" value={data.t1} />
      <Row label="TARGET 2" value={data.t2} />
      <Row label="TARGET 3" value={data.t3} />
    </div>
  );
}

function Row({ label, value, highlight, danger }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "14px 0",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      <span style={{ color: "#ccc" }}>{label}</span>
      <span
        style={{
          fontSize: highlight ? "24px" : "18px",
          fontWeight: "900",
          color: danger ? "#ff4d4d" : "#C9A24D",
        }}
      >
        {value}
      </span>
    </div>
  );
}
