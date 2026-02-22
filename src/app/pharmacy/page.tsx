"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScanLine,
  Loader2,
  CheckCircle2,
  XCircle,
  Search,
  QrCode,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

type VerifyState = "idle" | "scanning" | "result";

export default function PharmacyDashboard() {
  const { verifyAndDispense, user } = useApp();
  const [state, setState] = useState<VerifyState>("idle");
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleVerify = () => {
    if (!input.trim()) return;
    setState("scanning");
    setTimeout(() => {
      const res = verifyAndDispense(input.trim(), user?.id || "PH-001");
      setResult({ success: res.success, message: res.message });
      setState("result");
    }, 1500);
  };

  const reset = () => {
    setState("idle");
    setInput("");
    setResult(null);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Verify & Dispense</h1>
        <p className="text-sm text-slate-500 mt-1">
          Enter a QR code string or prescription ID to verify and dispense
        </p>
      </div>

      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            {/* Scanner Area */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
              <div className="w-40 h-40 mx-auto bg-emerald-50/50 rounded-2xl border-2 border-dashed border-emerald-300 flex flex-col items-center justify-center mb-6">
                <ScanLine className="w-14 h-14 text-emerald-300 mb-2" />
                <p className="text-xs text-emerald-400">Scan QR Code</p>
              </div>

              {/* Manual Entry */}
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter QR code or Prescription ID (e.g. RX-10001)"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
                  onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleVerify}
                disabled={!input.trim()}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <QrCode className="w-5 h-5" />
                Verify & Dispense
              </motion.button>
            </div>

            {/* Quick hints */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="text-xs text-slate-500 mb-2 font-medium">
                Try these sample IDs:
              </p>
              <div className="flex flex-wrap gap-2">
                {["RX-10001", "RX-10002", "RX-10003"].map((id) => (
                  <button
                    key={id}
                    onClick={() => setInput(id)}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-600 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {state === "scanning" && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="inline-block mb-4"
            >
              <Loader2 className="w-14 h-14 text-emerald-500" />
            </motion.div>
            <h3 className="text-lg font-semibold text-slate-900">
              Verifying Prescription...
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Checking authenticity and dispense eligibility
            </p>
          </motion.div>
        )}

        {state === "result" && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            <div
              className={`rounded-2xl border p-8 text-center shadow-sm ${
                result.success
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              {result.success ? (
                <>
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-emerald-800 mb-1">
                    Dispense Successful ✓
                  </h3>
                </>
              ) : (
                <>
                  <XCircle className="w-16 h-16 text-red-500 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-red-800 mb-1">
                    Dispense Failed
                  </h3>
                </>
              )}
              <p
                className={`text-sm ${
                  result.success ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {result.message}
              </p>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={reset}
              className="w-full py-3 bg-slate-900 text-white font-semibold rounded-xl"
            >
              Verify Another
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
