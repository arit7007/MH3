import IntakeForm from "@/components/IntakeForm";
import PrivacyBanner from "@/components/PrivacyBanner";

export default function IntakePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 pt-8">
      <div className="space-y-1">
        <p className="section-label">Navigator</p>
        <h1 className="text-3xl font-extrabold text-brand-900">
          Let's find what fits
        </h1>
        <p className="text-slate-500">
          A few simple questions. There are no wrong answers, and you choose
          what to share.
        </p>
      </div>
      <PrivacyBanner variant="privacy" />
      <IntakeForm />
    </div>
  );
}
