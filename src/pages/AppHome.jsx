import AppNavbar from "../components/AppNavbar.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ScrollDots from "../components/ScrollDots";
import ContactFooter from "../components/ContactFooter";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import BackgroundVideo from "../components/BackgroundVideo";
import GlassOverlay from "../components/GlassOverlay";
import api from "../api/client";

export default function AppHome() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("home");
  const [profile, setProfile] = useState(null);

  const userEmail =
    profile?.email_id || localStorage.getItem("userEmail") || "user@jitwealth.com";
  const fullName = profile?.full_name || localStorage.getItem("fullName") || userEmail.split("@")[0];

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
      return;
    }

    api.me()
      .then((data) => setProfile(data))
      .catch(() => {
        api.logout();
        navigate("/login");
      });

    const sectionIds = ["home", "courses", "calculator", "contact"];

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [navigate]);

  return (
    <>
      {/* BACKGROUND LAYERS */}
      <BackgroundVideo />
      <GlassOverlay />

      <AppNavbar activeSection={activeSection} />
      <ScrollDots active={activeSection} />

      <div
        style={{
          marginTop: "120px",
          paddingBottom: "200px",
          position: "relative",
          zIndex: 2,
          color: "#fff"
        }}
      >
        {/* HOME */}
        <Section
          id="home"
          title={`Welcome, ${fullName}`}
          desc={
            <>
              <div
                style={{
                  fontSize: "16px",
                  marginBottom: "15px",
                  color: "#dddddd"
                }}
              >
                {userEmail}
              </div>

              {/* STAT CARDS */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "25px",
                  margin: "40px 0"
                }}
              >
                <StatCard
                  title="Courses Enrolled"
                  value="3"
                  text="You're actively improving your skills."
                />
                <StatCard
                  title="Portfolio Value"
                  value="₹ 2,45,000"
                  text="Based on your calculator results."
                />
                <StatCard
                  title="Success Rate"
                  value="95%"
                  text="Your trading performance is excellent."
                />
              </div>

              <div
                style={{
                  color: "#cccccc",
                  maxWidth: "700px",
                  margin: "0 auto"
                }}
              >
                Jit Wealth helps traders and investors understand the
                Indian stock market with clarity. Learn proven strategies,
                insights, and tools to grow your wealth consistently.
              </div>
            </>
          }
          arrow
          active={activeSection === "home"}
          onClick={() =>
            document
              .getElementById("courses")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        />

        {/* COURSES */}
        <Section
          id="courses"
          title="Courses"
          desc="Structured programs from beginner to advanced trading."
          action="View Courses"
          active={activeSection === "courses"}
          onClick={() => navigate("/courses")}
        />

        {/* CALCULATOR */}
        <Section
          id="calculator"
          title="Calculator"
          desc="Plan your investments and visualize future wealth."
          action="Open Calculator"
          active={activeSection === "calculator"}
          onClick={() => navigate("/calculator")}
        />

        {/* CONTACT */}
        <div id="contact">
          <ContactFooter />
          <FloatingWhatsApp />
        </div>
      </div>
    </>
  );
}

/* ---------------- SECTION COMPONENT ---------------- */

function Section({
  id,
  title,
  desc,
  action,
  onClick,
  disabled,
  arrow,
  active
}) {
  return (
    <div
      id={id}
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        onClick={!disabled ? onClick : undefined}
        style={{
          padding: "70px",
          borderRadius: "28px",
          width: "85%",
          maxWidth: "950px",
          textAlign: "center",
          cursor: disabled ? "not-allowed" : "pointer",
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(20px)",
          border: active
            ? "2px solid #C9A24D"
            : "1px solid rgba(255,255,255,0.15)",
          boxShadow: active
            ? "0 35px 70px rgba(201,162,77,0.4)"
            : "0 25px 60px rgba(0,0,0,0.4)",
          transition: "0.4s"
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            color: "#E6B85C",
            textShadow: "0 0 20px rgba(0,0,0,0.8)"
          }}
        >
          {title}
        </h1>

        <div
          style={{
            marginTop: "25px",
            fontSize: "18px",
            color: "#dddddd"
          }}
        >
          {desc}
        </div>

        <div style={{ marginTop: "45px" }}>
          {arrow ? (
            <div style={{ fontSize: "42px", color: "#E6B85C" }}>↓</div>
          ) : (
            <div
              style={{
                display: "inline-block",
                padding: "14px 34px",
                borderRadius: "30px",
                background: "#C9A24D",
                color: "#000",
                fontWeight: "700"
              }}
            >
              {action}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, text }) {
  return (
    <div
      style={{
        borderRadius: "20px",
        padding: "28px",
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(15px)",
        border: "1px solid rgba(201,162,77,0.5)",
        boxShadow: "0 15px 40px rgba(0,0,0,0.5)",
        textAlign: "center"
      }}
    >
      <h4 style={{ fontSize: "14px", color: "#cccccc" }}>
        {title}
      </h4>
      <div
        style={{
          fontSize: "30px",
          fontWeight: "900",
          color: "#E6B85C",
          margin: "12px 0"
        }}
      >
        {value}
      </div>
      <p style={{ fontSize: "14px", color: "#dddddd" }}>
        {text}
      </p>
    </div>
  );
}
