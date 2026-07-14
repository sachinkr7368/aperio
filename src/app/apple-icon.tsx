import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon matching Aperio logo mark */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1d4ed8",
          borderRadius: 40,
        }}
      >
        <div
          style={{
            width: 168,
            height: 168,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#2563eb",
            borderRadius: 36,
            position: "relative",
          }}
        >
          <div
            style={{
              color: "white",
              fontSize: 108,
              fontWeight: 700,
              fontFamily: "system-ui, sans-serif",
              lineHeight: 1,
              letterSpacing: "-0.04em",
            }}
          >
            A
          </div>
          <div
            style={{
              position: "absolute",
              top: 28,
              right: 28,
              width: 28,
              height: 28,
              borderRadius: 999,
              background: "#93c5fd",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
