import { useState } from "react";
import AppNavbar from "../components/AppNavbar";

export default function VideoLesson() {
  const [activeLesson, setActiveLesson] = useState(1);

  const lessons = [
    {
      id: 1,
      title: "Market Structure Basics",
      video: "/videos/lesson1.mp4",
      completed: true,
    },
    {
      id: 2,
      title: "Entry & Stop Loss Logic",
      video: "/videos/lesson2.mp4",
      completed: false,
    },
    {
      id: 3,
      title: "Target Mapping",
      video: "/videos/lesson3.mp4",
      completed: false,
    },
    {
      id: 4,
      title: "Live Market Examples",
      locked: true,
    },
  ];

  const current = lessons.find((l) => l.id === activeLesson);

  return (
    <>
      <AppNavbar />

      <div
        style={{
          minHeight: "100vh",
          paddingTop: "110px",
          background: "#0b0b0b",
          color: "#fff",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "auto",
            display: "grid",
            gridTemplateColumns: "3fr 1.2fr",
            gap: "24px",
            padding: "30px",
          }}
        >
          {/* VIDEO PLAYER */}
          <div
            style={{
              background: "#000",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 0 60px rgba(201,162,77,0.4)",
            }}
          >
            {current?.locked ? (
              <LockedView />
            ) : (
              <video
                src={current?.video}
                controls
                autoPlay
                style={{
                  width: "100%",
                  height: "520px",
                  background: "#000",
                }}
              />
            )}

            <div style={{ padding: "16px" }}>
              <h2 style={{ fontSize: "22px" }}>{current?.title}</h2>
            </div>
          </div>

          {/* LESSON LIST */}
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(12px)",
              borderRadius: "20px",
              padding: "20px",
              border: "1px solid rgba(201,162,77,0.4)",
              height: "100%",
            }}
          >
            <h3 style={{ marginBottom: "14px", color: "#C9A24D" }}>
              Course Lessons
            </h3>

            {lessons.map((lesson) => (
              <LessonRow
                key={lesson.id}
                lesson={lesson}
                active={lesson.id === activeLesson}
                onClick={() =>
                  !lesson.locked && setActiveLesson(lesson.id)
                }
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ================= COMPONENTS ================= */

function LessonRow({ lesson, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "14px",
        borderRadius: "14px",
        background: active ? "#C9A24D" : "transparent",
        color: active ? "#000" : "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: lesson.locked ? "not-allowed" : "pointer",
        marginBottom: "10px",
        opacity: lesson.locked ? 0.5 : 1,
      }}
    >
      <span style={{ fontWeight: "600" }}>{lesson.title}</span>

      {lesson.completed && "✔"}
      {lesson.locked && "🔒"}
    </div>
  );
}

function LockedView() {
  return (
    <div
      style={{
        height: "520px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
        color: "#fff",
      }}
    >
      <h2 style={{ color: "#C9A24D" }}>🔒 Lesson Locked</h2>
      <p style={{ color: "#aaa", marginTop: "10px" }}>
        Purchase the course to unlock this lesson
      </p>

      <button
        style={{
          marginTop: "20px",
          padding: "12px 26px",
          borderRadius: "24px",
          background: "#C9A24D",
          border: "none",
          fontWeight: "800",
          cursor: "pointer",
        }}
      >
        Buy Course
      </button>
    </div>
  );
}
