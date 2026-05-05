import { useEffect, useState } from "react";
import AppNavbar from "../components/AppNavbar";
import api from "../api/client";

/* ================= MAIN ================= */

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState(null);

  const filters = ["All", "In Progress", "Completed", "Expired", "Paid"];

  /* Fetch courses from backend */
  useEffect(() => {
    (async () => {
      try {
        const data = await api.getMyCourses();
        setCourses(Array.isArray(data) ? data : data.courses || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError(err.message);
        setLoading(false);
      }
    })();
  }, []);

  const filteredCourses =
    activeFilter === "All"
      ? courses
      : courses.filter((c) => c.status === activeFilter);

  return (
    <>
      <AppNavbar />

      <div
        style={{
          minHeight: "100vh",
          paddingTop: "130px",
          paddingBottom: "120px",
          background: darkMode ? "#0b0b0b" : "#fafafa",
          color: darkMode ? "#fff" : "#000",
          transition: "0.4s",
        }}
      >
        {/* HEADER */}
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1 style={{ fontSize: "32px", fontWeight: "800" }}>Courses</h1>

            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                padding: "8px 14px",
                borderRadius: "20px",
                border: "1px solid #C9A24D",
                background: "transparent",
                cursor: "pointer",
                fontWeight: "700",
                color: "#C9A24D",
              }}
            >
              {darkMode ? "☀ Light" : "🌙 Dark"}
            </button>
          </div>

          {/* SEARCH + DROPDOWN */}
          <div
            style={{
              display: "flex",
              gap: "14px",
              marginTop: "22px",
              flexWrap: "wrap",
            }}
          >
            <input
              placeholder="Search by course title or description"
              style={{
                flex: 1,
                minWidth: "260px",
                padding: "14px 18px",
                borderRadius: "10px",
                border: "1px solid #ddd",
                fontSize: "15px",
              }}
            />

            <select
              style={{
                padding: "14px 18px",
                borderRadius: "10px",
                border: "1px solid #ddd",
                fontSize: "15px",
                background: "#fff",
              }}
            >
              <option>Course</option>
              <option>Bundle</option>
            </select>
          </div>

          {/* FILTER PILLS */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "18px",
              flexWrap: "wrap",
            }}
          >
            {filters.map((f) => (
              <FilterPill
                key={f}
                active={activeFilter === f}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </FilterPill>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div
          style={{
            maxWidth: "1100px",
            margin: "60px auto 0",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: "30px",
          }}
        >
          {loading &&
            [...Array(3)].map((_, i) => <SkeletonCard key={i} />)}

          {!loading &&
            filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
        </div>

        {!loading && filteredCourses.length === 0 && (
          <div style={{ textAlign: "center", marginTop: "80px" }}>
            <div style={{ fontSize: "80px" }}>🔍</div>
            <h3>No courses found</h3>
          </div>
        )}
      </div>
    </>
  );
}

/* ================= COMPONENTS ================= */

function CourseCard({ course }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "22px",
        overflow: "hidden",
        boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
        border: "1px solid #eee",
        transition: "0.3s",
      }}
    >
      {/* IMAGE */}
      <img
        src={course.image}
        alt={course.title}
        style={{
          width: "100%",
          height: "160px",
          objectFit: "cover",
        }}
      />

      <div style={{ padding: "22px" }}>
        <StatusBadge status={course.status} />

        <h3 style={{ marginTop: "12px", fontWeight: "800" }}>
          {course.title}
        </h3>

        <p style={{ color: "#666", marginTop: "6px" }}>
          {course.description}
        </p>

        {/* PROGRESS */}
        <div style={{ marginTop: "18px" }}>
          <div
            style={{
              height: "8px",
              borderRadius: "10px",
              background: "#eee",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${course.progress}%`,
                height: "100%",
                background: "#C9A24D",
              }}
            />
          </div>

          <div
            style={{
              marginTop: "6px",
              fontSize: "13px",
              color: "#555",
            }}
          >
            Progress: {course.progress}%
          </div>
        </div>

        {/* ACTION */}
        <button
          style={{
            marginTop: "18px",
            padding: "12px",
            width: "100%",
            borderRadius: "20px",
            border: "none",
            background: "#C9A24D",
            fontWeight: "800",
            cursor: "pointer",
          }}
        >
          {course.progress === 100 ? "View Course" : "Continue"}
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    "In Progress": "#1e90ff",
    Completed: "#2ecc71",
    Paid: "#f39c12",
    Expired: "#e74c3c",
  };

  return (
    <span
      style={{
        fontSize: "12px",
        padding: "4px 12px",
        borderRadius: "14px",
        background: colors[status],
        color: "#fff",
        fontWeight: "700",
      }}
    >
      {status}
    </span>
  );
}

function FilterPill({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 16px",
        borderRadius: "20px",
        border: active ? "none" : "1px solid #ddd",
        background: active ? "#C9A24D" : "#fff",
        color: active ? "#000" : "#333",
        fontWeight: "600",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function SkeletonCard() {
  return (
    <div
      style={{
        height: "280px",
        borderRadius: "22px",
        background:
          "linear-gradient(90deg,#eee 25%,#f5f5f5 37%,#eee 63%)",
        backgroundSize: "400% 100%",
        animation: "skeleton 1.4s infinite",
      }}
    />
  );
}
