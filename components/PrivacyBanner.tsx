export default function PrivacyBanner({
  variant = "demo",
}: {
  variant?: "demo" | "privacy";
}) {
  if (variant === "privacy") {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-brand-100 bg-brand-50 px-4 py-3">
        <span aria-hidden className="mt-0.5 text-base text-brand-500">🔒</span>
        <p className="text-sm text-brand-800">
          No account required. Sensitive details are used only to create a plan
          and can be cleared anytime.
        </p>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
      <span aria-hidden className="mt-0.5 text-base">⚠️</span>
      <p className="text-sm text-amber-900">
        DignityLink uses demo resource data. Availability is not guaranteed.
        Please call to confirm before traveling.
      </p>
    </div>
  );
}
