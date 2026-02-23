import { useParams } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";

export default function CourseDetail() {
  const { id } = useParams();

  const course = {
    title: "Intraday Trading Mastery",
    description:
      "Master high-probability intraday setups with proper risk management.",
    progress: 65,
    lessons: [
      { id: 1, title: "Market Structure Basics", completed: true },
      { id: 2, title: "Entry & Stop Loss Logic", completed: true },
      { id: 3, title: "Target Mapping", completed: false },
      { id: 4, title: "Live Market Examples", locked: true },
    ],
  };

  return (
    <>
      <AppNavbar />

      <div
        style={{
          minHeight: "100vh",
          paddingTop: "120px",
          background: "#fafafa",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            maxWidth: "1100px",
            margin: "auto",
            padding: "40px",
            background: "#fff",
            borderRadius: "24px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
          }}
        >
          <h1 style={{ fontSize: "36px", fontWeight: "900" }}>
            {course.title}
          </h1>

          <p style={{ marginTop: "12px", color: "#555" }}>
            {course.description}
          </p>

          {/* PROGRESS */}
          <div style={{ marginTop: "20px" }}>
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
            <p style={{ marginTop: "6px", fontSize: "14px" }}>
              Progress: {course.progress}%
            </p>
          </div>

          {/* LESSON LIST */}
          <div style={{ marginTop: "30px" }}>
            {course.lessons.map((lesson) => (
              <LessonItem key={lesson.id} lesson={lesson} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ================= COMPONENTS ================= */

function LessonItem({ lesson }) {
  return (
    <div
      style={{
        padding: "16px 20px",
        borderRadius: "14px",
        background: lesson.locked ? "#f5f5f5" : "#fff",
        border: "1px solid #eee",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px",
        opacity: lesson.locked ? 0.6 : 1,
      }}
    >
      <span style={{ fontWeight: "600" }}>{lesson.title}</span>

      {lesson.completed && <span>✔</span>}
      {lesson.locked && <span>🔒</span>}
      {!lesson.completed && !lesson.locked && (
        <button
          style={{
            padding: "6px 14px",
            borderRadius: "16px",
            border: "none",
            background: "#C9A24D",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Play
        </button>
      )}
    </div>
  );
}
