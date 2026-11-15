import { Cpu, History, TrendingUp } from "lucide-react";
import { MODEL_INFO, type RiskLevel, type SessionScan } from "@/lib/api";
import { cn } from "@/lib/utils";

const RISK_DOT: Record<RiskLevel, string> = {
  Critical: "bg-risk-critical",
  High: "bg-risk-high",
  Low: "bg-risk-low",
};

interface SidebarProps {
  history: SessionScan[];
}

export function DermSidebar({ history }: SidebarProps) {
  return (
    <aside className="space-y-4">
      {/* Model info */}
      <div className="panel panel-corner p-5">
        <div className="flex items-center gap-2 mb-4">
          <Cpu className="w-4 h-4 text-primary" />
          <span className="label-tech">MODEL DIAGNOSTICS</span>
        </div>

        <div className="text-center mb-4">
          <div className="text-5xl font-bold font-mono neon-text">
            {MODEL_INFO.reportedAccuracy}
            <span className="text-2xl">%</span>
          </div>
          <div className="label-tech mt-1">reported accuracy</div>
        </div>

        <div className="h-1.5 bg-muted rounded-sm overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-neon animate-pulse-glow"
            style={{ width: `${MODEL_INFO.reportedAccuracy}%` }}
          />
        </div>

        <div className="mt-4 pt-4 border-t border-border space-y-1 text-[11px] font-mono">
          <div className="flex justify-between">
            <span className="text-muted-foreground">ARCHITECTURE</span>
            <span className="text-primary">{MODEL_INFO.architecture}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">DATASET</span>
            <span>{MODEL_INFO.dataset}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">CLASSES</span>
            <span>{MODEL_INFO.classes}</span>
          </div>
        </div>
      </div>

      {/* Session history (this browser session only) */}
      <div className="panel panel-corner p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            <span className="label-tech">SESSION HISTORY</span>
          </div>
          <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
        </div>

        {history.length === 0 ? (
          <p className="text-xs text-muted-foreground/70 font-mono py-4 text-center">// no scans yet</p>
        ) : (
          <ul className="space-y-2">
            {history.map((s) => (
              <li
                key={s.id}
                className="p-3 bg-muted/20 border border-border/60 rounded-sm hover:border-primary/40 hover:bg-muted/40 transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", RISK_DOT[s.risk])} />
                    <span className="font-medium text-sm truncate">{s.classification}</span>
                  </div>
                  <span className="font-mono text-[10px] text-primary shrink-0 ml-2">{s.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground truncate">{s.fileName}</span>
                  <span className="text-[10px] font-mono text-muted-foreground/80 shrink-0 ml-2">
                    {s.confidence.toFixed(1)}% · {new Date(s.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
