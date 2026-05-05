import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/client";

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  const email = profile?.email_id || localStorage.getItem("userEmail");
  const fullName = profile?.full_name || localStorage.getItem("fullName") || email.split("@")[0] || "Trader";

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    api.me()
      .then((data) => setProfile(data))
      .catch(() => {
        api.logout();
        navigate("/login");
      });
  }, [email, navigate]);

  return (
    <>
      <Navbar />

      <section
        style={{
          minHeight: "90vh",
          background: "#ffffff",
          padding: "60px 20px"
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "auto" }}>
          <h1
            style={{
              fontSize: "42px",
              color: "#111",
              marginBottom: "10px"
            }}
          >
            Welcome,{" "}
            <span style={{ color: "#C9A24D" }}>
              {fullName}
            </span>
          </h1>

          <p style={{ color: "#777", marginBottom: "40px" }}>
            Track your learning progress, investments, and achievements.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "30px"
            }}
          >
            <DashCard
              title="Courses Enrolled"
              value="3"
              desc="You’re actively improving your trading skills."
            />

            <DashCard
              title="Portfolio Value"
              value="₹ 2,45,000"
              desc="Based on your calculator results."
            />

            <DashCard
              title="Success Rate"
              value="95%"
              desc="Your trading performance is excellent."
            />
          </div>
        </div>
      </section>
    </>
  );
}

function DashCard({ title, value, desc }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #C9A24D",
        borderRadius: "20px",
        padding: "28px",
        boxShadow: "0 15px 35px rgba(0,0,0,0.05)"
      }}
    >
      <h4 style={{ color: "#777", marginBottom: "12px" }}>
        {title}
      </h4>

      <h2 style={{ color: "#C9A24D", fontSize: "34px", marginBottom: "12px" }}>
        {value}
      </h2>

      <p style={{ color: "#555" }}>
        {desc}
      </p>
    </div>
  );
}
