"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
  User,
  Prescription,
  DispenseRecord,
  ComplianceLog,
  Alert,
  MOCK_USERS,
  MOCK_PRESCRIPTIONS,
  MOCK_DISPENSE_RECORDS,
  MOCK_COMPLIANCE_LOGS,
  MOCK_ALERTS,
  FREQUENCY_MAP,
  DURATION_MAP,
} from "@/lib/mockData";

// ─── Context Type ─────────────────────────────────────────────────────────────

interface AppContextType {
  user: User | null;
  prescriptions: Prescription[];
  dispenseRecords: DispenseRecord[];
  complianceLogs: ComplianceLog[];
  alerts: Alert[];
  loading: boolean;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  createPrescription: (data: {
    patientId: string;
    patientName: string;
    drug: string;
    dosage: string;
    frequency: string;
    duration: string;
  }) => Prescription;
  verifyAndDispense: (
    qrCodeOrId: string,
    pharmacyId: string
  ) => { success: boolean; message: string; record?: DispenseRecord };
  getComplianceRate: (patientId: string) => number;
  detectShortInterval: (patientId: string) => boolean;
  markAlertRead: (id: string) => void;
  unreadAlertCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(MOCK_PRESCRIPTIONS);
  const [dispenseRecords, setDispenseRecords] = useState<DispenseRecord[]>(MOCK_DISPENSE_RECORDS);
  const [complianceLogs, setComplianceLogs] = useState<ComplianceLog[]>(MOCK_COMPLIANCE_LOGS);
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [loading, setLoading] = useState(true);

  // Hydrate from sessionStorage
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("limifence_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  // ─── Auth ───────────────────────────────────────────────────────────────────

  const login = useCallback(
    async (email: string, password: string, role: string): Promise<boolean> => {
      // simulate network delay
      await new Promise((r) => setTimeout(r, 800));
      const found = MOCK_USERS.find(
        (u) => u.email === email && u.password === password && u.role === role
      );
      if (found) {
        setUser(found);
        sessionStorage.setItem("limifence_user", JSON.stringify(found));
        return true;
      }
      return false;
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem("limifence_user");
  }, []);

  // ─── Prescriptions ─────────────────────────────────────────────────────────

  const createPrescription = useCallback(
    (data: {
      patientId: string;
      patientName: string;
      drug: string;
      dosage: string;
      frequency: string;
      duration: string;
    }): Prescription => {
      const freq = FREQUENCY_MAP[data.frequency] || 1;
      const dur = DURATION_MAP[data.duration] || 7;
      const supplyUnits = freq * dur;
      const drugInitials = data.drug
        .split(" ")[0]
        .slice(0, 3)
        .toUpperCase();
      const qrCode = `LF-QR-${Date.now()}-${data.patientName.replace(/\s/g, "")}-${drugInitials}`;
      const rx: Prescription = {
        id: `RX-${10000 + prescriptions.length + 1}`,
        patientId: data.patientId,
        patientName: data.patientName,
        doctorId: user?.id || "DOC-001",
        drug: data.drug,
        dosage: data.dosage,
        frequency: data.frequency,
        duration: data.duration,
        supplyUnits,
        remainingDoses: supplyUnits,
        totalDoses: supplyUnits,
        status: "active",
        createdAt: new Date().toISOString(),
        qrCode,
      };
      setPrescriptions((prev) => [rx, ...prev]);

      // compliance log
      const log: ComplianceLog = {
        id: `CL-${Date.now()}`,
        timestamp: new Date().toISOString(),
        eventType: "created",
        prescriptionId: rx.id,
        patientName: data.patientName,
        drug: data.drug,
        message: `Prescription ${rx.id} created by ${user?.name || "Doctor"}`,
      };
      setComplianceLogs((prev) => [log, ...prev]);

      return rx;
    },
    [prescriptions.length, user]
  );

  // ─── Verify & Dispense ─────────────────────────────────────────────────────

  const verifyAndDispense = useCallback(
    (
      qrCodeOrId: string,
      pharmacyId: string
    ): { success: boolean; message: string; record?: DispenseRecord } => {
      const rx = prescriptions.find(
        (p) => p.qrCode === qrCodeOrId || p.id === qrCodeOrId
      );
      if (!rx) {
        return { success: false, message: "Prescription not found. Invalid QR code or ID." };
      }
      if (rx.remainingDoses <= 0) {
        return { success: false, message: "No remaining doses for this prescription." };
      }

      // 24-hour block check
      const now = Date.now();
      const recentDispense = dispenseRecords.find(
        (d) =>
          d.prescriptionId === rx.id &&
          d.status === "dispensed" &&
          now - new Date(d.dispensedAt).getTime() < 24 * 60 * 60 * 1000
      );

      if (recentDispense) {
        // BLOCKED
        const blockedRecord: DispenseRecord = {
          id: `DSP-${Date.now()}`,
          prescriptionId: rx.id,
          patientName: rx.patientName,
          drug: rx.drug,
          quantity: 0,
          dispensedAt: new Date().toISOString(),
          pharmacyId,
          status: "blocked",
        };
        setDispenseRecords((prev) => [blockedRecord, ...prev]);

        const blockedLog: ComplianceLog = {
          id: `CL-${Date.now()}`,
          timestamp: new Date().toISOString(),
          eventType: "blocked",
          prescriptionId: rx.id,
          patientName: rx.patientName,
          drug: rx.drug,
          message: `Dispense BLOCKED — last dispensed less than 24h ago`,
        };
        setComplianceLogs((prev) => [blockedLog, ...prev]);

        return {
          success: false,
          message: "Dispense BLOCKED: This prescription was dispensed within the last 24 hours.",
          record: blockedRecord,
        };
      }

      // SUCCESS
      const freq = FREQUENCY_MAP[rx.frequency] || 1;
      const quantity = freq; // one day's supply
      const dispensedRecord: DispenseRecord = {
        id: `DSP-${Date.now()}`,
        prescriptionId: rx.id,
        patientName: rx.patientName,
        drug: rx.drug,
        quantity,
        dispensedAt: new Date().toISOString(),
        pharmacyId,
        status: "dispensed",
      };
      setDispenseRecords((prev) => [dispensedRecord, ...prev]);

      // reduce remaining doses
      setPrescriptions((prev) =>
        prev.map((p) =>
          p.id === rx.id
            ? { ...p, remainingDoses: Math.max(0, p.remainingDoses - quantity) }
            : p
        )
      );

      const successLog: ComplianceLog = {
        id: `CL-${Date.now()}`,
        timestamp: new Date().toISOString(),
        eventType: "dispensed",
        prescriptionId: rx.id,
        patientName: rx.patientName,
        drug: rx.drug,
        message: `${quantity} unit(s) dispensed at pharmacy ${pharmacyId}`,
      };
      setComplianceLogs((prev) => [successLog, ...prev]);

      return {
        success: true,
        message: `Successfully dispensed ${quantity} unit(s) of ${rx.drug}`,
        record: dispensedRecord,
      };
    },
    [prescriptions, dispenseRecords]
  );

  // ─── Compliance Rate ────────────────────────────────────────────────────────

  const getComplianceRate = useCallback(
    (patientId: string): number => {
      const patientRxIds = prescriptions
        .filter((p) => p.patientId === patientId)
        .map((p) => p.id);
      if (patientRxIds.length === 0) return 0;
      const records = dispenseRecords.filter((d) =>
        patientRxIds.includes(d.prescriptionId)
      );
      if (records.length === 0) return 0;
      const dispensed = records.filter((d) => d.status === "dispensed").length;
      return Math.round((dispensed / records.length) * 100);
    },
    [prescriptions, dispenseRecords]
  );

  // ─── Short Interval Detection ──────────────────────────────────────────────

  const detectShortInterval = useCallback(
    (patientId: string): boolean => {
      const patientRx = prescriptions
        .filter((p) => p.patientId === patientId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (patientRx.length < 2) return false;
      const gap =
        new Date(patientRx[0].createdAt).getTime() -
        new Date(patientRx[1].createdAt).getTime();
      return gap < 14 * 24 * 60 * 60 * 1000;
    },
    [prescriptions]
  );

  // ─── Alerts ─────────────────────────────────────────────────────────────────

  const markAlertRead = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    );
  }, []);

  const unreadAlertCount = alerts.filter((a) => !a.read).length;

  // ─── Return ─────────────────────────────────────────────────────────────────

  return (
    <AppContext.Provider
      value={{
        user,
        prescriptions,
        dispenseRecords,
        complianceLogs,
        alerts,
        loading,
        login,
        logout,
        createPrescription,
        verifyAndDispense,
        getComplianceRate,
        detectShortInterval,
        markAlertRead,
        unreadAlertCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
