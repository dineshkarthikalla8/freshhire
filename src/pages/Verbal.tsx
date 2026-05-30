import { ModuleHero } from '../components/ui/ModuleHero';
import { TopicGridCard } from '../components/ui/TopicGridCard';
import { useStudyContent } from '../context/StudyContentContext';

export const Verbal = () => {
  const { verbalTopics } = useStudyContent();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <ModuleHero
        eyebrow="Verbal"
        title="Grammar, RC & vocabulary"
        description="Formal verbal practice with exam-ready notes, examples, and tips for placement rounds."
        stats={[
          { label: 'Topics', value: String(verbalTopics.length) },
          { label: 'Examples', value: '100+' },
          { label: 'Tips', value: 'Per topic' },
          { label: 'Format', value: 'Lessons' },
        ]}
      />
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
        {verbalTopics.map((topic, index) => (
          <TopicGridCard
            key={topic.id}
            index={index}
            title={topic.title}
            description={topic.description}
            focus={topic.focus}
            href={`/study/${topic.id}`}
            meta={`${topic.examples.length} examples`}
          />
        ))}
      </div>
    </div>
  );
};

export default Verbal;
