"use client";

import { useEffect, useState } from "react";
import { Reliability, RequirementStatus, Resource } from "@/lib/types";
import { getResources, resetOverrides, saveOverride } from "@/lib/store";

function RequirementSelect({
  value,
  onChange,
  label,
}: {
  value: RequirementStatus;
  onChange: (v: RequirementStatus) => void;
  label: string;
}) {
  return (
    <select
      aria-label={label}
      value={value === null ? "unknown" : value ? "yes" : "no"}
      onChange={(e) =>
        onChange(
          e.target.value === "unknown" ? null : e.target.value === "yes"
        )
      }
      className="rounded-lg border border-brand-200 px-2 py-1 text-sm focus:border-brand-400 focus:outline-none"
    >
      <option value="yes">Yes</option>
      <option value="no">No</option>
      <option value="unknown">Unknown</option>
    </select>
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
                  <RequirementSelect
                    value={r.openTonight}
                    label={`${r.name} open tonight`}
                    onChange={(v) => update(r.id, { openTonight: v })}
                  />
                </td>
                <td className="px-3 py-3">
                  <RequirementSelect
                    value={r.walkIns}
                    label={`${r.name} walk-ins`}
                    onChange={(v) => update(r.id, { walkIns: v })}
                  />
                </td>
                <td className="px-3 py-3">
                  <RequirementSelect
                    value={r.allowsPets}
                    label={`${r.name} pets allowed`}
                    onChange={(v) => update(r.id, { allowsPets: v })}
                  />
                </td>
                <td className="px-3 py-3">
                  <RequirementSelect
                    value={r.requiresId}
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
        Reset to sourced defaults
      </button>
    </div>
  );
}
