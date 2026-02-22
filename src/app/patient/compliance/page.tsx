"use client";

import { motion } from "framer-motion";
import { ShieldCheck, TrendingUp, Pill } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function PatientCompliance() {
  const { user, prescriptions, dispenseRecords, getComplianceRate } = useApp();
  const compliance = getComplianceRate(user?.id || "");
  const patientRx = prescriptions.filter((p) => p.patientId === user?.id);
  const patientDispenses = dispenseRecords.filter((d) =>
    patientRx.map((r) => r.id).includes(d.prescriptionId)
  );
  const dispensedCount = patientDispenses.filter((d) => d.status === "dispensed").length;
  const blockedCount = patientDispenses.filter((d) => d.status === "blocked").length;

  const color =
    compliance >= 80
      ? { stroke: "#10b981", bg: "bg-emerald-50", text: "text-emerald-600", label: "Excellent" }
      : compliance >= 60
      ? { stroke: "#f59e0b", bg: "bg-amber-50", text: "text-amber-600", label: "Fair" }
      : { stroke: "#ef4444", bg: "bg-red-50", text: "text-red-600", label: "Needs Improvement" };

  // SVG circle properties
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (compliance / 100) * circumference;

  const stats = [
    { label: "Dispensed", value: dispensedCount, icon: Pill, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Blocked", value: blockedCount, icon: ShieldCheck, color: "text-red-600", bg: "bg-red-50" },
    { label: "Active Rx", value: patientRx.filter((r) => r.status === "active").length, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Compliance Report</h2>
        <p className="text-sm text-slate-500 mt-1">Your medication adherence overview</p>
      </div>

      {/* Circular Chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center"
      >
        <div className="relative w-48 h-48">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="12"
            />
            {/* Animated foreground circle */}
            <motion.circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={color.stroke}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-slate-900">{compliance}%</span>
            <span className={`text-xs font-medium ${color.text}`}>{color.label}</span>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 text-center"
          >
            <div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center mx-auto mb-2`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="text-lg font-bold text-slate-900">{stat.value}</p>
            <p className="text-[10px] text-slate-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Per-prescription breakdown */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
          By Prescription
        </h3>
        <div className="space-y-2">
          {patientRx.map((rx, i) => {
            const rxDispenses = patientDispenses.filter((d) => d.prescriptionId === rx.id && d.status === "dispensed");
            const rxTotal = patientDispenses.filter((d) => d.prescriptionId === rx.id);
            const rxRate = rxTotal.length > 0 ? Math.round((rxDispenses.length / rxTotal.length) * 100) : 0;
            return (
              <motion.div
                key={rx.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="bg-white rounded-xl p-3 shadow-sm border border-slate-100"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{rx.drug}</p>
                    <p className="text-xs text-slate-400">{rx.id}</p>
                  </div>
                  <span className="text-sm font-bold text-slate-700">{rxRate}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${rxRate}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: rxRate >= 80 ? "#10b981" : rxRate >= 60 ? "#f59e0b" : "#ef4444" }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
