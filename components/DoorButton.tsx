"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DoorButton() {
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "open">("idle");

  function handleDoor() {
    if (phase !== "idle") return;
    setPhase("open");
    // Navigate as the door finishes swinging — intake page expands in on its own
    setTimeout(() => router.push("/intake"), 720);
  }

  return (
    <>

      <div className="flex flex-col items-center" style={{ userSelect: "none" }}>
        {/* House */}
        <div
          className="relative"
          style={{
            width: "264px",
            filter: "drop-shadow(0 14px 36px rgba(157,79,73,0.16))",
          }}
        >
          {/* ── Roof ── */}
          <div
            style={{
              height: "88px",
              background: "#9D4F49",
              clipPath: "polygon(0% 100%, 50% 0%, 100% 100%)",
            }}
          />

          {/* ── Chimney (same fill as roof so it merges naturally) ── */}
          <div
            className="absolute"
            style={{
              width: "20px",
              height: "36px",
              top: "10px",
              left: "76px",
              background: "#9D4F49",
              borderTop: "2.5px solid #5C3A38",
              borderLeft: "2px solid #5C3A38",
              borderRight: "2px solid #5C3A38",
              zIndex: 10,
            }}
          />

          {/* ── Walls ── */}
          <div
            className="relative"
            style={{
              height: "168px",
              background: "#F5E6E4",
              borderLeft: "2.5px solid #D9A8A2",
              borderRight: "2.5px solid #D9A8A2",
            }}
          >
            {/* Left window */}
            <div className="absolute" style={{ left: "18px", top: "22px" }}>
              <HouseWindow />
            </div>

            {/* Right window */}
            <div className="absolute" style={{ right: "18px", top: "22px" }}>
              <HouseWindow />
            </div>

            {/* ── Door ── */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2"
              style={{ width: "56px", height: "84px", perspective: "520px" }}
            >
              {/* Dark room behind door, revealed when it swings open */}
              <div
                className="absolute inset-0 bg-brand-900"
                style={{ borderRadius: "3px 3px 0 0" }}
              />

              {/* White door panel */}
              <button
                onClick={handleDoor}
                aria-label="Open the door to find resources"
                className="group absolute inset-0 focus:outline-none"
                style={{
                  background: "white",
                  border: "1.5px solid #D9A8A2",
                  borderRadius: "3px 3px 0 0",
                  transformOrigin: "left center",
                  transform:
                    phase !== "idle" ? "rotateY(-112deg)" : "rotateY(0deg)",
                  transition: "transform 0.78s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                }}
              >
                {/* Upper recessed panel */}
                <div
                  className="absolute border border-brand-100"
                  style={{ top: "7px", left: "7px", right: "7px", bottom: "52%" }}
                />
                {/* Lower recessed panel */}
                <div
                  className="absolute border border-brand-100"
                  style={{ top: "53%", left: "7px", right: "7px", bottom: "7px" }}
                />
                {/* Door knob */}
                <div
                  className="absolute rounded-full transition-colors duration-150 group-hover:bg-brand-400"
                  style={{
                    width: "7px",
                    height: "7px",
                    right: "9px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "#C47D77",
                  }}
                />
              </button>
            </div>
          </div>

          {/* ── Foundation ── */}
          <div
            style={{
              height: "10px",
              background: "#EDCECA",
              borderLeft: "2.5px solid #D9A8A2",
              borderRight: "2.5px solid #D9A8A2",
              borderBottom: "2.5px solid #D9A8A2",
            }}
          />

          {/* ── Front step ── */}
          <div
            className="mx-auto"
            style={{ width: "72px", height: "7px", background: "#D9A8A2" }}
          />

          {/* ── Pathway stones ── */}
          <div
            className="mx-auto flex justify-center gap-2"
            style={{ marginTop: "6px" }}
          >
            {[0, 1].map((i) => (
              <div
                key={i}
                className="rounded-sm"
                style={{ width: "22px", height: "16px", background: "#EDCECA" }}
              />
            ))}
          </div>
        </div>

        {/* Hint text */}
        <p className="mt-8 font-display text-2xl font-bold italic text-brand-600 sm:text-3xl">
          Open the door to find out more
        </p>
      </div>
    </>
  );
}

function HouseWindow() {
  return (
    <div
      className="relative"
      style={{
        width: "52px",
        height: "44px",
        background: "#FDF6F5",
        border: "2px solid #D9A8A2",
      }}
    >
      {/* Window sill */}
      <div
        className="absolute"
        style={{
          bottom: "-7px",
          left: "-5px",
          right: "-5px",
          height: "7px",
          background: "#D9A8A2",
          borderRadius: "0 0 2px 2px",
        }}
      />
      {/* Vertical pane divider */}
      <div
        className="absolute"
        style={{
          top: 0,
          bottom: 0,
          left: "50%",
          width: "1.5px",
          background: "#D9A8A2",
          transform: "translateX(-50%)",
        }}
      />
      {/* Horizontal pane divider */}
      <div
        className="absolute"
        style={{
          left: 0,
          right: 0,
          top: "50%",
          height: "1.5px",
          background: "#D9A8A2",
          transform: "translateY(-50%)",
        }}
      />
    </div>
  );
}
