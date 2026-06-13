"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DoorButton() {
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "open" | "enter">("idle");

  function handleClick() {
    if (phase !== "idle") return;
    setPhase("open");
    setTimeout(() => setPhase("enter"), 750);
    setTimeout(() => router.push("/intake"), 1450);
  }

  return (
    <>
      {phase !== "idle" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-brand-50">
          <div
            style={{
              transform: phase === "enter" ? "scale(35)" : "scale(1)",
              transition:
                phase === "enter"
                  ? "transform 0.7s cubic-bezier(0.55, 0, 1, 1)"
                  : "none",
            }}
          >
            {/* Door frame */}
            <div className="relative h-60 w-40" style={{ perspective: "700px" }}>
              {/* Dark doorway interior — revealed as door swings open */}
              <div className="absolute inset-0 border-4 border-brand-800 bg-brand-900" />

              {/* Door panel */}
              <div
                className="absolute inset-0 border-4 border-brand-800 bg-brand-600"
                style={{
                  transformOrigin: "left center",
                  transform:
                    phase === "open" || phase === "enter"
                      ? "rotateY(-115deg)"
                      : "rotateY(0deg)",
                  transition: "transform 0.72s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {/* Panel inset decoration */}
                <div className="absolute inset-3 border border-brand-500/50" />
                <div className="absolute inset-5 border border-brand-500/25" />
                {/* Door knob */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-2 rounded-full bg-brand-300" />
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleClick}
        className="btn-primary min-w-[18rem] px-12 py-5 text-2xl font-bold sm:min-w-[22rem] sm:px-16 sm:py-6 sm:text-3xl"
      >
        Start Navigator
      </button>
    </>
  );
}
