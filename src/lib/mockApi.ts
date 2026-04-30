// Mock API layer — ready to be swapped with FastAPI backend calls.
// Replace `analyzeImage` with: fetch(`${API_URL}/predict`, { method: 'POST', body: formData })

export type RiskLevel = "Critical" | "High" | "Low";

export interface ScanResult {
  id: string;
  classification: string;
  confidence: number; // 0-100
  risk: RiskLevel;
  timestamp: string;
  insights: string[];
  recommendation: string;
}

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  lastScan: string;
  classification: string;
  risk: RiskLevel;
}

const CLASSES = [
  { name: "Melanoma", risk: "Critical" as RiskLevel },
  { name: "Basal Cell Carcinoma", risk: "High" as RiskLevel },
  { name: "Actinic Keratosis", risk: "High" as RiskLevel },
  { name: "Benign Nevus", risk: "Low" as RiskLevel },
  { name: "Seborrheic Keratosis", risk: "Low" as RiskLevel },
];

const INSIGHTS_MAP: Record<RiskLevel, { insights: string[]; recommendation: string }> = {
  Critical: {
    insights: [
      "Asymmetric lesion morphology detected — high malignancy indicator.",
      "Irregular border patterns consistent with invasive growth.",
      "Heterogeneous pigmentation across lesion surface.",
      "Diameter exceeds 6mm threshold — urgent dermoscopic review advised.",
    ],
    recommendation: "Immediate biopsy recommended. Refer to oncology within 48 hours.",
  },
  High: {
    insights: [
      "Atypical cellular structure identified in epidermal layer.",
      "Pre-malignant features present — monitoring required.",
      "Sun-exposure damage markers detected.",
      "Recommend dermatologist follow-up within 2 weeks.",
    ],
    recommendation: "Schedule dermatology consultation. Consider preventive excision.",
  },
  Low: {
    insights: [
      "Symmetric, uniform pigmentation — typical benign profile.",
      "Well-defined borders consistent with non-malignant lesion.",
      "No concerning vascular patterns observed.",
      "Routine annual screening sufficient.",
    ],
    recommendation: "No immediate action required. Continue routine self-examination.",
  },
};

export async function analyzeImage(_file: File): Promise<ScanResult> {
  // TODO: Replace with real call:
  // const fd = new FormData(); fd.append("image", _file);
  // return fetch(`${import.meta.env.VITE_API_URL}/predict`, { method: "POST", body: fd }).then(r => r.json());
  await new Promise((r) => setTimeout(r, 1800));
  const pick = CLASSES[Math.floor(Math.random() * CLASSES.length)];
  const confidence = +(70 + Math.random() * 28).toFixed(2);
  const meta = INSIGHTS_MAP[pick.risk];
  return {
    id: `SCN-${Date.now().toString(36).toUpperCase()}`,
    classification: pick.name,
    confidence,
    risk: pick.risk,
    timestamp: new Date().toISOString(),
    insights: meta.insights,
    recommendation: meta.recommendation,
  };
}

export const PATIENT_HISTORY: PatientRecord[] = [
  { id: "PT-0421", name: "M. Chen", age: 54, lastScan: "2h ago", classification: "Benign Nevus", risk: "Low" },
  { id: "PT-0398", name: "S. Volkov", age: 62, lastScan: "5h ago", classification: "Melanoma", risk: "Critical" },
  { id: "PT-0376", name: "A. Okafor", age: 41, lastScan: "1d ago", classification: "Actinic Keratosis", risk: "High" },
  { id: "PT-0354", name: "L. Hartman", age: 38, lastScan: "1d ago", classification: "Seborrheic Keratosis", risk: "Low" },
  { id: "PT-0331", name: "R. Tanaka", age: 71, lastScan: "2d ago", classification: "Basal Cell Carcinoma", risk: "High" },
];

export const MODEL_METRICS = {
  accuracy: 93.25,
  sensitivity: 91.8,
  specificity: 94.6,
  version: "v3.1.7-resnet",
  trainedOn: 84572,
};
