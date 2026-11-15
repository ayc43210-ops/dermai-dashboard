import { Activity, AlertTriangle, ShieldCheck, ShieldAlert } from "lucide-react";
import { MODEL_INFO, type ScanResult, type RiskLevel } from "@/lib/api";
import { cn } from "@/lib/utils";

const RISK_STYLES: Record<RiskLevel, { color: string; ring: string; icon: typeof Activity; label: string }> = {
  Critical: { color: "text-risk-critical", ring: "stroke-risk-critical", icon: AlertTriangle, label: "CRITICAL" },
  High: { color: "text-risk-high", ring: "stroke-risk-high", icon: ShieldAlert, label: "HIGH RISK" },
  Low: { color: "text-risk-low", ring: "stroke-risk-low", icon: ShieldCheck, label: "LOW RISK" },
};

interface ResultsPanelProps {
  result: ScanResult | null;
}

export function ResultsPanel({ result }: ResultsPanelProps) {
  if (!result) {
    return (
      <div className="panel panel-corner p-6 min-h-[420px] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <span className="label-tech">DIAGNOSTIC OUTPUT</span>
          <span className="label-tech text-muted-foreground/60">// no signal</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground/60 gap-3">
          <Activity className="w-12 h-12" />
          <p className="font-mono text-sm uppercase tracking-wider">awaiting scan data</p>
        </div>
      </div>
    );
  }

  const risk = RISK_STYLES[result.risk];
  const RiskIcon = risk.icon;

  // Radial progress
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (result.confidence / 100) * circumference;

  return (
    <div className="panel panel-corner p-6 min-h-[420px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <span className="label-tech">DIAGNOSTIC OUTPUT</span>
        <span className="font-mono text-[10px] text-primary">{result.id}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 items-center">
        {/* Radial confidence */}
        <div className="relative w-[180px] h-[180px] mx-auto">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180">
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="6"
            />
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              className={risk.ring}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 1s ease-out", filter: "drop-shadow(0 0 8px currentColor)" }}
            />
            {/* Tick marks */}
            {Array.from({ length: 36 }).map((_, i) => (
              <line
                key={i}
                x1="90"
                y1="10"
                x2="90"
                y2="16"
                stroke="hsl(var(--border))"
                strokeWidth="1"
                transform={`rotate(${i * 10} 90 90)`}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("text-4xl font-bold font-mono", risk.color)}>
              {result.confidence.toFixed(1)}
            </span>
            <span className="label-tech mt-1">% confidence</span>
          </div>
        </div>

        {/* Classification + risk */}
        <div className="space-y-4">
          <div>
            <div className="label-tech mb-1">CLASSIFICATION</div>
            <h3 className="text-2xl font-bold tracking-wide neon-text">{result.classification}</h3>
          </div>

          <div className={cn("flex items-center gap-3 p-3 rounded-sm border", `border-${result.risk === "Critical" ? "risk-critical" : result.risk === "High" ? "risk-high" : "risk-low"}/40`)}
               style={{ background: `hsl(var(--risk-${result.risk.toLowerCase()}) / 0.08)` }}>
            <RiskIcon className={cn("w-6 h-6", risk.color)} />
            <div className="flex-1">
              <div className="label-tech">RISK_LEVEL</div>
              <div className={cn("font-bold font-mono tracking-widest text-lg", risk.color)}>
                {risk.label}
              </div>
            </div>
            <div className={cn("w-2 h-12 rounded-sm", risk.color)} style={{ background: "currentColor" }} />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2 bg-muted/40 rounded-sm">
              <div className="label-tech">TIMESTAMP</div>
              <div className="text-foreground">{new Date(result.timestamp).toLocaleTimeString()}</div>
            </div>
            <div className="p-2 bg-muted/40 rounded-sm">
              <div className="label-tech">MODEL</div>
              <div className="text-primary">{MODEL_INFO.architecture}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
