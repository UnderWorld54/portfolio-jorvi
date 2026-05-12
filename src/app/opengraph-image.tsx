import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Jorvi Kapela - Créateur Visuel";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000000",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow rouge en arrière-plan */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.02em",
          }}
        >
          JORVI KAPELA
        </div>

        <div
          style={{
            width: 80,
            height: 3,
            backgroundColor: "#ef4444",
            borderRadius: 2,
          }}
        />

        <div
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.6)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginTop: 8,
          }}
        >
          Créateur Visuel — Designer — Artiste
        </div>
      </div>
    </div>,
    { ...size },
  );
}
