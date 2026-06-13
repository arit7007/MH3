"use client";

export default function PageEntry({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        animation: "page-enter 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        transformOrigin: "center 30%",
      }}
    >
      {children}
    </div>
  );
}
