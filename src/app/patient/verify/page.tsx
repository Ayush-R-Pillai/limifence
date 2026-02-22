"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, Loader2, CheckCircle2, XCircle, ScanLine } from "lucide-react";
import { useApp } from "@/context/AppContext";

type ScanState = "idle" | "scanning" | "result";

export default function PatientVerify() {
  const { prescriptions } = useApp();
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [selectedRx, setSelectedRx] = useState("");
  const [result, setResult] = useState<{ valid: boolean; drug: string; id: string } | null>(null);
  const patientRx = prescriptions.filter((p) => p.patientId === "PAT-001");

  const handleScan = () => {
    if (!selectedRx) return;
    setScanState("scanning");
    setTimeout(() => {
      const rx = prescriptions.find((p) => p.id === selectedRx || p.qrCode === selectedRx);
      setResult(
        rx
          ? { valid: true, drug: rx.drug, id: rx.id }
          : { valid: false, drug: "", id: "" }
      );
      setScanState("result");
    }, 2000);
  };

  const reset = () => {
    setScanState("idle");
    setSelectedRx("");
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Verify Prescription</h2>
        <p className="text-sm text-slate-500 mt-1">
          Scan or select a QR code to verify your prescription
        </p>
      </div>

      <AnimatePresence mode="wait">
        {scanState === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            {/* Simulated Scanner Area */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-sm">
              <div className="w-48 h-48 mx-auto bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center mb-4">
                <ScanLine className="w-12 h-12 text-slate-300 mb-2" />
                <p className="text-xs text-slate-400">Camera viewfinder</p>
              </div>

              <select
                value={selectedRx}
                onChange={(e) => setSelectedRx(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 mb-3"
              >
                <option value="">Select a prescription to verify...</option>
                {patientRx.map((rx) => (
                  <option key={rx.id} value={rx.id}>
                    {rx.id} — {rx.drug}
                  </option>
                ))}
              </select>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleScan}
                disabled={!selectedRx}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <QrCode className="w-5 h-5" />
                Scan & Verify
              </motion.button>
            </div>
          </motion.div>
        )}

        {scanState === "scanning" && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="inline-block mb-4"
            >
              <Loader2 className="w-12 h-12 text-blue-500" />
            </motion.div>
            <h3 className="text-lg font-semibold text-slate-900">Scanning...</h3>
            <p className="text-sm text-slate-500 mt-1">
              Verifying prescription authenticity
            </p>
          </motion.div>
        )}

        {scanState === "result" && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            <div
              className={`rounded-2xl border p-6 text-center shadow-sm ${
                result.valid
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              {result.valid ? (
                <>
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-emerald-800">
                    Prescription Verified ✓
                  </h3>
                  <p className="text-sm text-emerald-600 mt-1">
                    {result.drug} ({result.id})
                  </p>
                </>
              ) : (
                <>
                  <XCircle className="w-16 h-16 text-red-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-red-800">
                    Verification Failed
                  </h3>
                  <p className="text-sm text-red-600 mt-1">
                    This prescription could not be verified
                  </p>
                </>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={reset}
              className="w-full py-3 bg-slate-900 text-white font-semibold rounded-xl"
            >
              Scan Another
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
