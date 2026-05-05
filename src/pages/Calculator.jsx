import { useEffect, useState } from "react";
import AppNavbar from "../components/AppNavbar";

/* ================= MAIN ================= */

export default function Calculator() {
  const [prevClose, setPrevClose] = useState("");
  const [signal, setSignal] = useState(null);

  const p = Number(prevClose);

  /* Auto Generate Signal */
  useEffect(() => {
    if (!p) {
      setSignal(null);
      return;
    }

    const confidence = Math.floor(80 + Math.random() * 15);

    setSignal({
      strength: confidence > 90 ? "HIGH" : confidence > 85 ? "MEDIUM" : "LOW",
      confidence,
      buy: {
        entry: Math.round(p * 1.007),
        sl: Math.round(p * 1.0015),
        t1: Math.round(p * 1.012),
        t2: Math.round(p * 1.017),
        t3: Math.round(p * 1.022),
      },
      sell: {
        entry: Math.round(p * 0.997),
        sl: Math.round(p * 1.002),
        t1: Math.round(p * 0.992),
        t2: Math.round(p * 0.987),
        t3: Math.round(p * 0.982),
      },
    });
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
        {signal && (
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
