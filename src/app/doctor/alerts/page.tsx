"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  ShieldAlert,
  Activity,
  Trophy,
  Check,
  Bell,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

const typeConfig = {
  high_frequency: {
    icon: AlertTriangle,
    label: "High Frequency",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  resistance: {
    icon: ShieldAlert,
    label: "Resistance Risk",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  stewardship: {
    icon: Activity,
    label: "Stewardship",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  goal_achieved: {
    icon: Trophy,
    label: "Goal Achieved",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
};

const severityBadge = {
  critical: "bg-red-100 text-red-700",
  warning: "bg-amber-100 text-amber-700",
  info: "bg-blue-100 text-blue-700",
};

export default function DoctorAlerts() {
  const { alerts, markAlertRead, unreadAlertCount } = useApp();

  const sorted = [...alerts].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Alerts & Flags
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Clinical alerts requiring attention
          </p>
        </div>
        {unreadAlertCount > 0 && (
          <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full flex items-center gap-1.5">
            <Bell className="w-4 h-4" />
            {unreadAlertCount} unread
          </span>
        )}
      </div>

      <div className="space-y-3">
        {sorted.map((alert, i) => {
          const config = typeConfig[alert.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className={`rounded-2xl p-5 border shadow-sm transition-all ${
                alert.read
                  ? "bg-white border-slate-100 opacity-70"
                  : `${config.bg} ${config.border}`
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    alert.read ? "bg-slate-100" : config.bg
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      alert.read ? "text-slate-400" : config.color
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span
                      className={`text-xs font-semibold ${
                        alert.read ? "text-slate-500" : config.color
                      }`}
                    >
                      {config.label}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        severityBadge[alert.severity]
                      }`}
                    >
                      {alert.severity}
                    </span>
                    {!alert.read && (
                      <span className="w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </div>

                  <p
                    className={`text-sm mb-2 ${
                      alert.read ? "text-slate-500" : "text-slate-700"
                    }`}
                  >
                    {alert.message}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {alert.patientName} ·{" "}
                      {new Date(alert.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>

                    {!alert.read && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => markAlertRead(alert.id)}
                        className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Mark read
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
