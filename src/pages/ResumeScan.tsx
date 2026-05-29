import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FiUpload, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { ModuleHero } from '../components/ui/ModuleHero';
import { GlassCard } from '../components/ui/GlassCard';

const steps = ['Parsing PDF', 'Extracting keywords', 'Matching JD', 'Scoring resume'];

type ScanResult = {
  score: number;
  keywordsMatched: string[];
  suggestions: string[];
};

export const ResumeScan = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const runScan = () => {
    setRunning(true);
    setResult(null);
    setProgress(0);
    let current = 0;
    const interval = setInterval(() => {
      current += 5 + Math.floor(Math.random() * 10);
      setProgress(Math.min(100, current));
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setResult({
            score: 82 + Math.floor(Math.random() * 10),
            keywordsMatched: ['React', 'TypeScript', 'Firebase', 'Algorithms', 'System Design'],
            suggestions: [
              'Add metrics to experience bullets (e.g. improved performance by 30%)',
              'Include more system design keywords for senior SDE roles',
              'Use stronger action verbs: Designed, Led, Architected',
              'Tailor skills section to match the job description',
            ],
          });
          setRunning(false);
          toast.success('Scan complete');
        }, 500);
      }
    }, 280);
  };

  const handleFile = (f?: File) => {
    if (!f) return;
    setFileName(f.name);
    runScan();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <ModuleHero
        eyebrow="Resume Scanner"
        title="ATS-ready resume analysis"
        description="Upload your PDF for keyword matching, ATS scoring, and actionable improvement tips."
        stats={[
          { label: 'Avg score', value: '78%' },
          { label: 'Keywords', value: '50+' },
          { label: 'Format', value: 'PDF' },
          { label: 'Time', value: '~30s' },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Upload resume</p>
          <label
            htmlFor="resume-file"
            className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--background)] px-6 py-12 transition hover:border-[var(--primary)] hover:bg-[var(--primary)]/5"
          >
            <FiUpload className="h-10 w-10 text-[var(--primary)]" />
            <p className="mt-3 text-sm font-semibold">Drop PDF or click to browse</p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">{fileName || 'Max 5MB · PDF only'}</p>
            <input id="resume-file" type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
          </label>
          <button
            type="button"
            onClick={() => {
              setFileName('Sample_Resume.pdf');
              runScan();
            }}
            className="btn-outline mt-4 w-full py-2.5 text-sm"
          >
            Use sample resume
          </button>

          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {steps.map((s, i) => (
              <div
                key={s}
                className={`rounded-xl border p-3 text-center text-xs ${
                  progress > i * 25 ? 'border-[var(--primary)]/40 bg-[var(--primary)]/10' : 'border-[var(--border)]'
                }`}
              >
                <p className="font-semibold">{s}</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard glow={!!result}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">ATS Score</p>
                <p className="mt-1 text-4xl font-bold text-[var(--primary)]">{result ? result.score : running ? '...' : '—'}</p>
              </div>
              <div className="relative h-24 w-24">
                <svg className="-rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="var(--muted)" strokeWidth="3" />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="3"
                    strokeDasharray={`${(result?.score ?? progress) * 0.88} 88`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">{progress}%</span>
              </div>
            </div>
            <div className="progress-track mt-4">
              <motion.div animate={{ width: `${progress}%` }} className="progress-fill" />
            </div>
            <p className="mt-2 text-xs text-[var(--muted-foreground)]">{running ? 'Scanning...' : result ? 'Analysis complete' : 'Upload to start'}</p>
          </GlassCard>

          {result && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <GlassCard>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Keywords matched</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.keywordsMatched.map((k) => (
                    <span key={k} className="inline-flex items-center gap-1 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-3 py-1 text-xs font-medium text-[var(--primary)]">
                      <FiCheck className="h-3 w-3" /> {k}
                    </span>
                  ))}
                </div>
                <p className="mt-6 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Suggestions</p>
                <ul className="mt-3 space-y-2">
                  {result.suggestions.map((s) => (
                    <li key={s} className="flex gap-2 text-sm text-[var(--muted-foreground)]">
                      <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
                      {s}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeScan;
