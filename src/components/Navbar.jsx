import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/client";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    api.me()
      .then(() => setIsLoggedIn(true))
      .catch(() => {
        api.logout();
        setIsLoggedIn(false);
      });
  }, []);

  const handleBrandClick = () => {
    if (isLoggedIn) {
      navigate("/app");
    } else {
      navigate("/");
    }
  };

  return (
    <nav
      style={{
        background: "#ffffff",
        borderBottom: "1px solid #e5e5e5",
        padding: "16px 60px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      {/* Brand */}
      <span
        onClick={handleBrandClick}
        style={{
          fontWeight: "800",
          fontSize: "35px",
          color: "#111",
          cursor: "pointer"
        }}
      >
        JitWealth
      </span>

      {/* Right side buttons */}
      <div style={{ display: "flex", gap: "12px" }}>
        {isLoggedIn ? (
          <>
            <NavBtn to="/app">Home</NavBtn>
            <NavBtn to="/courses">Courses</NavBtn>
            <NavBtn to="/calculator">Calculator</NavBtn>
            <GoldBtn to="/dashboard">Profile</GoldBtn>
            <LogoutBtn />
          </>
        ) : (
          <>
            <NavBtn to="/courses">Courses</NavBtn>
            <NavBtn to="/calculator">Calculator</NavBtn>
            <NavBtn to="/login">Login</NavBtn>
            <GoldBtn to="/signup">Sign Up</GoldBtn>
          </>
        )}
      </div>
    </nav>
  );
}

function NavBtn({ to, children }) {
  return (
    <Link
      to={to}
      style={{
        textDecoration: "none",
        padding: "8px 16px",
        borderRadius: "20px",
        border: "1px solid #C9A24D",
        color: "#111",
        fontSize: "14px",
        fontWeight: "500"
      }}
    >
      {children}
    </Link>
  );
}

function GoldBtn({ to, children }) {
  return (
    <Link
      to={to}
      style={{
        textDecoration: "none",
        padding: "8px 18px",
        borderRadius: "20px",
        background: "#C9A24D",
        color: "#000",
        fontSize: "14px",
        fontWeight: "700"
      }}
    >
      {children}
    </Link>
  );
}

function LogoutBtn() {
  const navigate = useNavigate();

  const logout = () => {
    api.logout();
    navigate("/");
    window.location.reload();
  };

  return (
    <button
      onClick={logout}
      style={{
        padding: "8px 16px",
        borderRadius: "20px",
        border: "1px solid #C9A24D",
        background: "transparent",
        fontWeight: "600",
        cursor: "pointer"
      }}
    >
      Logout
    </button>
  );
}
