"use client";

import { motion } from "framer-motion";
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  FilePlus,
  ScanLine,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

const eventConfig = {
  dispensed: {
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  blocked: {
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  created: {
    icon: FilePlus,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  verified: {
    icon: ScanLine,
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
};

export default function PharmacyCompliance() {
  const { complianceLogs } = useApp();

  const sorted = [...complianceLogs].sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
          <ClipboardCheck className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Audit Trail</h1>
          <p className="text-sm text-slate-500">
            Complete compliance event log
          </p>
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left py-3 px-4 font-medium text-slate-500">
                  Event
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">
                  Rx ID
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">
                  Patient
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">
                  Drug
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">
                  Message
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((log, i) => {
                const config = eventConfig[log.eventType];
                const Icon = config.icon;
                return (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.04 }}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {log.eventType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-emerald-600">
                      {log.prescriptionId}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {log.patientName}
                    </td>
                    <td className="py-3 px-4 text-slate-700">{log.drug}</td>
                    <td className="py-3 px-4 text-slate-500 text-xs max-w-[200px] truncate">
                      {log.message}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
