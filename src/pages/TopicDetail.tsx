import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import { useStudyContent } from '../context/StudyContentContext';
import PdfViewer from '../components/PdfViewer';

const TopicDetail = () => {
  const { topicId } = useParams();
  const { getTopicById } = useStudyContent();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    setSelectedAnswer(null);
  }, [topicId]);

  if (!topicId) return <Navigate to="/aptitude" replace />;

  const topic = getTopicById(topicId);
  if (!topic) return <Navigate to="/aptitude" replace />;

  const formulas = topic.formulas || [];
  const tips = topic.tips || [];
  const quiz = topic.quiz;

  return (
    <PageShell eyebrow="Study Topic" title={topic.title} description={topic.description || 'Study notes and quick formulas.'}>
      <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
        {/* Topic Description Box */}
        {topic.description && (
          <div className="md:col-span-2 rounded-[1.25rem] border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-5 text-[13px] leading-relaxed text-[var(--muted-foreground)] font-medium shadow-sm flex gap-3.5 items-start">
            <span className="text-xl leading-none mt-0.5 select-none text-[var(--primary)] font-bold">ℹ</span>
            <div>
              <span className="font-bold text-[var(--foreground)] block mb-1 text-sm uppercase tracking-wide">Topic Overview</span>
              {topic.description}
            </div>
          </div>
        )}

        {/* Topic Info Card (Focus areas, Examples & Source) */}
        {((topic.focus && topic.focus.length > 0) || (topic.examples && topic.examples.length > 0) || topic.source) && (
          <div className="md:col-span-2 rounded-[1.25rem] border border-[var(--border)] bg-[var(--card)]/60 p-6 space-y-6 shadow-sm backdrop-blur-sm">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Focus Areas */}
              {topic.focus && topic.focus.length > 0 && (
                <div>
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--primary)] mb-3 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                    Focus Areas
                  </h4>
                  <ul className="space-y-2 text-sm text-[var(--foreground)]">
                    {topic.focus.map((item, i) => (
                      <li key={i} className="flex gap-2 items-center">
                        <span className="text-[var(--primary)] font-bold text-xs select-none">✓</span>
                        <span className="font-semibold text-[var(--muted-foreground)]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Examples */}
              {topic.examples && topic.examples.length > 0 && (
                <div>
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--primary)] mb-3 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                    Examples
                  </h4>
                  <ul className="space-y-2 text-sm text-[var(--foreground)]">
                    {topic.examples.map((item, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <span className="text-[var(--muted-foreground)] font-bold text-xs select-none mt-0.5">•</span>
                        <span className="font-semibold text-[var(--muted-foreground)]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Source Link */}
            {topic.source && (
              <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between gap-4 flex-wrap text-xs text-[var(--muted-foreground)]">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[var(--foreground)]">Source Reference:</span>
                  <a
                    href={topic.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-[var(--primary)] hover:underline hover:text-[var(--primary-600)] transition"
                  >
                    {topic.source}
                  </a>
                </div>
                <a
                  href={topic.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 font-bold text-[10px] uppercase tracking-[0.1em] text-[var(--primary)] hover:border-[var(--primary)] transition-colors"
                >
                  Visit Reference Source
                </a>
              </div>
            )}
          </div>
        )}

        {/* Formulas Card */}
        <div className="rounded-[1rem] border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="text-xs font-black uppercase tracking-[0.3em] text-[var(--muted-foreground)]">Formulas</div>
          {formulas.length > 0 ? (
            <ul className="mt-4 space-y-4 text-sm text-[var(--foreground)]">
              {formulas.map((f, i) => (
                <li key={i} className="flex flex-col gap-1.5 items-start">
                  <div className="flex gap-2 items-start">
                    <span className="text-[var(--primary)] font-bold text-xs select-none mt-0.5">•</span>
                    <span className="font-semibold leading-relaxed">{f.text}</span>
                  </div>
                  {f.description && (
                    <div className="ml-4 rounded-lg border border-[var(--border)] bg-[var(--muted)]/40 px-3 py-1.5 text-xs text-[var(--muted-foreground)] max-w-full leading-relaxed shadow-sm font-medium">
                      {f.description}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-xs text-[var(--muted-foreground)] italic">No formulas available for this topic.</p>
          )}
        </div>

        {/* Tips & Tricks Card */}
        <div className="rounded-[1rem] border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="text-xs font-black uppercase tracking-[0.3em] text-[var(--muted-foreground)]">Tips & Tricks</div>
          {tips.length > 0 ? (
            <ul className="mt-4 space-y-4 text-sm text-[var(--foreground)]">
              {tips.map((t, i) => (
                <li key={i} className="flex flex-col gap-1.5 items-start">
                  <div className="flex gap-2 items-start">
                    <span className="text-[var(--primary)] font-bold text-xs select-none mt-0.5">•</span>
                    <span className="font-semibold leading-relaxed">{t.text}</span>
                  </div>
                  {t.description && (
                    <div className="ml-4 rounded-lg border border-[var(--border)] bg-[var(--muted)]/40 px-3 py-1.5 text-xs text-[var(--muted-foreground)] max-w-full leading-relaxed shadow-sm font-medium">
                      {t.description}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-xs text-[var(--muted-foreground)] italic">No tips available for this topic.</p>
          )}
        </div>

        {quiz && quiz.question ? (
          <div className="md:col-span-2 rounded-[1rem] border border-[var(--border)] bg-[var(--card)] p-6">
            <div className="text-xs font-black uppercase tracking-[0.3em] text-[var(--muted-foreground)]">Quiz</div>
            <h2 className="mt-3 text-xl font-bold">{quiz.question}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {quiz.options.map((option, index) => {
                const trimmedOption = option.trim();
                const isAnswered = selectedAnswer !== null;
                const isCorrect = trimmedOption === quiz.answer.trim();
                const isSelected = trimmedOption === selectedAnswer;

                let btnClass = "w-full text-left rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 ";

                if (!isAnswered) {
                  btnClass += "border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)] hover:bg-[var(--card)] cursor-pointer";
                } else {
                  btnClass += "cursor-default ";
                  if (isCorrect) {
                    btnClass += "border-green-500 bg-green-500/10 text-green-400";
                  } else if (isSelected) {
                    btnClass += "border-red-500 bg-red-500/10 text-red-400";
                  } else {
                    btnClass += "border-[var(--border)] bg-[var(--background)] opacity-50";
                  }
                }

                return (
                  <button
                    key={index}
                    disabled={isAnswered}
                    onClick={() => setSelectedAnswer(trimmedOption)}
                    className={btnClass}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {selectedAnswer !== null && (
              <div className="mt-6 pt-4 border-t border-[var(--border)] animate-fade-up">
                <div className="flex items-center gap-2 mb-3">
                  {selectedAnswer === quiz.answer.trim() ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/25">
                      ✓ Correct Answer
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/25">
                      ✗ Incorrect
                    </span>
                  )}
                </div>
                <p className="text-sm text-[var(--muted-foreground)]">
                  <span className="font-semibold text-[var(--foreground)]">Answer:</span> {quiz.answer}
                </p>
                {quiz.explanation ? (
                  <p className="mt-2 text-sm text-[var(--muted-foreground)] leading-relaxed">{quiz.explanation}</p>
                ) : null}
              </div>
            )}
          </div>
        ) : null}

        {topic.pdfUrl ? (
          <div className="md:col-span-2 mt-4">
            <div className="text-xs font-black uppercase tracking-[0.3em] text-[var(--muted-foreground)] mb-4">Study Documents</div>
            <PdfViewer url={topic.pdfUrl} title={topic.pdfName || `${topic.title} PDF`} />
          </div>
        ) : null}
      </div>
    </PageShell>
  );
};

export default TopicDetail;
