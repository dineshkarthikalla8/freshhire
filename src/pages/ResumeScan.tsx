import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const steps = [
  'Parsing PDF',
  'Extracting keywords',
  'Matching job description',
  'Scoring and recommendations'
];

export const ResumeScan = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleFile = (f?: File) => {
    if (!f) return;
    setFileName(f.name);
    runScan();
  };

  const runScan = () => {
    setRunning(true);
    setResult(null);
    setProgress(0);

    // simulate scanning steps
    let current = 0;
    const interval = setInterval(() => {
      current += 5 + Math.floor(Math.random() * 10);
      setProgress(Math.min(100, current));
      if (current >= 100) {
        clearInterval(interval);
        // fake result
        setTimeout(() => {
          setResult({
            score: 82 + Math.floor(Math.random() * 10),
            keywordsMatched: ['React', 'TypeScript', 'Firebase', 'Algorithms'],
            suggestions: [
              'Add metrics to your experience bullets',
              'Include more system design keywords for senior roles',
              'Consider using stronger action verbs (Designed, Led, Built)'
            ]
          });
          setRunning(false);
          toast.success('Scan complete — results ready');
        }, 600);
      }
    }, 300);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] p-8 bg-[var(--background)]">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-black">ATS Resume Scanner</h1>
          <p className="text-[var(--muted-foreground)] mt-2">Upload a resume (PDF) and get instant ATS scoring and suggestions — demo mode (no files uploaded to server).</p>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <label className="block text-sm font-bold mb-2">Upload Resume (PDF)</label>
              <div className="flex items-center gap-4">
                <input
                  id="resume-file"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                  className="hidden"
                />
                <label htmlFor="resume-file" className="px-5 py-3 rounded-xl bg-[var(--primary)] text-white font-bold cursor-pointer">Choose file</label>
                <div className="text-sm text-[var(--muted-foreground)]">{fileName || 'No file selected'}</div>
                <button onClick={() => { setFileName('Sample_Resume.pdf'); runScan(); }} className="ml-auto px-4 py-2 rounded-xl border border-[var(--border)]">Use sample</button>
              </div>
            </div>
            <div className="w-64">
              <div className="text-xs font-bold text-[var(--muted-foreground)] uppercase">Live Scan Preview</div>
              <div className="mt-3 p-3 bg-[var(--background)] border border-[var(--border)] rounded-lg">
                <div className="h-28 flex items-center justify-center text-sm text-[var(--muted-foreground)]">Preview pane (demo)</div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="w-full bg-[var(--muted)] h-3 rounded-full overflow-hidden">
                <motion.div animate={{ width: `${progress}%` }} className="h-3 bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]" />
            </div>
            <div className="flex items-center justify-between mt-2 text-sm text-[var(--muted-foreground)]">
              <div>{running ? 'Scanning...' : (result ? 'Scan complete' : 'Idle')}</div>
              <div>{progress}%</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-3">
            {steps.map((s, i) => (
              <div
                key={s}
                className={`p-3 rounded-lg ${progress > i * 25 ? 'bg-[var(--primary)]/10 border-[var(--primary)]' : 'bg-[var(--background)] border-[var(--border)]'}`}
              >
                <div className="text-xs font-bold text-[var(--muted-foreground)]">Step {i+1}</div>
                <div className="font-medium">{s}</div>
              </div>
            ))}
          </div>
        </div>

        {result && (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-black">Results</h3>
              <div className="text-sm text-[var(--muted-foreground)]">Score</div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary)] flex items-center justify-center text-white font-black text-2xl">{result.score}</div>
              <div>
                <div className="text-sm text-[var(--muted-foreground)]">Keywords matched</div>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {result.keywordsMatched.map((k: string) => (
                    <span key={k} className="px-3 py-1 rounded-full bg-[var(--background)] border border-[var(--border)] text-sm">{k}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-bold mb-2">Top Suggestions</h4>
              <ul className="list-disc list-inside text-[var(--muted-foreground)]">
                {result.suggestions.map((s: string) => <li key={s}>{s}</li>)}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeScan;
