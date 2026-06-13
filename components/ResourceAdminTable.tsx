"use client";

import { useEffect, useState } from "react";
import { Reliability, Resource } from "@/lib/types";
import { getResources, resetOverrides, saveOverride } from "@/lib/store";

function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
        on ? "bg-brand-600" : "bg-slate-300"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
          on ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function ResourceAdminTable() {
  const [rows, setRows] = useState<Resource[]>([]);

  useEffect(() => {
    setRows(getResources());
  }, []);

  function update(id: string, patch: Partial<Resource>) {
    saveOverride(id, patch);
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function reset() {
    resetOverrides();
    setRows(getResources());
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-2xl border border-brand-100 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-brand-50 text-brand-700">
            <tr>
              <th className="px-3 py-3 font-semibold">Resource</th>
              <th className="px-3 py-3 font-semibold">Open tonight</th>
              <th className="px-3 py-3 font-semibold">Walk-ins</th>
              <th className="px-3 py-3 font-semibold">Pets</th>
              <th className="px-3 py-3 font-semibold">ID required</th>
              <th className="px-3 py-3 font-semibold">Intake hours</th>
              <th className="px-3 py-3 font-semibold">Reliability</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-50">
            {rows.map((r) => (
              <tr key={r.id} className="align-middle">
                <td className="px-3 py-3 font-medium text-brand-900">{r.name}</td>
                <td className="px-3 py-3">
                  <Toggle
                    on={r.openTonight}
                    label={`${r.name} open tonight`}
                    onChange={(v) => update(r.id, { openTonight: v })}
                  />
                </td>
                <td className="px-3 py-3">
                  <Toggle
                    on={r.walkIns}
                    label={`${r.name} walk-ins`}
                    onChange={(v) => update(r.id, { walkIns: v })}
                  />
                </td>
                <td className="px-3 py-3">
                  <Toggle
                    on={r.allowsPets}
                    label={`${r.name} pets allowed`}
                    onChange={(v) => update(r.id, { allowsPets: v })}
                  />
                </td>
                <td className="px-3 py-3">
                  <Toggle
                    on={r.requiresId}
                    label={`${r.name} ID required`}
                    onChange={(v) => update(r.id, { requiresId: v })}
                  />
                </td>
                <td className="px-3 py-3">
                  <input
                    className="w-36 rounded-lg border border-brand-200 px-2 py-1 text-sm focus:border-brand-400 focus:outline-none"
                    value={r.intakeHours}
                    onChange={(e) => update(r.id, { intakeHours: e.target.value })}
                  />
                </td>
                <td className="px-3 py-3">
                  <select
                    className="rounded-lg border border-brand-200 px-2 py-1 text-sm focus:border-brand-400 focus:outline-none"
                    value={r.reliability}
                    onChange={(e) =>
                      update(r.id, { reliability: e.target.value as Reliability })
                    }
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="btn-secondary" onClick={reset}>
        Reset to demo defaults
      </button>
    </div>
  );
}
