import IntakeForm from "@/components/IntakeForm";
import PrivacyBanner from "@/components/PrivacyBanner";

export default function IntakePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 pt-12">
      <div className="space-y-2">
        <p className="section-label">Navigator</p>
        <h1 className="font-display text-4xl font-bold text-brand-900">
          Let's find <em className="italic text-brand-500">what fits.</em>
        </h1>
        <p className="text-sm text-brand-700">
          A few simple questions. There are no wrong answers, and you choose
          what to share.
        </p>
      </div>
      <PrivacyBanner variant="privacy" />
      <IntakeForm />
    </div>
  );
}
