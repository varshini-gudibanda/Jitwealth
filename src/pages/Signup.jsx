import Navbar from "../components/Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [provinceId, setProvinceId] = useState(1);
  const [salutation, setSalutation] = useState(1);
  const [jobStatus, setJobStatus] = useState(1);

  const handleSubmit = (e) => {
  e.preventDefault();

  (async () => {
    try {
      const payload = {
        full_name: fullName || email.split('@')[0],
        email_id: email,
        password,
        mobile_number: mobileNumber || "0000000000",
        province_id: provinceId,
        salutation,
        job_status: jobStatus,
      };

      await api.signup(payload);
      navigate("/app");
    } catch (err) {
      alert(err.message || 'Signup failed');
    }
  })();
};

  return (
    <>
      <Navbar />

      <section
        style={{
          minHeight: "85vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff"
        }}
      >
        <div
          style={{
            width: "420px",
            padding: "40px",
            borderRadius: "20px",
            border: "1px solid #C9A24D",
            boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
            background: "#fff",
            textAlign: "center"
          }}
        >
          <h2 style={{ fontSize: "32px", marginBottom: "10px" }}>
            Create Account
          </h2>

          <p style={{ color: "#777", marginBottom: "30px" }}>
            Start your wealth journey with JitWealth
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              style={inputStyle}
            />

            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />

            <input
              type="password"
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />

            <input
              type="tel"
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
              style={inputStyle}
            />

            <input
              type="number"
              min="1"
              placeholder="Province ID"
              value={provinceId}
              onChange={(e) => setProvinceId(Number(e.target.value))}
              required
              style={inputStyle}
            />

            <select
              value={salutation}
              onChange={(e) => setSalutation(Number(e.target.value))}
              required
              style={inputStyle}
            >
              <option value={1}>Mr</option>
              <option value={2}>Mrs</option>
              <option value={3}>Ms</option>
            </select>

            <select
              value={jobStatus}
              onChange={(e) => setJobStatus(Number(e.target.value))}
              required
              style={inputStyle}
            >
              <option value={1}>Salaried</option>
              <option value={2}>Self Employed</option>
              <option value={3}>Student</option>
              <option value={4}>Retired</option>
              <option value={5}>Business</option>
            </select>

            <button type="submit" style={primaryBtn}>
              Sign Up
            </button>
          </form>

          <p style={{ marginTop: "20px", color: "#555" }}>
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              style={{ color: "#C9A24D", cursor: "pointer", fontWeight: "600" }}
            >
              Login
            </span>
          </p>
        </div>
      </section>
    </>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "18px",
  borderRadius: "10px",
  border: "1px solid #C9A24D",
  fontSize: "15px"
};

const primaryBtn = {
  width: "100%",
  background: "#C9A24D",
  color: "#000",
  padding: "14px",
  borderRadius: "30px",
  border: "none",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer"
};
