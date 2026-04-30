import { Cpu, Users, TrendingUp } from "lucide-react";
import { PATIENT_HISTORY, MODEL_METRICS, type RiskLevel } from "@/lib/mockApi";
import { cn } from "@/lib/utils";

const RISK_DOT: Record<RiskLevel, string> = {
  Critical: "bg-risk-critical",
  High: "bg-risk-high",
  Low: "bg-risk-low",
};

export function DermSidebar() {
  return (
    <aside className="space-y-4">
      {/* Model Accuracy */}
      <div className="panel panel-corner p-5">
        <div className="flex items-center gap-2 mb-4">
          <Cpu className="w-4 h-4 text-primary" />
          <span className="label-tech">MODEL DIAGNOSTICS</span>
        </div>

        <div className="text-center mb-4">
          <div className="text-5xl font-bold font-mono neon-text">
            {MODEL_METRICS.accuracy}
            <span className="text-2xl">%</span>
          </div>
          <div className="label-tech mt-1">accuracy</div>
        </div>

        <div className="h-1.5 bg-muted rounded-sm overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-neon animate-pulse-glow"
            style={{ width: `${MODEL_METRICS.accuracy}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <Metric label="SENSITIVITY" value={`${MODEL_METRICS.sensitivity}%`} />
          <Metric label="SPECIFICITY" value={`${MODEL_METRICS.specificity}%`} />
        </div>

        <div className="mt-4 pt-4 border-t border-border space-y-1 text-[11px] font-mono">
          <div className="flex justify-between">
            <span className="text-muted-foreground">VERSION</span>
            <span className="text-primary">{MODEL_METRICS.version}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">TRAINED_ON</span>
            <span>{MODEL_METRICS.trainedOn.toLocaleString()} img</span>
          </div>
        </div>
      </div>

      {/* Patient History */}
      <div className="panel panel-corner p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span className="label-tech">PATIENT HISTORY</span>
          </div>
          <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
        </div>

        <ul className="space-y-2">
          {PATIENT_HISTORY.map((p) => (
            <li
              key={p.id}
              className="group p-3 bg-muted/20 border border-border/60 rounded-sm hover:border-primary/40 hover:bg-muted/40 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={cn("w-1.5 h-1.5 rounded-full", RISK_DOT[p.risk])} />
                  <span className="font-medium text-sm">{p.name}</span>
                  <span className="text-xs text-muted-foreground">· {p.age}</span>
                </div>
                <span className="font-mono text-[10px] text-primary">{p.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground truncate">{p.classification}</span>
                <span className="text-[10px] font-mono text-muted-foreground/80">{p.lastScan}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2 bg-muted/40 rounded-sm">
      <div className="label-tech">{label}</div>
      <div className="text-primary font-bold">{value}</div>
    </div>
  );
}
