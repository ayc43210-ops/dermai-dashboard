// API client for the DermAI FastAPI backend (Cancer-Detection-Project/backend/main.py).
//
//   GET  /         -> health check
//   POST /predict  -> multipart/form-data with the image under the field name "file"

export type RiskLevel = "Critical" | "High" | "Low";

export interface ScanResult {
  id: string;
  classification: string;
  confidence: number; // 0-100
  risk: RiskLevel;
  lesionType: string; // Benign | Pre-Malignant | Malignant
  timestamp: string;
  insights: string[];
  recommendation: string;
}

/** One analysed image in the current browser session. */
export interface SessionScan {
  id: string;
  fileName: string;
  classification: string;
  confidence: number;
  risk: RiskLevel;
  timestamp: string;
}

/** Facts about the deployed model. Mirrors what the backend itself reports. */
export const MODEL_INFO = {
  architecture: "MobileNetV2",
  dataset: "HAM10000",
  classes: 7,
  reportedAccuracy: 93.25, // reported by the backend, not measured here
};

export const API_URL: string = (
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://127.0.0.1:8000"
).replace(/\/+$/, "");

// Shape of a successful POST /predict response from main.py
interface PredictResponse {
  success: boolean;
  classification?: string;
  confidence?: string; // e.g. "98.18%"
  risk_level?: string; // "Critical" | "High" | "Low"
  type?: string; // "Benign" | "Pre-Malignant" | "Malignant"
  error?: string;
}

// Short descriptions of each class, matching the descriptions in the Streamlit app.
// These describe the CLASS the model chose. They are not findings from the uploaded image.
const CLASS_DESCRIPTIONS: Record<string, string> = {
  "Actinic Keratoses": "Rough, scaly patches caused by sun damage.",
  "Basal Cell Carcinoma": "Slow-growing but invasive skin cancer.",
  "Benign Keratosis": "Non-cancerous waxy skin growths.",
  Dermatofibroma: "Small, harmless fibrous bumps.",
  Melanoma: "Aggressive skin cancer requiring urgent biopsy.",
  Nevus: "Common, stable melanocytic mole.",
  "Vascular Lesions": "Harmless growths involving blood vessels.",
};

const RECOMMENDATIONS: Record<RiskLevel, string> = {
  Critical:
    "High-priority result. Arrange prompt dermatologist review and consider biopsy to confirm. This tool cannot confirm a diagnosis.",
  High: "Schedule a dermatology consultation for clinical examination and follow-up. This tool cannot confirm a diagnosis.",
  Low: "Model suggests a low-risk lesion. Continue routine self-examination and see a clinician if it changes in size, shape or colour.",
};

function toRiskLevel(value: string | undefined): RiskLevel {
  if (value === "Critical" || value === "High" || value === "Low") return value;
  throw new Error(`Unexpected risk level from backend: ${String(value)}`);
}

function parseConfidence(value: string | undefined): number {
  const n = parseFloat(String(value ?? "").replace("%", ""));
  if (Number.isNaN(n)) throw new Error(`Unexpected confidence from backend: ${String(value)}`);
  return n;
}

/** Send an image to the backend and return a result the UI can render. */
export async function analyzeImage(file: File): Promise<ScanResult> {
  const body = new FormData();
  body.append("file", file); // field name must be "file" (see main.py)

  let res: Response;
  try {
    res = await fetch(`${API_URL}/predict`, { method: "POST", body });
  } catch {
    throw new Error(`Cannot reach the backend at ${API_URL}. Is it running?`);
  }
  if (!res.ok) throw new Error(`Backend returned HTTP ${res.status}`);

  // main.py reports prediction errors with HTTP 200 and { success: false, error }
  const data = (await res.json()) as PredictResponse;
  if (!data.success) throw new Error(data.error ?? "Prediction failed");

  const classification = data.classification ?? "Unknown";
  const risk = toRiskLevel(data.risk_level);
  const lesionType = data.type ?? "Unknown";
  const description = CLASS_DESCRIPTIONS[classification];

  return {
    id: `SCN-${Date.now().toString(36).toUpperCase()}`,
    classification,
    confidence: parseConfidence(data.confidence),
    risk,
    lesionType,
    timestamp: new Date().toISOString(),
    insights: [
      ...(description ? [description] : []),
      `Lesion category: ${lesionType}.`,
      "Result is a statistical classification from an image model, not a clinical finding.",
    ],
    recommendation: RECOMMENDATIONS[risk],
  };
}

/** Returns true if the backend health check (GET /) answers. */
export async function checkBackend(signal?: AbortSignal): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/`, { signal });
    return res.ok;
  } catch {
    return false;
  }
}
