import { ModuleHero } from '../components/ui/ModuleHero';
import { TopicGridCard } from '../components/ui/TopicGridCard';
import { useStudyContent } from '../context/StudyContentContext';

export const Reasoning = () => {
  const { reasoningTopics } = useStudyContent();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <ModuleHero
        eyebrow="Reasoning"
        title="Logical reasoning drills"
        description="Patterns, puzzles, arrangements, and decision-based questions built for fast interview prep."
        stats={[
          { label: 'Topics', value: String(reasoningTopics.length) },
          { label: 'Patterns', value: '30+' },
          { label: 'Level', value: 'Core' },
          { label: 'Mode', value: 'Practice' },
        ]}
      />
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
        {reasoningTopics.map((topic, index) => (
          <TopicGridCard
            key={topic.id}
            index={index}
            title={topic.title}
            description={topic.description}
            focus={topic.focus}
            href={`/study/${topic.id}`}
            meta="Logic & puzzles"
          />
        ))}
      </div>
    </div>
  );
};

export default Reasoning;
