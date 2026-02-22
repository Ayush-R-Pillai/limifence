"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Clock, Pill, User } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function DoctorHistory() {
  const { prescriptions, dispenseRecords, detectShortInterval } = useApp();

  // Group by patient
  const patientMap: Record<
    string,
    { name: string; rxList: typeof prescriptions }
  > = {};
  prescriptions.forEach((rx) => {
    if (!patientMap[rx.patientId]) {
      patientMap[rx.patientId] = { name: rx.patientName, rxList: [] };
    }
    patientMap[rx.patientId].rxList.push(rx);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Patient History</h1>
        <p className="text-sm text-slate-500 mt-1">
          Prescription timeline & repeat detection
        </p>
      </div>

      {Object.entries(patientMap).map(([patientId, { name, rxList }]) => {
        const shortInterval = detectShortInterval(patientId);
        const sorted = [...rxList].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return (
          <motion.div
            key={patientId}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
          >
            {/* Patient Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{name}</h3>
                  <p className="text-xs text-slate-400">{patientId}</p>
                </div>
              </div>
              <span className="text-xs text-slate-500">
                {rxList.length} prescription{rxList.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Short Interval Warning */}
            {shortInterval && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="mx-5 mt-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl"
              >
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                <span className="text-sm text-red-700 font-medium">
                  Short-interval repeat detected — two prescriptions within 14
                  days
                </span>
              </motion.div>
            )}

            {/* Timeline */}
            <div className="p-5 space-y-3">
              {sorted.map((rx, i) => {
                const rxDispenses = dispenseRecords.filter(
                  (d) => d.prescriptionId === rx.id
                );
                return (
                  <motion.div
                    key={rx.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex flex-col items-center pt-1.5">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          rx.status === "active"
                            ? "bg-blue-500"
                            : "bg-slate-300"
                        }`}
                      />
                      {i < sorted.length - 1 && (
                        <div className="w-0.5 h-full min-h-[50px] bg-slate-200 mt-1" />
                      )}
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 flex-1 border border-slate-100">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <Pill className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-semibold text-slate-900">
                            {rx.drug}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                            rx.status === "active"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          {rx.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-500 mb-2">
                        <span>{rx.dosage}</span>
                        <span>{rx.frequency}</span>
                        <span>{rx.duration}</span>
                        <span>
                          {rx.remainingDoses}/{rx.totalDoses} doses
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
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
                        {rxDispenses.length > 0 && (
                          <>
                            <span>·</span>
                            <span>
                              {rxDispenses.length} dispense
                              {rxDispenses.length !== 1 ? "s" : ""}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
