import { useNavigate, useLocation } from "react-router-dom";

export default function AppNavbar({ activeSection }) {
  const navigate = useNavigate();
  const location = useLocation();

  const go = (path) => navigate(path);

  const isActive = (key) => {
    if (location.pathname === "/app" && key === "home") return true;
    if (location.pathname === "/courses" && key === "courses") return true;
    if (location.pathname === "/calculator" && key === "calculator") return true;
    return activeSection === key;
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        background: "#ffffff",
        borderBottom: "1px solid #eee",
        padding: "14px 60px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 1000
      }}
    >
      {/* BRAND (Redirect to Public Landing Page) */}
      <div
        onClick={() => go("/")}
        style={{
          fontWeight: "800",
          fontSize: "26px",
          cursor: "pointer",
          color: "#111",
          transition: "0.2s"
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        JitWealth
      </div>

      {/* NAVIGATION */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <NavBtn active={isActive("home")} onClick={() => go("/app")}>
          Home
        </NavBtn>

        <NavBtn active={isActive("courses")} onClick={() => go("/courses")}>
          Courses
        </NavBtn>

        <NavBtn active={isActive("calculator")} onClick={() => go("/calculator")}>
          Calculator
        </NavBtn>

        {/* PROFILE ICON */}
        <div
          title="Profile"
          onClick={() => go("/dashboard")}
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            background: "#C9A24D",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "700",
            color: "#000",
            transition: "0.25s"
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.1)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "scale(1)")
          }
        >
          👤
        </div>

        <GoldBtn
          onClick={() => {
            localStorage.clear();
            go("/");
          }}
        >
          Logout
        </GoldBtn>
      </div>
    </nav>
  );
}

/* ---------- NAV BUTTON ---------- */

function NavBtn({ children, onClick, active }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? "#C9A24D" : "transparent",
        color: active ? "#000" : "#111",
        border: "1px solid #C9A24D",
        borderRadius: "20px",
        padding: "8px 16px",
        cursor: "pointer",
        fontWeight: "600",
        transition: "0.25s"
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = "#C9A24D22";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = "transparent";
        }
      }}
    >
      {children}
    </button>
  );
}

/* ---------- GOLD BUTTON ---------- */

function GoldBtn({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "#C9A24D",
        border: "none",
        borderRadius: "20px",
        padding: "8px 18px",
        cursor: "pointer",
        fontWeight: "700",
        transition: "0.25s"
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "scale(1.05)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.transform = "scale(1)")
      }
    >
      {children}
    </button>
  );
}
