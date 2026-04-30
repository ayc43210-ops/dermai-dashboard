import { Activity, Wifi, ShieldCheck } from "lucide-react";

export function TopBar() {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-20">
      <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-sm bg-gradient-neon flex items-center justify-center shadow-neon">
              <Activity className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider leading-none">
              DERM<span className="neon-text">AI</span>
            </h1>
            <span className="label-tech">oncological vision system</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {["DASHBOARD", "ARCHIVE", "PATIENTS", "MODEL"].map((item, i) => (
            <button
              key={item}
              className={`label-tech hover:text-primary transition-colors ${i === 0 ? "text-primary" : ""}`}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-risk-low" />
            <span className="text-risk-low">ONLINE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span className="text-muted-foreground">HIPAA·SECURE</span>
          </div>
          <div className="hidden lg:block px-2 py-1 bg-muted/50 rounded-sm border border-border">
            <span className="text-muted-foreground">DR_ </span>
            <span className="text-primary">K.MORITZ</span>
          </div>
        </div>
      </div>
    </header>
  );
}
