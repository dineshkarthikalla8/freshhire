import { useParams, Navigate } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import { useStudyContent } from '../context/StudyContentContext';

const padList = (arr: string[] | undefined, label: string) => {
  const base = arr || [];
  const out = [...base];
  for (let i = out.length; i < 20; i++) out.push(`${label} ${i + 1}`);
  return out.slice(0, 20);
};

const TopicDetail = () => {
  const { topicId } = useParams();
  const { getTopicById } = useStudyContent();
  if (!topicId) return <Navigate to="/aptitude" replace />;

  const topic = getTopicById(topicId);
  if (!topic) return <Navigate to="/aptitude" replace />;

  const formulas = padList((topic as any).formulas, 'Formula');
  const tips = padList((topic as any).tips, 'Tip');

  return (
    <PageShell eyebrow="Study Topic" title={topic.title} description={topic.description || 'Study notes and quick formulas.'}>
      <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
        <div className="rounded-[1rem] border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="text-xs font-black uppercase tracking-[0.3em] text-[var(--muted-foreground)]">Formulas (20)</div>
          <ol className="mt-4 space-y-3 list-decimal list-inside text-sm text-[var(--foreground)]">
            {formulas.map((f, i) => (
              <li key={i} className="flex gap-3 items-start">
                <div className="flex-1">
                  <div className="font-semibold">{f}</div>
                  <div className="text-[13px] text-[var(--muted-foreground)] mt-1">Short explanation or derivation goes here.</div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-[1rem] border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="text-xs font-black uppercase tracking-[0.3em] text-[var(--muted-foreground)]">Tips & Tricks (20)</div>
          <ol className="mt-4 space-y-3 list-decimal list-inside text-sm text-[var(--foreground)]">
            {tips.map((t, i) => (
              <li key={i} className="flex gap-3 items-start">
                <div className="flex-1">
                  <div className="font-semibold">{t}</div>
                  <div className="text-[13px] text-[var(--muted-foreground)] mt-1">How to apply this tip in exams.</div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {topic.quiz && topic.quiz.question ? (
          <div className="md:col-span-2 rounded-[1rem] border border-[var(--border)] bg-[var(--card)] p-6">
            <div className="text-xs font-black uppercase tracking-[0.3em] text-[var(--muted-foreground)]">Quiz</div>
            <h2 className="mt-3 text-xl font-bold">{topic.quiz.question}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {topic.quiz.options.map((option, index) => (
                <div key={index} className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-medium">
                  {option}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-[var(--muted-foreground)]">
              <span className="font-semibold text-[var(--foreground)]">Answer:</span> {topic.quiz.answer}
            </p>
            {topic.quiz.explanation ? (
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">{topic.quiz.explanation}</p>
            ) : null}
          </div>
        ) : null}
      </div>
    </PageShell>
  );
};

export default TopicDetail;
