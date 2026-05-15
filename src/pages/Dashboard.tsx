import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { usePayment } from '../context/PaymentContext';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:8000/api/v1';

export const Dashboard = () => {
  const { hasPaid, handlePayment } = usePayment();
  const { user } = useAuth();
  
  const [resumeText, setResumeText] = useState('');
  const [inputType, setInputType] = useState<'jd' | 'role'>('jd');
  const [jobDescription, setJobDescription] = useState('');
  const [role, setRole] = useState('');
  const [score, setScore] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [recentScans, setRecentScans] = useState<any[]>([]);

  // Load recent scans on mount
  useEffect(() => {
    const savedScans = localStorage.getItem('freshhire_recent_scans');
    if (savedScans) {
      try {
        setRecentScans(JSON.parse(savedScans));
      } catch (e) {
        console.error('Failed to parse recent scans');
      }
    }
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const toastId = toast.loading('Extracting text from PDF...');
    try {
      const res = await axios.post(`${API_BASE}/extract-text`, formData);
      setResumeText(res.data.text);
      toast.success('Text extracted successfully!', { id: toastId });
    } catch (err) {
      toast.error('Failed to extract text from PDF.', { id: toastId });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1
  });

  const handleScore = async () => {
    if (!resumeText) {
      toast.error('Please upload your resume first.');
      return;
    }

    if (inputType === 'jd' && !jobDescription) {
      toast.error('Please provide a job description.');
      return;
    }

    if (inputType === 'role' && !role) {
      toast.error('Please specify a role (e.g. Software Engineer).');
      return;
    }

    if (!hasPaid) {
      toast.error('Premium Features Locked. Please unlock the bundle to view ATS scores.');
      window.location.href = '/payment';
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Calculating ATS score...');
    try {
      const res = await axios.post(`${API_BASE}/score`, {
        resume_text: resumeText,
        job_description: inputType === 'jd' ? jobDescription : null,
        role: inputType === 'role' ? role : null
      });
      
      const newScore = res.data;
      setScore(newScore);
      toast.success('Score calculated!', { id: toastId });

      // Save to recent scans
      const scanRecord = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        type: inputType === 'jd' ? 'Custom JD' : role,
        score: newScore.total_score,
        data: newScore
      };
      
      const updatedScans = [scanRecord, ...recentScans].slice(0, 5); // Keep last 5
      setRecentScans(updatedScans);
      localStorage.setItem('freshhire_recent_scans', JSON.stringify(updatedScans));

    } catch (err) {
      toast.error('Failed to calculate score.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const loadScan = (scanData: any) => {
    setScore(scanData);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[var(--background)] p-8">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Premium Banner */}
        {!hasPaid && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 w-full bg-gradient-to-r from-[var(--primary)] via-indigo-600 to-teal-500 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-white/10 blur-3xl rounded-full" />
            <div className="flex items-center gap-4 mb-6 md:mb-0 relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              </div>
              <div>
                <h4 className="font-black text-xl mb-1">Unlock the ₹35 Ultimate Bundle</h4>
                <p className="opacity-90 text-sm font-medium">Get deep AI resume improvements AND unlock the Top 150 DSA Prep Pathway.</p>
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/payment'} 
              className="px-8 py-3.5 bg-white text-[var(--primary)] font-black rounded-xl shadow-lg relative z-10 w-full md:w-auto"
            >
              Unlock for ₹35
            </motion.button>
          </motion.div>
        )}

        <h2 className="text-4xl font-black mb-8 text-[var(--foreground)] tracking-tight">
          {user ? `Welcome back, ${user.name.split(' ')[0]}` : 'Candidate Dashboard'}
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          <div className="lg:col-span-7 space-y-6">
            {/* Upload Resume Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 border border-[var(--border)] rounded-3xl bg-[var(--card)] shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-teal-400 text-white flex items-center justify-center font-black shadow-md">1</div>
                <h3 className="text-2xl font-black text-[var(--foreground)]">Upload Resume</h3>
              </div>
              
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive ? 'border-[var(--primary)] bg-[var(--primary)]/5 scale-[1.02] shadow-inner' : 'border-[var(--border)] hover:border-[var(--primary)]/50 hover:bg-[var(--muted)]'
                }`}
              >
                <input {...getInputProps()} />
                <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-colors ${isDragActive ? 'bg-[var(--primary)]/20 text-[var(--primary)]' : 'bg-[var(--muted)] text-[var(--muted-foreground)] group-hover:text-[var(--primary)]'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m9 15 3-3 3 3"/></svg>
                </div>
                {isDragActive ? (
                  <p className="text-[var(--primary)] font-black text-xl">Drop the PDF here ...</p>
                ) : (
                  <div>
                    <p className="font-black text-xl mb-2 text-[var(--foreground)]">Click to upload or drag and drop</p>
                    <p className="text-[var(--muted-foreground)] text-sm font-medium">PDF format only, max 5MB</p>
                  </div>
                )}
              </div>
              {resumeText && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 p-4 rounded-xl bg-[var(--success)]/10 border border-[var(--success)]/20 flex items-center gap-3 text-[var(--success)]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <span className="font-bold">Resume parsed successfully ({resumeText.length} characters)</span>
                </motion.div>
              )}
            </motion.div>

            {/* Target Role / JD Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-8 border border-[var(--border)] rounded-3xl bg-[var(--card)] shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-teal-400 text-white flex items-center justify-center font-black shadow-md">2</div>
                <h3 className="text-2xl font-black text-[var(--foreground)]">Target Position</h3>
              </div>
              
              <div className="flex p-1.5 bg-[var(--muted)] rounded-xl mb-6 w-fit">
                <button 
                  onClick={() => setInputType('jd')}
                  className={`px-5 py-2.5 text-sm font-bold rounded-lg transition-all ${inputType === 'jd' ? 'bg-[var(--card)] shadow-sm text-[var(--foreground)]' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}
                >
                  Paste JD
                </button>
                <button 
                  onClick={() => setInputType('role')}
                  className={`px-5 py-2.5 text-sm font-bold rounded-lg transition-all ${inputType === 'role' ? 'bg-[var(--card)] shadow-sm text-[var(--foreground)]' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}
                >
                  Strict Role Scoring
                </button>
              </div>

              <AnimatePresence mode="wait">
                {inputType === 'jd' ? (
                  <motion.div key="jd" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <textarea 
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the exact requirements and description for the role..."
                      className="w-full h-40 p-5 border border-[var(--border)] rounded-2xl bg-[var(--background)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all resize-none font-medium"
                    />
                  </motion.div>
                ) : (
                  <motion.div key="role" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <input 
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Software Engineer, Product Manager"
                      className="w-full p-5 border border-[var(--border)] rounded-2xl bg-[var(--background)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all font-medium text-lg"
                    />
                    <p className="mt-3 text-sm text-[var(--muted-foreground)] font-medium">We will use our AI to score your resume against strict baseline requirements for this role.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Action Button */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleScore}
              disabled={loading || !resumeText || (inputType === 'jd' ? !jobDescription : !role)}
              className="w-full py-5 rounded-2xl font-black text-xl bg-gradient-to-r from-[var(--primary)] to-teal-400 text-white hover:opacity-90 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 border border-transparent disabled:shadow-none"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Analyzing Profile...
                </>
              ) : (
                <>
                  Calculate ATS Match Score
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </>
              )}
            </motion.button>
          </div>

          {/* Results Side Panel */}
          <div className="lg:col-span-5">
            <div className="p-8 border border-[var(--border)] rounded-3xl bg-[var(--card)] shadow-lg h-full sticky top-28 overflow-hidden">
              <h3 className="text-2xl font-black mb-6 text-[var(--foreground)]">Score Analysis</h3>
              
              {score ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                  
                  {/* Big Circular Score */}
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary)] to-teal-400 rounded-full blur-[40px] opacity-20"></div>
                      <div className="relative w-48 h-48 rounded-full border-[12px] border-[var(--muted)] flex items-center justify-center bg-[var(--background)] shadow-inner">
                        <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-md" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="12" strokeDasharray={`${score.total_score * 2.76} 276`} strokeLinecap="round" className="text-[var(--primary)]" />
                        </svg>
                        <span className="text-6xl font-black text-[var(--foreground)]">{score.total_score}<span className="text-3xl text-[var(--muted-foreground)]">%</span></span>
                      </div>
                    </div>
                    <p className="mt-8 text-[var(--primary)] font-black text-lg uppercase tracking-widest">Overall Match</p>
                  </div>
                  
                  {/* Detailed Bars */}
                  <div className="space-y-6">
                    {[
                      { label: 'Keywords', val: score.keyword_score, max: 40 },
                      { label: 'Skills', val: score.skills_score, max: 25 },
                      { label: 'Experience', val: score.experience_score, max: 15 },
                      { label: 'Projects', val: score.projects_score, max: 10 },
                    ].map(item => (
                      <div key={item.label}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-bold text-[var(--foreground)]">{item.label}</span>
                          <span className="text-[var(--muted-foreground)] font-bold bg-[var(--muted)] px-2 py-0.5 rounded-md">{item.val} / {item.max}</span>
                        </div>
                        <div className="w-full h-3 bg-[var(--muted)] rounded-full overflow-hidden border border-[var(--border)]">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.val / item.max) * 100}%` }}
                            transition={{ duration: 1, delay: 0.2, type: 'spring' }}
                            className="h-full bg-gradient-to-r from-[var(--primary)] to-teal-400"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Feedback Section */}
                  <div className="pt-6 border-t border-[var(--border)] relative">
                    <h4 className="font-bold mb-4 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                      Actionable Feedback
                    </h4>
                    
                    <ul className="space-y-3">
                      {score.feedback.map((f: string, i: number) => (
                        <li key={i} className="flex gap-3 text-[var(--foreground)] font-medium text-sm leading-relaxed">
                          <div className="w-1.5 h-1.5 rounded-full bg-[var(--foreground)] mt-1.5 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                </motion.div>
              ) : (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center px-6">
                  <div className="w-20 h-20 rounded-2xl bg-[var(--muted)] flex items-center justify-center mb-6 text-[var(--muted-foreground)]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
                  </div>
                  <p className="text-[var(--muted-foreground)] font-medium text-lg">Awaiting your resume and job details to generate insights.</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Recent Scans Section */}
        {recentScans.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-black mb-6 text-[var(--foreground)] tracking-tight flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
              Recent Scans
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentScans.map((scan) => (
                <div 
                  key={scan.id} 
                  onClick={() => loadScan(scan.data)}
                  className="bg-[var(--card)] border border-[var(--border)] p-5 rounded-2xl cursor-pointer hover:border-[var(--foreground)] transition-colors group flex justify-between items-center shadow-sm"
                >
                  <div>
                    <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest mb-1">{scan.date}</p>
                    <p className="font-bold text-[var(--foreground)] truncate max-w-[150px]">{scan.type}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg border-2 ${
                    scan.score >= 80 ? 'border-green-500 text-green-500 bg-green-500/10' :
                    scan.score >= 60 ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' :
                    'border-red-500 text-red-500 bg-red-500/10'
                  }`}>
                    {scan.score}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
