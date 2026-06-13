import ResourceAdminTable from "@/components/ResourceAdminTable";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-brand-900">Resource admin</h1>
        <p className="text-brand-700">
          Update resource status, hours, requirements, and reliability. Changes
          immediately affect recommendations across the app.
        </p>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Signed-in admin mode. Resource edits are still stored locally in your
        browser for this prototype.
      </div>

      <ResourceAdminTable />
    </div>
  );
}
