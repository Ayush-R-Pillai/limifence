// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  password: string;
  role: "patient" | "doctor" | "pharmacy";
  name: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  drug: string;
  dosage: string;
  frequency: string;
  duration: string;
  supplyUnits: number;
  remainingDoses: number;
  totalDoses: number;
  status: "active" | "completed" | "cancelled";
  createdAt: string;
  qrCode: string;
}

export interface DispenseRecord {
  id: string;
  prescriptionId: string;
  patientName: string;
  drug: string;
  quantity: number;
  dispensedAt: string;
  pharmacyId: string;
  status: "dispensed" | "blocked";
}

export interface ComplianceLog {
  id: string;
  timestamp: string;
  eventType: "dispensed" | "blocked" | "created" | "verified";
  prescriptionId: string;
  patientName: string;
  drug: string;
  message: string;
}

export interface Alert {
  id: string;
  type: "high_frequency" | "resistance" | "stewardship" | "goal_achieved";
  patientId: string;
  patientName: string;
  message: string;
  severity: "critical" | "warning" | "info";
  createdAt: string;
  read: boolean;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

export const MOCK_USERS: User[] = [
  {
    id: "PAT-001",
    email: "patient@limifence.com",
    password: "patient123",
    role: "patient",
    name: "Arjun Menon",
  },
  {
    id: "DOC-001",
    email: "doctor@limifence.com",
    password: "doctor123",
    role: "doctor",
    name: "Dr. Priya Sharma",
  },
  {
    id: "PH-001",
    email: "pharmacy@limifence.com",
    password: "pharmacy123",
    role: "pharmacy",
    name: "MedPlus Pharmacy",
  },
];

export const MOCK_PRESCRIPTIONS: Prescription[] = [
  {
    id: "RX-10001",
    patientId: "PAT-001",
    patientName: "Arjun Menon",
    doctorId: "DOC-001",
    drug: "Amoxicillin 500mg",
    dosage: "500mg",
    frequency: "3 times/day",
    duration: "7 days",
    supplyUnits: 21,
    remainingDoses: 15,
    totalDoses: 21,
    status: "active",
    createdAt: "2026-02-18T09:30:00Z",
    qrCode: "LF-QR-1708249800-ArjunMenon-AMX",
  },
  {
    id: "RX-10002",
    patientId: "PAT-001",
    patientName: "Arjun Menon",
    doctorId: "DOC-001",
    drug: "Azithromycin 250mg",
    dosage: "250mg",
    frequency: "1 time/day",
    duration: "5 days",
    supplyUnits: 5,
    remainingDoses: 3,
    totalDoses: 5,
    status: "active",
    createdAt: "2026-02-20T14:00:00Z",
    qrCode: "LF-QR-1708437600-ArjunMenon-AZT",
  },
  {
    id: "RX-10003",
    patientId: "PAT-001",
    patientName: "Arjun Menon",
    doctorId: "DOC-001",
    drug: "Ciprofloxacin 500mg",
    dosage: "500mg",
    frequency: "2 times/day",
    duration: "10 days",
    supplyUnits: 20,
    remainingDoses: 20,
    totalDoses: 20,
    status: "active",
    createdAt: "2026-02-10T08:00:00Z",
    qrCode: "LF-QR-1707552000-ArjunMenon-CIP",
  },
];

export const MOCK_DISPENSE_RECORDS: DispenseRecord[] = [
  {
    id: "DSP-001",
    prescriptionId: "RX-10001",
    patientName: "Arjun Menon",
    drug: "Amoxicillin 500mg",
    quantity: 3,
    dispensedAt: "2026-02-18T10:00:00Z",
    pharmacyId: "PH-001",
    status: "dispensed",
  },
  {
    id: "DSP-002",
    prescriptionId: "RX-10001",
    patientName: "Arjun Menon",
    drug: "Amoxicillin 500mg",
    quantity: 3,
    dispensedAt: "2026-02-19T10:00:00Z",
    pharmacyId: "PH-001",
    status: "dispensed",
  },
  {
    id: "DSP-003",
    prescriptionId: "RX-10002",
    patientName: "Arjun Menon",
    drug: "Azithromycin 250mg",
    quantity: 1,
    dispensedAt: "2026-02-20T15:00:00Z",
    pharmacyId: "PH-001",
    status: "dispensed",
  },
  {
    id: "DSP-004",
    prescriptionId: "RX-10002",
    patientName: "Arjun Menon",
    drug: "Azithromycin 250mg",
    quantity: 1,
    dispensedAt: "2026-02-21T15:00:00Z",
    pharmacyId: "PH-001",
    status: "dispensed",
  },
];

export const MOCK_COMPLIANCE_LOGS: ComplianceLog[] = [
  {
    id: "CL-001",
    timestamp: "2026-02-18T09:30:00Z",
    eventType: "created",
    prescriptionId: "RX-10001",
    patientName: "Arjun Menon",
    drug: "Amoxicillin 500mg",
    message: "Prescription RX-10001 created by Dr. Priya Sharma",
  },
  {
    id: "CL-002",
    timestamp: "2026-02-18T10:00:00Z",
    eventType: "dispensed",
    prescriptionId: "RX-10001",
    patientName: "Arjun Menon",
    drug: "Amoxicillin 500mg",
    message: "3 units dispensed at MedPlus Pharmacy",
  },
  {
    id: "CL-003",
    timestamp: "2026-02-19T10:00:00Z",
    eventType: "dispensed",
    prescriptionId: "RX-10001",
    patientName: "Arjun Menon",
    drug: "Amoxicillin 500mg",
    message: "3 units dispensed at MedPlus Pharmacy",
  },
  {
    id: "CL-004",
    timestamp: "2026-02-20T14:00:00Z",
    eventType: "created",
    prescriptionId: "RX-10002",
    patientName: "Arjun Menon",
    drug: "Azithromycin 250mg",
    message: "Prescription RX-10002 created by Dr. Priya Sharma",
  },
  {
    id: "CL-005",
    timestamp: "2026-02-20T15:00:00Z",
    eventType: "dispensed",
    prescriptionId: "RX-10002",
    patientName: "Arjun Menon",
    drug: "Azithromycin 250mg",
    message: "1 unit dispensed at MedPlus Pharmacy",
  },
  {
    id: "CL-006",
    timestamp: "2026-02-21T15:00:00Z",
    eventType: "dispensed",
    prescriptionId: "RX-10002",
    patientName: "Arjun Menon",
    drug: "Azithromycin 250mg",
    message: "1 unit dispensed at MedPlus Pharmacy",
  },
];

export const MOCK_ALERTS: Alert[] = [
  {
    id: "ALT-001",
    type: "high_frequency",
    patientId: "PAT-001",
    patientName: "Arjun Menon",
    message:
      "Patient has received 3 antibiotic prescriptions in the last 30 days. Review treatment pattern.",
    severity: "critical",
    createdAt: "2026-02-21T08:00:00Z",
    read: false,
  },
  {
    id: "ALT-002",
    type: "resistance",
    patientId: "PAT-001",
    patientName: "Arjun Menon",
    message:
      "Potential resistance risk detected — Amoxicillin prescribed twice within 14 days.",
    severity: "warning",
    createdAt: "2026-02-20T11:00:00Z",
    read: false,
  },
  {
    id: "ALT-003",
    type: "stewardship",
    patientId: "PAT-001",
    patientName: "Arjun Menon",
    message:
      "Stewardship review recommended: consider narrow-spectrum alternative for next prescription.",
    severity: "warning",
    createdAt: "2026-02-19T16:00:00Z",
    read: false,
  },
  {
    id: "ALT-004",
    type: "goal_achieved",
    patientId: "PAT-001",
    patientName: "Arjun Menon",
    message:
      "Patient compliance rate reached 80% — adherence goal met for current cycle.",
    severity: "info",
    createdAt: "2026-02-19T09:00:00Z",
    read: true,
  },
];

// ─── Frequency Lookup ─────────────────────────────────────────────────────────

export const FREQUENCY_MAP: Record<string, number> = {
  "1 time/day": 1,
  "2 times/day": 2,
  "3 times/day": 3,
  "4 times/day": 4,
};

export const DURATION_MAP: Record<string, number> = {
  "3 days": 3,
  "5 days": 5,
  "7 days": 7,
  "10 days": 10,
  "14 days": 14,
  "21 days": 21,
  "30 days": 30,
};

export const DRUG_LIST = [
  "Amoxicillin 500mg",
  "Azithromycin 250mg",
  "Ciprofloxacin 500mg",
  "Metronidazole 400mg",
  "Doxycycline 100mg",
  "Cephalexin 500mg",
  "Levofloxacin 750mg",
  "Clindamycin 300mg",
];
