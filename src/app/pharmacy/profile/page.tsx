"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Mail,
  Shield,
  Award,
  MapPin,
  Phone,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function PharmacyProfile() {
  const router = useRouter();
  const { user, logout, dispenseRecords } = useApp();

  const dispensed = dispenseRecords.filter((d) => d.status === "dispensed").length;
  const total = dispenseRecords.length;
  const complianceScore = total > 0 ? Math.round((dispensed / total) * 100) : 100;

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pharmacy Profile</h1>
        <p className="text-sm text-slate-500 mt-1">
          License information & compliance status
        </p>
      </div>

      {/* Identity Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/20"
      >
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{user?.name}</h3>
            <p className="text-emerald-200 text-sm">{user?.id}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-emerald-100">
            <Mail className="w-4 h-4" />
            <span className="truncate">{user?.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-100">
            <Shield className="w-4 h-4" />
            <span className="capitalize">{user?.role}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-100">
            <Award className="w-4 h-4" />
            <span>License: PH-LIC-2025-A1</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-100">
            <MapPin className="w-4 h-4" />
            <span>Bangalore, KA</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-100 col-span-2">
            <Phone className="w-4 h-4" />
            <span>+91 98765 43210</span>
          </div>
        </div>
      </motion.div>

      {/* Compliance Score Bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Compliance Score
            </h3>
            <p className="text-sm text-slate-500">
              Based on dispense success rate
            </p>
          </div>
          <span className="text-2xl font-bold text-emerald-600">
            {complianceScore}%
          </span>
        </div>
        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${complianceScore}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-400">
          <span>0%</span>
          <span>Target: 95%</span>
          <span>100%</span>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Dispenses", value: total, color: "text-slate-600" },
          {
            label: "Successful",
            value: dispensed,
            color: "text-emerald-600",
          },
          {
            label: "Blocked",
            value: total - dispensed,
            color: "text-red-600",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.08 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center"
          >
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] text-slate-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
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
