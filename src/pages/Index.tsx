import { useState } from "react";
import { Download, RotateCcw, Zap } from "lucide-react";
import { TopBar } from "@/components/dermai/TopBar";
import { UploadZone } from "@/components/dermai/UploadZone";
import { ResultsPanel } from "@/components/dermai/ResultsPanel";
import { ClinicalInsights } from "@/components/dermai/ClinicalInsights";
import { DermSidebar } from "@/components/dermai/Sidebar";
import { analyzeImage, type ScanResult } from "@/lib/mockApi";
import { downloadPdfReport } from "@/lib/pdfReport";
import { toast } from "sonner";

const Index = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
      setIsAnalyzing(true);
      setResult(null);
      try {
        const res = await analyzeImage(file);
        setResult(res);
        toast.success(`Scan complete: ${res.classification}`, {
          description: `${res.confidence.toFixed(1)}% confidence · ${res.risk} risk`,
        });
      } catch {
        toast.error("Analysis failed. Retry or check connection.");
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setPreview(null);
    setResult(null);
  };

  const handleDownload = () => {
    if (!result) return;
    downloadPdfReport(result, preview);
  };

  return (
    <div className="min-h-screen">
      <TopBar />

      <main className="max-w-[1600px] mx-auto px-6 py-6">
        {/* Status bar */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-wide uppercase">
              Diagnostic <span className="neon-text">Console</span>
            </h2>
            <span className="label-tech px-2 py-1 border border-border rounded-sm">
              SESSION_{Date.now().toString(36).slice(-6).toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              disabled={!preview}
              className="flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider border border-border rounded-sm hover:border-primary/60 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              onClick={handleDownload}
              disabled={!result}
              className="flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider bg-primary text-primary-foreground rounded-sm hover:bg-primary-glow disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:shadow-neon font-bold"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF Report
            </button>
          </div>
        </div>

        {/* Layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          <div className="space-y-6">
            {/* Hero: upload + results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UploadZone
                onFile={handleFile}
                isAnalyzing={isAnalyzing}
                preview={preview}
                onClear={handleClear}
              />
              <ResultsPanel result={result} />
            </div>

            {/* Insights */}
            <ClinicalInsights result={result} />

            {/* Footer ribbon */}
            <div className="flex items-center justify-between p-3 bg-card/50 border border-border rounded-sm text-xs font-mono">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Zap className="w-3.5 h-3.5 text-primary" />
                <span>BACKEND: <span className="text-primary">FastAPI/predict</span> // mock active</span>
              </div>
              <span className="text-muted-foreground">© DermAI Systems · Class IIa Medical Device</span>
            </div>
          </div>

          <DermSidebar />
        </div>
      </main>
    </div>
  );
};

export default Index;
