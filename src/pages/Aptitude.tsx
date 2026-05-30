import { ModuleHero } from '../components/ui/ModuleHero';
import { TopicGridCard } from '../components/ui/TopicGridCard';
import { useStudyContent } from '../context/StudyContentContext';

export const Aptitude = () => {
  const { aptitudeTopics } = useStudyContent();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <ModuleHero
        eyebrow="Aptitude"
        title="Quantitative & logical mastery"
        description="Arithmetic, algebra, probability, geometry, and data interpretation — structured for placement exams."
        stats={[
          { label: 'Topics', value: String(aptitudeTopics.length) },
          { label: 'Focus areas', value: '50+' },
          { label: 'Difficulty', value: 'Mixed' },
          { label: 'Format', value: 'Notes' },
        ]}
      />
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
        {aptitudeTopics.map((topic, index) => (
          <TopicGridCard
            key={topic.id}
            index={index}
            title={topic.title}
            description={topic.description}
            focus={topic.focus}
            href={`/study/${topic.id}`}
            meta="Study notes + formulas"
          />
        ))}
      </div>
    </div>
  );
};

export default Aptitude;
