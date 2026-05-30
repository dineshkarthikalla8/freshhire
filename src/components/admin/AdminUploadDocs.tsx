import React, { useState, useEffect, useMemo } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-hot-toast';
import { FiUpload, FiTrash2, FiRotateCcw, FiFileText, FiExternalLink } from 'react-icons/fi';
import { db, storage } from '../../config/firebase';
import { useStudyContent, type StudyCategory } from '../../context/StudyContentContext';

export const AdminUploadDocs = () => {
  const { aptitudeTopics, reasoningTopics, verbalTopics, dsaTopics, getTopicById } = useStudyContent();

  const [category, setCategory] = useState<StudyCategory>('aptitude');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [directUrl, setDirectUrl] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // Get topics for the selected category
  const topics = useMemo(() => {
    switch (category) {
      case 'aptitude':
        return aptitudeTopics;
      case 'reasoning':
        return reasoningTopics;
      case 'verbal':
        return verbalTopics;
      case 'dsa':
        return dsaTopics;
      default:
        return [];
    }
  }, [category, aptitudeTopics, reasoningTopics, verbalTopics, dsaTopics]);

  // Reset selected topic when category/topics list changes
  useEffect(() => {
    if (topics.length > 0) {
      setSelectedTopicId(topics[0].id);
    } else {
      setSelectedTopicId('');
    }
  }, [topics]);

  // Find the selected topic object
  const currentTopic = useMemo(() => {
    if (!selectedTopicId) return null;
    return getTopicById(selectedTopicId) || null;
  }, [selectedTopicId, getTopicById]);

  // Form Reset
  const handleReset = () => {
    setCategory('aptitude');
    setFile(null);
    setDirectUrl('');
    setUploadProgress(null);
    const fileInput = document.getElementById('pdf-file-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    toast.success('Form reset');
  };

  // Delete PDF association
  const handleDeletePdf = async () => {
    if (!selectedTopicId || !currentTopic?.pdfUrl) return;
    if (!window.confirm(`Are you sure you want to delete the document for "${currentTopic.title}"?`)) return;

    setSaving(true);
    try {
      await setDoc(
        doc(db, 'studyContent', selectedTopicId),
        {
          pdfUrl: null,
          pdfName: null,
        },
        { merge: true }
      );
      toast.success('Document deleted successfully!');
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete document');
    } finally {
      setSaving(false);
    }
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0] || null;
    if (droppedFile) {
      if (droppedFile.type !== 'application/pdf' && !droppedFile.name.toLowerCase().endsWith('.pdf')) {
        toast.error('Only PDF files are allowed');
        return;
      }
      setFile(droppedFile);
      setDirectUrl('');
      toast.success(`Selected file: ${droppedFile.name}`);
    }
  };

  // Upload and Save Doc
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTopicId) {
      toast.error('Please select a topic');
      return;
    }

    if (!file && !directUrl.trim()) {
      toast.error('Please select a PDF file or enter a document URL');
      return;
    }

    setSaving(true);
    
    try {
      let downloadUrl = '';
      let pdfName = '';

      if (directUrl.trim()) {
        downloadUrl = directUrl.trim();
        try {
          const urlObj = new URL(downloadUrl);
          const pathname = urlObj.pathname;
          const extractedName = pathname.substring(pathname.lastIndexOf('/') + 1);
          pdfName = extractedName.endsWith('.pdf') ? decodeURIComponent(extractedName) : 'Linked Guide';
        } catch {
          pdfName = 'Linked Guide';
        }
      } else if (file) {
        setUploadProgress(20);
        const path = `experiences/docs_${selectedTopicId}_${Date.now()}_${file.name}`;
        const sRef = storageRef(storage, path);
        setUploadProgress(50);
        const snapshot = await uploadBytes(sRef, file);
        setUploadProgress(90);
        downloadUrl = await getDownloadURL(snapshot.ref);
        pdfName = file.name;
      }

      // Update/Merge in Firestore
      await setDoc(
        doc(db, 'studyContent', selectedTopicId),
        {
          pdfUrl: downloadUrl,
          pdfName: pdfName,
          title: currentTopic?.title || topics.find((t) => t.id === selectedTopicId)?.title || '',
          category: category,
        },
        { merge: true }
      );

      toast.success('Document uploaded and saved successfully!');
      setFile(null);
      setDirectUrl('');
      const fileInput = document.getElementById('pdf-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err: any) {
      console.error('Upload failed:', err);
      toast.error(`Upload failed: ${err?.message || err}`);
    } finally {
      setUploadProgress(null);
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <section className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl shadow-black/5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">Document Studio</p>
          <h2 className="mt-2 text-2xl font-black">Upload PDF Guides for Topics</h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Select a category and topic, upload a PDF study document, and it will be rendered at the bottom of the study detail page.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        
        {/* Upload Form (Resembles styled premium layout) */}
        <section className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl shadow-black/5 sm:p-8">
          <div className="mb-6">
            <h3 className="text-lg font-black text-[var(--foreground)]">Study Document Linker</h3>
            <p className="text-xs text-[var(--muted-foreground)]">Fill in the fields below to bind a PDF to a topic</p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Academic Section & Topic Dropdowns */}
            <div className="grid gap-6 sm:grid-cols-2">
              
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Category / Section
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as StudyCategory)}
                  className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 outline-none transition focus:ring-2 focus:ring-[var(--foreground)] text-sm"
                >
                  <option value="aptitude">Aptitude</option>
                  <option value="reasoning">Reasoning</option>
                  <option value="verbal">Verbal</option>
                  <option value="dsa">DSA</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Select Study Topic
                </label>
                <select
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(e.target.value)}
                  disabled={topics.length === 0}
                  className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 outline-none transition focus:ring-2 focus:ring-[var(--foreground)] text-sm disabled:opacity-50"
                >
                  {topics.length === 0 ? (
                    <option value="">No topics available</option>
                  ) : (
                    topics.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))
                  )}
                </select>
              </div>

            </div>

             {/* File Upload Field */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                Upload PDF Guide
              </label>
              <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="relative flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background)]/50 p-8 text-center transition hover:border-[var(--primary)]/50"
              >
                <FiUpload className="h-8 w-8 text-[var(--muted-foreground)] mb-3" />
                <p className="text-sm font-semibold">
                  {file ? file.name : 'Click to select or drag PDF file here'}
                </p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  PDF format only. Maximum 10MB.
                </p>
                <input
                  id="pdf-file-input"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    const selected = e.target.files?.[0] || null;
                    setFile(selected);
                    if (selected) setDirectUrl('');
                  }}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border)]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[var(--card)] px-4 uppercase tracking-[0.2em] text-[var(--muted-foreground)] font-bold">
                  Or
                </span>
              </div>
            </div>

            {/* Direct PDF URL Field */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                Direct PDF URL / Document Link
              </label>
              <input
                type="url"
                value={directUrl}
                onChange={(e) => {
                  setDirectUrl(e.target.value);
                  if (e.target.value) {
                    setFile(null); // Clear selected file if pasting URL
                    const fileInput = document.getElementById('pdf-file-input') as HTMLInputElement;
                    if (fileInput) fileInput.value = '';
                  }
                }}
                placeholder="https://example.com/study-guide.pdf"
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 outline-none transition focus:ring-2 focus:ring-[var(--foreground)] text-sm"
              />
            </div>

            {/* Progress Bar */}
            {uploadProgress !== null && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span>Uploading File</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[var(--border)] overflow-hidden">
                  <div
                    className="h-full bg-[var(--primary)] transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Buttons (Save and Reset) */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving || (!file && !directUrl.trim())}
                className="flex-1 rounded-2xl bg-[var(--foreground)] px-4 py-3.5 font-bold text-[var(--background)] transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                <FiUpload className="h-4 w-4" />
                {saving && uploadProgress !== null ? 'Uploading...' : 'Save Document'}
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={saving}
                className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-5 py-3.5 font-bold transition hover:bg-[var(--muted)] text-sm flex items-center gap-2"
              >
                <FiRotateCcw className="h-4 w-4" />
                Reset
              </button>
            </div>
          </form>
        </section>

        {/* Current State / Library Card */}
        <section className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl shadow-black/5 flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-black">Associated Material</h3>
              <p className="text-xs text-[var(--muted-foreground)]">Status of the currently selected topic</p>
            </div>

            {currentTopic ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4 space-y-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                      {category}
                    </span>
                    <h4 className="font-bold text-base mt-0.5">{currentTopic.title}</h4>
                    <p className="text-xs font-mono text-[var(--muted-foreground)]">{currentTopic.id}</p>
                  </div>
                  
                  <div className="text-sm text-[var(--muted-foreground)] line-clamp-3">
                    {currentTopic.description || 'No description added for this topic yet.'}
                  </div>
                </div>

                {currentTopic.pdfUrl ? (
                  <div className="rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                        <FiFileText className="h-5 w-5" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="truncate text-sm font-bold text-[var(--foreground)]">
                          {currentTopic.pdfName || 'Linked PDF Guide'}
                        </p>
                        <p className="text-[10px] text-[var(--muted-foreground)]">Active in study guide</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <a
                        href={currentTopic.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)]"
                        title="View Document"
                      >
                        <FiExternalLink className="h-4 w-4" />
                      </a>
                      <button
                        onClick={handleDeletePdf}
                        disabled={saving}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                        title="Remove Document"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-center text-sm text-[var(--muted-foreground)]">
                    No PDF document linked to this topic yet. Upload a PDF guide using the linker form.
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-[var(--muted-foreground)] text-center py-8">
                Please select a category and topic to check status.
              </div>
            )}
          </div>

          <div className="mt-8 border-t border-[var(--border)] pt-5 text-xs text-[var(--muted-foreground)] leading-relaxed">
            <p><strong>Note:</strong> Replacing a document is as simple as selecting the topic and uploading a new PDF. It will automatically overwrite the previous document link.</p>
          </div>
        </section>

      </div>
    </div>
  );
};
