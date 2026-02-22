"use client";

import { motion } from "framer-motion";
import { Package, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function PharmacyHistory() {
  const { dispenseRecords } = useApp();

  const sorted = [...dispenseRecords].sort(
    (a, b) =>
      new Date(b.dispensedAt).getTime() - new Date(a.dispensedAt).getTime()
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dispense History</h1>
        <p className="text-sm text-slate-500 mt-1">
          Complete transaction log of all dispenses
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Records",
            value: sorted.length,
            icon: Package,
            bg: "bg-slate-100",
            color: "text-slate-600",
          },
          {
            label: "Dispensed",
            value: sorted.filter((d) => d.status === "dispensed").length,
            icon: CheckCircle2,
            bg: "bg-emerald-100",
            color: "text-emerald-600",
          },
          {
            label: "Blocked",
            value: sorted.filter((d) => d.status === "blocked").length,
            icon: XCircle,
            bg: "bg-red-100",
            color: "text-red-600",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-3"
          >
            <div
              className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}
            >
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left py-3 px-4 font-medium text-slate-500">
                  ID
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
                  Qty
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-500">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((record, i) => (
                <motion.tr
                  key={record.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.04 }}
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="py-3 px-4 font-mono text-xs text-slate-500">
                    {record.id}
                  </td>
                  <td className="py-3 px-4 font-medium text-emerald-600 text-xs">
                    {record.prescriptionId}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {record.patientName}
                  </td>
                  <td className="py-3 px-4 text-slate-700">{record.drug}</td>
                  <td className="py-3 px-4 text-slate-700">
                    {record.quantity}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === "dispensed"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-xs">
                    {new Date(record.dispensedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
