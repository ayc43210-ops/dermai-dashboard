import { ChevronRight, Stethoscope } from "lucide-react";
import type { ScanResult } from "@/lib/mockApi";

interface Props {
  result: ScanResult | null;
}

export function ClinicalInsights({ result }: Props) {
  return (
    <div className="panel panel-corner p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-primary" />
          <span className="label-tech">CLINICAL INSIGHTS</span>
        </div>
        <span className="label-tech text-primary">{result ? "SYNTHESIZED" : "STANDBY"}</span>
      </div>

      {!result ? (
        <p className="text-sm text-muted-foreground/70 font-mono py-8 text-center">
          // insights will populate after scan completion
        </p>
      ) : (
        <div className="space-y-4">
          <ul className="space-y-2">
            {result.insights.map((insight, i) => (
              <li
                key={i}
                className="flex items-start gap-3 p-3 bg-muted/30 border border-border/60 rounded-sm hover:border-primary/40 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm leading-relaxed">{insight}</span>
              </li>
            ))}
          </ul>

          <div className="border-t border-border pt-4">
            <div className="label-tech mb-2">RECOMMENDED ACTION</div>
            <div className="p-3 bg-primary/5 border-l-2 border-primary rounded-sm">
              <p className="text-sm font-medium">{result.recommendation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
