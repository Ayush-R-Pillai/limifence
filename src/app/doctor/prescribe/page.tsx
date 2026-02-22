"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FilePlus, QrCode, CheckCircle2, Pill } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { DRUG_LIST, FREQUENCY_MAP, DURATION_MAP } from "@/lib/mockData";

export default function DoctorPrescribe() {
  const { createPrescription } = useApp();

  const [form, setForm] = useState({
    patientId: "PAT-001",
    patientName: "Arjun Menon",
    drug: "",
    dosage: "",
    frequency: "",
    duration: "",
  });
  const [result, setResult] = useState<{
    id: string;
    qrCode: string;
    drug: string;
    supplyUnits: number;
  } | null>(null);

  const frequencies = Object.keys(FREQUENCY_MAP);
  const durations = Object.keys(DURATION_MAP);

  // Auto-calc supply
  const calcSupply = () => {
    const f = FREQUENCY_MAP[form.frequency] || 0;
    const d = DURATION_MAP[form.duration] || 0;
    return f * d;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rx = createPrescription(form);
    setResult({
      id: rx.id,
      qrCode: rx.qrCode,
      drug: rx.drug,
      supplyUnits: rx.supplyUnits,
    });
  };

  const reset = () => {
    setResult(null);
    setForm({
      patientId: "PAT-001",
      patientName: "Arjun Menon",
      drug: "",
      dosage: "",
      frequency: "",
      duration: "",
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">New Prescription</h1>
        <p className="text-sm text-slate-500 mt-1">
          Create a prescription and generate a QR code
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-5"
          >
            {/* Patient Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                  Patient ID
                </label>
                <input
                  value={form.patientId}
                  onChange={(e) =>
                    setForm({ ...form, patientId: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                  Patient Name
                </label>
                <input
                  value={form.patientName}
                  onChange={(e) =>
                    setForm({ ...form, patientName: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  required
                />
              </div>
            </div>

            {/* Drug */}
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                Drug
              </label>
              <select
                value={form.drug}
                onChange={(e) => {
                  const drug = e.target.value;
                  const dosage = drug.split(" ").pop() || "";
                  setForm({ ...form, drug, dosage });
                }}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                required
              >
                <option value="">Select a drug</option>
                {DRUG_LIST.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Dosage (auto-filled) */}
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                Dosage
              </label>
              <input
                value={form.dosage}
                readOnly
                className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500"
              />
            </div>

            {/* Frequency + Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                  Frequency
                </label>
                <select
                  value={form.frequency}
                  onChange={(e) =>
                    setForm({ ...form, frequency: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  required
                >
                  <option value="">Select frequency</option>
                  {frequencies.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                  Duration
                </label>
                <select
                  value={form.duration}
                  onChange={(e) =>
                    setForm({ ...form, duration: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  required
                >
                  <option value="">Select duration</option>
                  {durations.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Supply Preview */}
            {form.frequency && form.duration && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl"
              >
                <Pill className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-blue-700 font-medium">
                  Total Supply: {calcSupply()} units
                </span>
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <FilePlus className="w-5 h-5" />
              Create Prescription
            </motion.button>
          </motion.form>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center"
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Prescription Created
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              {result.drug} — {result.supplyUnits} units
            </p>

            {/* QR Code Display */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-6">
              <div className="w-32 h-32 bg-white rounded-lg mx-auto mb-3 flex items-center justify-center border border-slate-200">
                <QrCode className="w-20 h-20 text-slate-800" />
              </div>
              <p className="text-sm font-mono text-slate-600 break-all">
                {result.qrCode}
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Prescription ID: {result.id}
              </p>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={reset}
              className="px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl"
            >
              Create Another
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
