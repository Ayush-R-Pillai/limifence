"use client";

import { motion } from "framer-motion";
import { TrendingUp, Calendar, Pill, Activity } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function PatientInsights() {
  const { user, prescriptions, dispenseRecords } = useApp();
  const patientRx = prescriptions.filter((p) => p.patientId === user?.id);
  const patientDispenses = dispenseRecords.filter((d) =>
    patientRx.map((r) => r.id).includes(d.prescriptionId)
  );

  // Build daily dispense chart data (last 7 days)
  const now = new Date();
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (6 - i));
    const dayStr = date.toISOString().split("T")[0];
    const count = patientDispenses.filter(
      (d) => d.status === "dispensed" && d.dispensedAt.startsWith(dayStr)
    ).length;
    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      count,
    };
  });

  const maxCount = Math.max(...chartData.map((d) => d.count), 1);

  // Drug breakdown
  const drugMap: Record<string, number> = {};
  patientDispenses
    .filter((d) => d.status === "dispensed")
    .forEach((d) => {
      drugMap[d.drug] = (drugMap[d.drug] || 0) + d.quantity;
    });

  const stats = [
    {
      label: "Total Dispenses",
      value: patientDispenses.filter((d) => d.status === "dispensed").length,
      icon: Activity,
      bg: "bg-blue-50",
      color: "text-blue-600",
    },
    {
      label: "Drugs Taken",
      value: Object.keys(drugMap).length,
      icon: Pill,
      bg: "bg-violet-50",
      color: "text-violet-600",
    },
    {
      label: "Active Scripts",
      value: patientRx.filter((r) => r.status === "active").length,
      icon: Calendar,
      bg: "bg-emerald-50",
      color: "text-emerald-600",
    },
    {
      label: "Avg / Day",
      value: (
        patientDispenses.filter((d) => d.status === "dispensed").length / 7
      ).toFixed(1),
      icon: TrendingUp,
      bg: "bg-amber-50",
      color: "text-amber-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Insights</h2>
        <p className="text-sm text-slate-500 mt-1">
          Your medication analytics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
          >
            <div
              className={`w-9 h-9 ${stat.bg} rounded-lg flex items-center justify-center mb-2`}
            >
              <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
            </div>
            <p className="text-xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">
          Daily Dispenses (Last 7 Days)
        </h3>
        <div className="flex items-end justify-between gap-2 h-40">
          {chartData.map((d, i) => (
            <div
              key={d.day}
              className="flex flex-col items-center flex-1 h-full justify-end"
            >
              <span className="text-xs font-medium text-slate-600 mb-1">
                {d.count}
              </span>
              <motion.div
                initial={{ height: 0 }}
                animate={{
                  height: d.count > 0 ? `${(d.count / maxCount) * 100}%` : "4px",
                }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.6, ease: "easeOut" }}
                className={`w-full rounded-t-lg ${
                  d.count > 0
                    ? "bg-gradient-to-t from-blue-500 to-blue-400"
                    : "bg-slate-200"
                }`}
                style={{ minHeight: 4 }}
              />
              <span className="text-[10px] text-slate-400 mt-1.5">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Drug Breakdown */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">
          Units by Medication
        </h3>
        <div className="space-y-3">
          {Object.entries(drugMap).map(([drug, count], i) => {
            const total = Object.values(drugMap).reduce((a, b) => a + b, 0);
            const pct = Math.round((count / total) * 100);
            return (
              <motion.div
                key={drug}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
              >
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700 font-medium">{drug}</span>
                  <span className="text-slate-500">
                    {count} units ({pct}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-violet-500 to-violet-400 rounded-full"
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
