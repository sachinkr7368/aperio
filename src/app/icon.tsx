import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Browser tab favicon — matches Aperio logo:
 * blue rounded square + white "A" + light accent dot
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2563eb",
          borderRadius: 8,
          position: "relative",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: 700,
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1,
            marginTop: -1,
            letterSpacing: "-0.04em",
          }}
        >
          A
        </div>
        <div
          style={{
            position: "absolute",
            top: 5,
            right: 5,
            width: 6,
            height: 6,
            borderRadius: 999,
            background: "#93c5fd",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
