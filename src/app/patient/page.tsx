"use client";

import { motion } from "framer-motion";
import { Pill, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function PatientHome() {
  const { user, prescriptions, getComplianceRate } = useApp();
  const patientRx = prescriptions.filter((p) => p.patientId === user?.id);
  const activeRx = patientRx.filter((p) => p.status === "active");
  const compliance = getComplianceRate(user?.id || "");

  const stats = [
    {
      label: "Active Prescriptions",
      value: activeRx.length,
      icon: Pill,
      color: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      label: "Compliance Rate",
      value: `${compliance}%`,
      icon: CheckCircle2,
      color: "from-emerald-500 to-emerald-600",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    {
      label: "Total Prescriptions",
      value: patientRx.length,
      icon: Clock,
      color: "from-violet-500 to-violet-600",
      bg: "bg-violet-50",
      text: "text-violet-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Here&apos;s your medication overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4"
          >
            <div
              className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}
            >
              <stat.icon className={`w-6 h-6 ${stat.text}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Active Prescriptions */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
          Current Medications
        </h3>
        <div className="space-y-3">
          {activeRx.map((rx, i) => {
            const progress =
              ((rx.totalDoses - rx.remainingDoses) / rx.totalDoses) * 100;
            return (
              <motion.div
                key={rx.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-900">{rx.drug}</h4>
                    <p className="text-xs text-slate-500">
                      {rx.frequency} · {rx.duration}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg">
                    {rx.id}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>
                      {rx.totalDoses - rx.remainingDoses} / {rx.totalDoses} doses
                    </span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                    />
                  </div>
                </div>

                {/* Low stock warning */}
                {rx.remainingDoses <= 3 && rx.remainingDoses > 0 && (
                  <div className="flex items-center gap-1.5 mt-3 text-amber-600 text-xs">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Low remaining doses</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
