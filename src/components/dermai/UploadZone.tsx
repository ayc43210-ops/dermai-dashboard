import { useCallback, useRef, useState } from "react";
import { Upload, ImageIcon, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFile: (file: File) => void;
  isAnalyzing: boolean;
  preview: string | null;
  onClear: () => void;
}

export function UploadZone({ onFile, isAnalyzing, preview, onClear }: UploadZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || !files[0]) return;
      onFile(files[0]);
    },
    [onFile]
  );

  return (
    <div
      className={cn(
        "panel panel-corner relative min-h-[420px] flex items-center justify-center transition-all",
        dragOver && "ring-2 ring-primary shadow-neon",
        isAnalyzing && "scanline"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      {/* Header strip */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary blink" />
          <span className="label-tech">DERM://SCANNER_01</span>
        </div>
        <span className="label-tech">
          {isAnalyzing ? "ANALYZING..." : preview ? "TARGET LOCKED" : "AWAITING_INPUT"}
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {preview ? (
        <div className="relative w-full h-full p-6 pt-12">
          <img
            src={preview}
            alt="Lesion under analysis"
            className="w-full h-[340px] object-contain rounded-sm border border-primary/40"
          />
          {!isAnalyzing && (
            <button
              onClick={onClear}
              className="absolute top-14 right-8 w-8 h-8 rounded-sm bg-card border border-border hover:border-destructive hover:text-destructive flex items-center justify-center transition-colors"
              aria-label="Clear image"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {isAnalyzing && (
            <div className="absolute inset-6 top-12 flex items-center justify-center bg-background/60 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <span className="font-mono text-sm neon-text uppercase tracking-widest">
                  Neural Net Processing
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-4 py-10 px-8 w-full h-full group"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full group-hover:bg-primary/40 transition-all" />
            <div className="relative w-20 h-20 rounded-sm border-2 border-primary/60 flex items-center justify-center group-hover:border-primary group-hover:shadow-neon transition-all">
              <Upload className="w-9 h-9 text-primary" />
            </div>
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-semibold tracking-wide uppercase">
              Drop Image to <span className="neon-text">Scan</span>
            </h2>
            <p className="text-sm text-muted-foreground font-mono">
              [ DRAG & DROP / CLICK TO SELECT ]
            </p>
            <p className="text-xs text-muted-foreground/70 mt-2">
              Supports: JPG, PNG, WEBP · Max 20MB · Dermoscopic preferred
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <ImageIcon className="w-4 h-4 text-muted-foreground" />
            <span className="label-tech">protocol_v3.1 ready</span>
          </div>
        </button>
      )}
    </div>
  );
}
