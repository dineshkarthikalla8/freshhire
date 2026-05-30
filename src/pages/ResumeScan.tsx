import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FiUpload, FiCheck, FiAlertCircle, FiFileText, FiTarget } from 'react-icons/fi';
import { ModuleHero } from '../components/ui/ModuleHero';
import { GlassCard } from '../components/ui/GlassCard';
import { getDocument } from 'pdfjs-dist/webpack.mjs';

const steps = ['Parsing PDF', 'Extracting keywords', 'Matching JD', 'Scoring resume'];

type ScanResult = {
  score: number;
  keywordsMatched: string[];
  suggestions: string[];
  missingKeywords: string[];
  roleMatch: string;
  summary: string;
};

const resumeKeywords = [
  'react',
  'typescript',
  'javascript',
  'html',
  'css',
  'firebase',
  'sql',
  'mongodb',
  'api',
  'rest',
  'node',
  'express',
  'testing',
  'git',
  'docker',
  'aws',
  'system design',
  'data structures',
  'algorithms',
  'placement',
  'internship',
  'project',
  'leadership',
  'communication',
];

const roleKeywordSets: Record<string, string[]> = {
  'Full Stack Developer': ['react', 'typescript', 'javascript', 'node', 'express', 'api', 'sql', 'mongodb', 'firebase'],
  'Frontend Developer': ['react', 'typescript', 'javascript', 'html', 'css', 'ui', 'ux', 'accessibility', 'performance'],
  'Backend Developer': ['node', 'express', 'api', 'sql', 'mongodb', 'rest', 'auth', 'testing', 'docker'],
  'SQL / Data Analyst': ['sql', 'data', 'excel', 'analytics', 'power bi', 'tableau', 'reporting', 'statistics'],
  'QA / Testing': ['testing', 'automation', 'cypress', 'selenium', 'jest', 'api', 'bug', 'quality'],
  'DevOps / Cloud': ['docker', 'aws', 'ci/cd', 'kubernetes', 'linux', 'devops', 'git', 'monitoring'],
};

const resumeSectionSignals = [
  'experience',
  'education',
  'projects',
  'skills',
  'summary',
  'objective',
  'internship',
  'certification',
  'contact',
  'profile',
];

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9+/.-]+/g, ' ');

const toTitleCase = (value: string) =>
  value
    .split(/[\s/_-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const looksLikeResume = (text: string) => {
  const normalized = normalize(text);
  const sectionMatches = resumeSectionSignals.filter((signal) => normalized.includes(signal)).length;
  const keywordMatches = resumeKeywords.filter((keyword) => normalized.includes(keyword)).length;
  const hasContact = /@/.test(text) || /\b(?:\+?\d[\d\s-]{8,}\d)\b/.test(text) || /linkedin/i.test(text);

  return text.trim().length > 300 && sectionMatches >= 2 && (keywordMatches >= 3 || hasContact);
};

const saveResumeScore = (score: number) => {
  try {
    const stored = localStorage.getItem('freshhire_progress');
    const parsed = stored ? JSON.parse(stored) : {};

    localStorage.setItem(
      'freshhire_progress',
      JSON.stringify({
        ...parsed,
        stats: {
          ...(parsed.stats || {}),
          resumeScore: score,
        },
      }),
    );
  } catch (error) {
    console.error('Error saving resume score', error);
  }
};

const parsePdfText = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const loadingTask = getDocument({ data: new Uint8Array(buffer) } as any);
  const pdf = await loadingTask.promise;

  let text = '';
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => ('str' in item ? item.str : ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    text = `${text} ${pageText}`.trim();
  }

  return text;
};

const analyzeText = (text: string, jobDescription: string, targetRole: string): ScanResult => {
  const normalized = normalize(text);
  const jdNormalized = normalize(jobDescription);
  const roleKeywords = roleKeywordSets[targetRole] || [];

  const resumeMatched = resumeKeywords.filter((keyword) => normalized.includes(keyword));
  const jdMatched = jobDescription
    ? resumeKeywords.filter((keyword) => jdNormalized.includes(keyword) && normalized.includes(keyword))
    : [];
  const roleMatched = roleKeywords.filter((keyword) => normalized.includes(keyword));

  const allMatched = Array.from(new Set([...resumeMatched, ...jdMatched, ...roleMatched]));
  const missingKeywords = (jobDescription ? resumeKeywords.filter((keyword) => jdNormalized.includes(keyword) && !normalized.includes(keyword)) : roleKeywords.filter((keyword) => !normalized.includes(keyword))).slice(0, 8);

  const baseCoverage = Math.round((resumeMatched.length / resumeKeywords.length) * 100);
  const jdCoverage = jobDescription ? Math.round((jdMatched.length / Math.max(1, resumeKeywords.filter((keyword) => jdNormalized.includes(keyword)).length)) * 100) : 0;
  const roleCoverage = targetRole ? Math.round((roleMatched.length / Math.max(1, roleKeywords.length)) * 100) : 0;

  const score = Math.min(
    99,
    Math.max(
      30,
      Math.round((baseCoverage * 0.45) + (jdCoverage * 0.4) + (roleCoverage * 0.15) + Math.min(allMatched.length * 2, 15) + 35),
    ),
  );

  const suggestions = [
    !normalized.includes('experience') ? 'Add a clear experience section with measurable impact.' : '',
    !normalized.includes('project') ? 'Include a projects section with technologies and outcomes.' : '',
    !normalized.includes('achievement') && !normalized.includes('awarded') ? 'Add achievements or impact bullets with numbers.' : '',
    !normalized.includes('education') ? 'Make sure education details are visible near the top or in a clear section.' : '',
    !normalized.includes('skill') ? 'Add a concise skills section with tools, languages, and frameworks.' : '',
    jobDescription && missingKeywords.length > 0 ? `Mirror the job description keywords that are missing: ${missingKeywords.slice(0, 4).join(', ')}.` : '',
    targetRole && roleCoverage < 60 ? `Tune the resume for ${targetRole} by highlighting the exact tools used in that role.` : '',
    allMatched.length < 8 ? 'Tailor the resume with more ATS keywords from the target role.' : '',
  ].filter(Boolean) as string[];

  return {
    score,
    keywordsMatched: allMatched.slice(0, 10).map((item) => toTitleCase(item)),
    missingKeywords: missingKeywords.map((item) => toTitleCase(item)),
    roleMatch: targetRole || 'General Resume',
    summary: jobDescription
      ? `Matched ${jdMatched.length} JD keywords and ${resumeMatched.length} resume signals for ${targetRole || 'the selected role'}.`
      : `Matched ${resumeMatched.length} ATS keywords from the resume itself.`,
    suggestions: suggestions.length > 0 ? suggestions : ['Resume looks balanced. Add role-specific keywords for better ATS matching.'],
  };
};

export const ResumeScan = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState('');

  const roleOptions = useMemo(() => Object.keys(roleKeywordSets), []);

  const runScan = async (file?: File) => {
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      toast.error('Only PDF resumes are accepted. Please upload a PDF file.');
      setFileName(null);
      setResult(null);
      setProgress(0);
      return;
    }

    setRunning(true);
    setResult(null);
    setProgress(0);
    const progressTimer = window.setInterval(() => {
      setProgress((current) => Math.min(90, current + 12));
    }, 180);

    try {
      const text = await parsePdfText(file);
      if (!looksLikeResume(text)) {
        throw new Error('This PDF does not look like a resume.');
      }

      const analysis = analyzeText(text, jobDescription, targetRole);
      saveResumeScore(analysis.score);
      setProgress(100);
      setResult(analysis);
      toast.success('Scan complete');
    } catch (error) {
      console.error('resume scan error', error);
      const message = error instanceof Error ? error.message : 'Could not read the PDF.';
      if (message.includes('worker')) {
        toast.error('PDF parser setup failed. Please retry.');
      } else if (message.includes('does not look like a resume')) {
        toast.error('This PDF does not look like a resume. Please upload a CV with sections like Experience, Education, Projects, and Skills.');
      } else {
        toast.error('Could not read the PDF. Please upload a valid resume PDF.');
      }
    } finally {
      window.clearInterval(progressTimer);
      setRunning(false);
    }
  };

  const handleFile = (f?: File) => {
    if (!f) return;
    setFileName(f.name);
    void runScan(f);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <ModuleHero
        eyebrow="Resume Analyzer"
        title="PDF-only ATS resume analysis"
        description="Upload a PDF resume to get ATS keyword matching. Add a job description or role to score it against the target opening."
        stats={[
          { label: 'Format', value: 'PDF only' },
          { label: 'ATS keywords', value: `${resumeKeywords.length}+` },
          { label: 'Role scoring', value: 'Optional' },
          { label: 'Output', value: 'Score + tips' },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            <FiFileText className="h-4 w-4 text-[var(--primary)]" />
            Upload resume
          </div>
          <label
            htmlFor="resume-file"
            className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--background)] px-6 py-12 transition hover:border-[var(--primary)] hover:bg-[var(--primary)]/5"
          >
            <FiUpload className="h-10 w-10 text-[var(--primary)]" />
            <p className="mt-3 text-sm font-semibold">Drop a PDF resume or click to browse</p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">{fileName || 'Max 5MB · PDF only · job description optional'}</p>
            <input id="resume-file" type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
          </label>

          <div className="mt-5 grid gap-4">
            <label className="block space-y-2 text-sm">
              <span className="font-semibold">Target role (optional)</span>
              <div className="relative">
                <FiTarget className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <select
                  value={targetRole}
                  onChange={(event) => setTargetRole(event.target.value)}
                  className="input-field pl-10"
                >
                  <option value="">General resume</option>
                  {roleOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </label>

            <label className="block space-y-2 text-sm">
              <span className="font-semibold">Job description / JD (optional)</span>
              <textarea
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                placeholder="Paste the job description here to score keyword match against it"
                className="input-field min-h-32"
              />
            </label>
          </div>

          <p className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 text-sm text-[var(--muted-foreground)]">
            Only PDF resumes are accepted. If you upload an image, DOC, or any other file type, it will be rejected.
          </p>

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
                <p className="mt-2 text-xs text-[var(--muted-foreground)]">{result?.summary || 'Upload a PDF resume to get a score.'}</p>
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
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
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

              <GlassCard>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Missing keywords</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.missingKeywords.length > 0 ? result.missingKeywords.map((keyword) => (
                    <span key={keyword} className="inline-flex items-center gap-1 rounded-full border border-dashed border-[var(--border)] bg-[var(--background)] px-3 py-1 text-xs font-medium text-[var(--muted-foreground)]">
                      {keyword}
                    </span>
                  )) : (
                    <span className="text-sm text-[var(--muted-foreground)]">No major keyword gaps found.</span>
                  )}
                </div>
                <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 text-sm text-[var(--muted-foreground)]">
                  <span className="font-semibold text-[var(--foreground)]">Role match:</span> {result.roleMatch}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeScan;
