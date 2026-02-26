export default function CourseCard({ image, title, desc, onClick }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #C9A24D",
        borderRadius: "20px",
        padding: "20px",
        boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        transition: "0.3s"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow =
          "0 25px 45px rgba(201,162,77,0.35)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 15px 35px rgba(0,0,0,0.08)";
      }}
    >
      {/* COURSE IMAGE */}
      <img
        src={image}
        alt={title}
        style={{
          width: "100%",
          height: "160px",
          objectFit: "cover",
          borderRadius: "14px",
          marginBottom: "14px"
        }}
      />

      {/* TITLE */}
      <h3
        style={{
          color: "#111",
          marginBottom: "8px",
          fontSize: "18px"
        }}
      >
        {title}
      </h3>

      {/* DESCRIPTION */}
      <p
        style={{
          color: "#666",
          fontSize: "14px",
          lineHeight: "1.5",
          flexGrow: 1
        }}
      >
        {desc}
      </p>

      {/* ACTION BUTTON */}
      <button
        onClick={onClick}
        style={{
          marginTop: "16px",
          background: "#C9A24D",
          color: "#000",
          border: "none",
          borderRadius: "22px",
          padding: "12px",
          fontWeight: "700",
          cursor: "pointer"
        }}
      >
        View Details
      </button>
    </div>
  );
}
