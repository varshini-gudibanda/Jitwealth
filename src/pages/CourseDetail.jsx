import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
import api from "../api/client";

// Mock data for demo purposes
const mockCoursesData = {
  1: {
    id: 1,
    title: "Intraday Trading Mastery",
    description: "Learn high probability intraday strategies",
    progress: 65,
    lessons: [
      { id: 1, title: "Chapter 1: Introduction", completed: true },
      { id: 2, title: "Chapter 2: Fundamentals", completed: true },
      { id: 3, title: "Chapter 3: Advanced Concepts", completed: false },
      { id: 4, title: "Chapter 4: Case Studies", completed: false },
    ]
  },
  2: {
    id: 2,
    title: "Options Scalping Pro",
    description: "Advanced options scalping framework",
    progress: 100,
    lessons: [
      { id: 5, title: "Chapter 1: Options Basics", completed: true },
      { id: 6, title: "Chapter 2: Scalping Strategies", completed: true },
      { id: 7, title: "Chapter 3: Risk Management", completed: true },
      { id: 8, title: "Chapter 4: Advanced Techniques", completed: true },
    ]
  },
  3: {
    id: 3,
    title: "Swing Trading Blueprint",
    description: "Hold trades with confidence",
    progress: 0,
    lessons: [
      { id: 9, title: "Chapter 1: Introduction", completed: false },
      { id: 10, title: "Chapter 2: Fundamentals", completed: false },
      { id: 11, title: "Chapter 3: Advanced Concepts", completed: false },
      { id: 12, title: "Chapter 4: Case Studies", completed: false },
    ]
  }
};

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedChapter, setExpandedChapter] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/login");
      return;
    }

    // Try to get course data from navigation state first
    const courseFromState = location.state?.course;
    
    if (courseFromState) {
      // If course data exists from state, use it
      let courseData = courseFromState;
      let lessonsData = courseFromState.lessons;
      
      // If lessons are not in state, try to get from mock data
      if (!lessonsData || lessonsData.length === 0) {
        const mockData = mockCoursesData[courseFromState.id];
        if (mockData) {
          courseData = mockData;
          lessonsData = mockData.lessons;
        }
      }
      
      setCourse(courseData);
      setLessons(lessonsData || []);
      setLoading(false);
      return;
    }

    // Fetch course details from API
    Promise.all([
      api.getCourseById(courseId),
      api.getCourseLessons(courseId),
    ])
      .then(([courseData, lessonsData]) => {
        setCourse(courseData);
        const chaptersArray = Array.isArray(lessonsData) 
          ? lessonsData 
          : lessonsData?.lessons || [];
        setLessons(chaptersArray);
        setLoading(false);
      })
      .catch(() => {
        // Fallback with mock data specific to course ID
        const mockData = mockCoursesData[courseId] || {
          id: courseId,
          title: "Course Title",
          description: "Course description",
          progress: 45,
          lessons: [
            { id: 1, title: "Chapter 1: Introduction", completed: false },
            { id: 2, title: "Chapter 2: Fundamentals", completed: false },
            { id: 3, title: "Chapter 3: Advanced Concepts", completed: false },
            { id: 4, title: "Chapter 4: Case Studies", completed: false },
          ]
        };
        setCourse(mockData);
        setLessons(mockData.lessons || []);
        setLoading(false);
      });
  }, [courseId, navigate, location]);

  const handleCompleteLesson = async (lessonId) => {
    try {
      const result = await api.markLessonComplete(lessonId);
      // Update lesson completion status
      setLessons(lessons.map(l => 
        l.id === lessonId ? { ...l, completed: true } : l
      ));
      // Update course progress from the API response if available
      if (result && result.progress !== undefined) {
        setCourse(prev => ({ ...prev, progress: result.progress }));
      }
    } catch (err) {
      console.error("Failed to mark lesson complete:", err);
    }
  };

  if (loading) {
    return (
      <>
        <AppNavbar />
        <div style={{ 
          minHeight: "100vh", 
          paddingTop: "130px", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center" 
        }}>
          <div>Loading...</div>
        </div>
      </>
    );
  }

  if (!course) {
    return (
      <>
        <AppNavbar />
        <div style={{ minHeight: "100vh", paddingTop: "130px" }}>
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Course not found</h2>
            <button 
              onClick={() => navigate("/courses")}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                background: "#C9A24D",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: "700",
              }}
            >
              Back to Courses
            </button>
          </div>
        </div>
      </>
    );
  }

  const completedLessons = lessons.filter(l => l.completed).length;
  const totalLessons = lessons.length;
  // Use course.progress from backend if available, otherwise calculate from lessons
  const courseProgress = course.progress !== undefined ? course.progress : (totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0);

  return (
    <>
      <AppNavbar />
      <div
        style={{
          minHeight: "100vh",
          paddingTop: "130px",
          paddingBottom: "100px",
          background: "#fafafa",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 20px" }}>
          {/* HEADER */}
          <div style={{ marginBottom: "40px" }}>
            <button
              onClick={() => navigate("/courses")}
              style={{
                background: "transparent",
                border: "none",
                color: "#C9A24D",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
                marginBottom: "20px",
              }}
            >
              ← Back to Courses
            </button>

            <h1 style={{ fontSize: "36px", fontWeight: "800", marginBottom: "10px" }}>
              {course.title}
            </h1>

            <p style={{ color: "#666", fontSize: "16px", marginBottom: "30px" }}>
              {course.description}
            </p>

            {/* COURSE PROGRESS */}
            <div style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid #eee",
              marginBottom: "40px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ fontWeight: "700" }}>Course Progress</span>
                <span style={{ color: "#C9A24D", fontWeight: "700" }}>{courseProgress}%</span>
              </div>

              <div
                style={{
                  height: "12px",
                  borderRadius: "10px",
                  background: "#eee",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${courseProgress}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, #C9A24D, #FFD980)",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>

              <div style={{ marginTop: "12px", color: "#666", fontSize: "14px" }}>
                {completedLessons} of {totalLessons} chapters completed
              </div>
            </div>
          </div>

          {/* CHAPTERS LIST */}
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "20px" }}>
              Chapters
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {lessons.map((lesson, index) => (
                <ChapterCard
                  key={lesson.id}
                  chapter={lesson}
                  index={index + 1}
                  isExpanded={expandedChapter === lesson.id}
                  onExpand={() => setExpandedChapter(expandedChapter === lesson.id ? null : lesson.id)}
                  onComplete={() => handleCompleteLesson(lesson.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ChapterCard({ chapter, index, isExpanded, onExpand, onComplete }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        border: "1px solid #eee",
        overflow: "hidden",
        transition: "0.3s",
      }}
    >
      {/* CHAPTER HEADER */}
      <div
        onClick={onExpand}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "20px",
          cursor: "pointer",
          background: chapter.completed ? "#f0f8f0" : "#fff",
          borderBottom: isExpanded ? "1px solid #eee" : "none",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = chapter.completed ? "#f0f8f0" : "#f9f9f9")}
        onMouseLeave={(e) => (e.currentTarget.style.background = chapter.completed ? "#f0f8f0" : "#fff")}
      >
        {/* CHECKBOX */}
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            border: "2px solid #C9A24D",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "16px",
            background: chapter.completed ? "#C9A24D" : "transparent",
            color: "#fff",
            fontWeight: "700",
            fontSize: "14px",
          }}
        >
          {chapter.completed && "✓"}
        </div>

        {/* CHAPTER INFO */}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: "700", fontSize: "16px", color: "#000" }}>
            {chapter.title}
          </div>
          {chapter.description && (
            <div style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}>
              {chapter.description}
            </div>
          )}
        </div>

        {/* EXPAND ICON */}
        <div
          style={{
            fontSize: "20px",
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "0.3s",
            marginLeft: "16px",
          }}
        >
          ▼
        </div>
      </div>

      {/* CHAPTER CONTENT */}
      {isExpanded && (
        <div
          style={{
            padding: "20px",
            background: "#fafafa",
            borderTop: "1px solid #eee",
          }}
        >
          <p style={{ color: "#666", marginBottom: "20px", lineHeight: "1.6" }}>
            {chapter.description || "Chapter content will be displayed here when you click play."}
          </p>

          {!chapter.completed && (
            <button
              onClick={onComplete}
              style={{
                padding: "12px 24px",
                background: "#C9A24D",
                border: "none",
                borderRadius: "20px",
                color: "#000",
                fontWeight: "700",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              ▶ Watch Chapter
            </button>
          )}

          {chapter.completed && (
            <div style={{
              padding: "12px 24px",
              background: "#e8f5e9",
              borderRadius: "20px",
              color: "#2ecc71",
              fontWeight: "700",
              textAlign: "center",
            }}>
              ✓ Completed
            </div>
          )}
        </div>
      )}
    </div>
  );
}
