export default function PrivacyBanner({ variant = "demo" }: { variant?: "demo" | "privacy" }) {
  if (variant === "privacy") {
    return (
      <div className="rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-800">
        No account required. Sensitive details are used only to create a plan and
        can be cleared anytime.
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      DignityLink uses demo resource data. Availability is not guaranteed. Please
      call to confirm before traveling.
    </div>
  );
}
