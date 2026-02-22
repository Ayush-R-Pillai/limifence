"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Users,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function DoctorDashboard() {
  const { prescriptions, alerts, dispenseRecords, getComplianceRate } = useApp();

  const activePrescriptions = prescriptions.filter((p) => p.status === "active");
  const totalDispensed = dispenseRecords.filter((d) => d.status === "dispensed").length;
  const unreadAlerts = alerts.filter((a) => !a.read).length;
  const stewardshipScore = 72;

  const stats = [
    {
      label: "Active Prescriptions",
      value: activePrescriptions.length,
      icon: FileText,
      bg: "bg-blue-50",
      color: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      label: "Total Dispensed",
      value: totalDispensed,
      icon: CheckCircle2,
      bg: "bg-emerald-50",
      color: "text-emerald-600",
      iconBg: "bg-emerald-100",
    },
    {
      label: "Unread Alerts",
      value: unreadAlerts,
      icon: AlertTriangle,
      bg: "bg-amber-50",
      color: "text-amber-600",
      iconBg: "bg-amber-100",
    },
    {
      label: "Unique Patients",
      value: [...new Set(prescriptions.map((p) => p.patientId))].length,
      icon: Users,
      bg: "bg-violet-50",
      color: "text-violet-600",
      iconBg: "bg-violet-100",
    },
  ];

  // Recent prescriptions
  const recentRx = [...prescriptions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Doctor Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Antimicrobial stewardship overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-10 h-10 ${stat.iconBg} rounded-xl flex items-center justify-center`}
              >
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <TrendingUp className="w-4 h-4 text-slate-300" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Stewardship Score */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Stewardship Score
            </h3>
            <p className="text-sm text-slate-500">
              Antimicrobial prescribing quality metric
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            <span className="text-2xl font-bold text-slate-900">
              {stewardshipScore}%
            </span>
          </div>
        </div>
        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stewardshipScore}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-400">
          <span>0%</span>
          <span>Target: 80%</span>
          <span>100%</span>
        </div>
      </motion.div>

      {/* Recent Prescriptions */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">
          Recent Prescriptions
        </h3>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left py-3 px-4 font-medium text-slate-500">
                    ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">
                    Patient
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">
                    Drug
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentRx.map((rx, i) => (
                  <motion.tr
                    key={rx.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-blue-600">
                      {rx.id}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {rx.patientName}
                    </td>
                    <td className="py-3 px-4 text-slate-700">{rx.drug}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rx.status === "active"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {rx.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(rx.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
