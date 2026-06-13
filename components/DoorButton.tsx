"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DoorButton() {
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "open" | "zoom">("idle");

  function handleClick() {
    if (phase !== "idle") return;
    setPhase("open");
    setTimeout(() => setPhase("zoom"), 750);
    setTimeout(() => router.push("/intake"), 1500);
  }

  return (
    <>
      {phase !== "idle" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-brand-50">
          {/* Zoom wrapper — scales up so the doorway fills the screen */}
          <div
            style={{
              transform: phase === "zoom" ? "scale(28)" : "scale(1)",
              transition:
                phase === "zoom"
                  ? "transform 0.75s cubic-bezier(0.55, 0, 1, 1)"
                  : "none",
            }}
          >
            {/* Door frame — matches button proportions */}
            <div
              className="relative h-[4.5rem] w-80 sm:w-[22rem]"
              style={{ perspective: "900px" }}
            >
              {/* Intake form preview — visible as door swings open */}
              <div className="absolute inset-0 overflow-hidden rounded-sm bg-brand-50">
                <div className="flex h-full flex-col gap-1 p-2">
                  {/* Step bars */}
                  <div className="flex gap-0.5">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-0.5 flex-1 rounded-full ${
                          i === 0 ? "bg-brand-500" : "bg-brand-200"
                        }`}
                      />
                    ))}
                  </div>
                  {/* Heading */}
                  <div className="mt-0.5 h-1.5 w-2/3 rounded bg-brand-900" />
                  <div className="h-1 w-2/5 rounded bg-brand-300" />
                  {/* Option buttons grid */}
                  <div className="mt-1 grid grid-cols-2 gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-3 rounded-sm border ${
                          i === 0
                            ? "border-brand-400 bg-brand-50"
                            : "border-brand-200 bg-white"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Door panel — looks exactly like the button, swings open */}
              <div
                className="absolute inset-0 flex items-center justify-center rounded-sm bg-brand-600"
                style={{
                  transformOrigin: "left center",
                  transform:
                    phase === "open" || phase === "zoom"
                      ? "rotateY(-115deg)"
                      : "rotateY(0deg)",
                  transition: "transform 0.72s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <span className="text-sm font-semibold uppercase tracking-widest text-white">
                  Start Navigator
                </span>
                {/* Door knob */}
                <div className="absolute right-3 top-1/2 h-3 w-1 -translate-y-1/2 rounded-full bg-white/40" />
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
