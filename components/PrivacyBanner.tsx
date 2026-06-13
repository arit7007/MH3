export default function PrivacyBanner({
  variant = "demo",
}: {
  variant?: "demo" | "privacy";
}) {
  if (variant === "privacy") {
    return (
      <div className="flex items-start gap-3 border border-brand-200 bg-brand-50 px-4 py-3 rounded-sm">
        <span className="section-label mt-0.5">Private</span>
        <p className="text-base text-brand-700">
          No account required. Sensitive details are used only to create a plan
          and can be cleared anytime.
        </p>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-3 border border-amber-200 bg-amber-50 px-4 py-3 rounded-sm">
      <span className="section-label mt-0.5 text-amber-700">Note</span>
      <p className="text-base text-amber-900">
        Harbor uses publicly listed resource data. Hours, bed space, and
        intake rules can change quickly. Please call to confirm before traveling.
      </p>
    </div>
  );
}
