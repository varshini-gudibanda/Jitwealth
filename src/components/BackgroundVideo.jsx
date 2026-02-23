export default function BackgroundVideo() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -2,
        overflow: "hidden"
      }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.7) contrast(1.1)" // 🔥 soft darkness
        }}
      >
        <source src="/bg.mp4" type="video/mp4" />
      </video>

      {/* LIGHT OVERLAY */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.35)" // ✨ light overlay
        }}
      />
    </div>
  );
}
