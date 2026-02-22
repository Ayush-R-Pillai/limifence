"use client";

import { motion } from "framer-motion";
import { User, Mail, Shield, Clock, LogOut, Pill } from "lucide-react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function PatientProfile() {
  const router = useRouter();
  const { user, prescriptions, logout } = useApp();
  const patientRx = prescriptions
    .filter((p) => p.patientId === user?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Profile</h2>
        <p className="text-sm text-slate-500 mt-1">Your identity & history</p>
      </div>

      {/* Identity Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-5 text-white shadow-lg shadow-blue-500/20"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold">{user?.name}</h3>
            <p className="text-blue-200 text-sm">{user?.id}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-blue-100">
            <Mail className="w-4 h-4" />
            <span className="truncate">{user?.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-100">
            <Shield className="w-4 h-4" />
            <span className="capitalize">{user?.role}</span>
          </div>
        </div>
      </motion.div>

      {/* Timeline */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
          Prescription Timeline
        </h3>
        <div className="space-y-1">
          {patientRx.map((rx, i) => (
            <motion.div
              key={rx.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="flex items-start gap-3"
            >
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm mt-1.5" />
                {i < patientRx.length - 1 && (
                  <div className="w-0.5 h-full min-h-[40px] bg-slate-200" />
                )}
              </div>

              <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex-1 mb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Pill className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-slate-900">
                      {rx.drug}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      rx.status === "active"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {rx.status}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>
                    {new Date(rx.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span>·</span>
                  <span>{rx.id}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleLogout}
        className="w-full py-3 bg-red-50 text-red-600 font-semibold rounded-xl border border-red-200 flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Sign Out
      </motion.button>
    </div>
  );
}
