// FileName: MultipleFiles/MasteryTopicCard.tsx
import React, { useState, useEffect } from 'react';
import { MasteryTopic } from '../../types'; // Import MasteryTopic from consolidated types
import { getTopicProblemProgress, getResourceCompletionStatus, getMasteryTopicDetails } from '../../services/api';

interface MasteryTopicCardProps {
  topic: MasteryTopic;
  onClick: (topicId: string) => void;
  progress?: number;
}

const MasteryTopicCard: React.FC<MasteryTopicCardProps> = ({ topic, onClick, progress = 0 }) => {
  const [problemProgress, setProblemProgress] = useState<{
    completedProblems: string[];
    totalProblems: number;
    progressPercentage: number;
  } | null>(null);
  const [cheatSheets, setCheatSheets] = useState(topic.cheatSheets || []);
  const [resourceProgress, setResourceProgress] = useState<{ completed: number; total: number }>({ completed: 0, total: topic.cheatSheets ? topic.cheatSheets.length : 0 });
  const [combinedProgress, setCombinedProgress] = useState<number>(progress);

  useEffect(() => {
    const getRealTopicId = (id: string) => id.replace(/^mastery_/, '');
    const loadProgress = async () => {
      // Always fetch latest cheatSheets for this topic
      try {
        const details = await getMasteryTopicDetails(topic.id);
        setCheatSheets(details.cheatSheets || []);
      } catch {}
      // Problems
      let probProg = null;
      try {
        probProg = await getTopicProblemProgress(getRealTopicId(topic.id));
        setProblemProgress(probProg);
      } catch (error) {
        console.error(`Failed to load problem progress for topic ${topic.id}:`, error);
      }
      // Cheat Sheets
      let completedResources = 0;
      const currentCheatSheets = cheatSheets.length > 0 ? cheatSheets : (topic.cheatSheets || []);
      if (currentCheatSheets.length > 0) {
        try {
          const results = await Promise.all(
            currentCheatSheets.map(r => getResourceCompletionStatus(r.id))
          );
          completedResources = results.filter(r => r.isCompleted).length;
        } catch (error) {
          console.error(`Failed to load resource progress for topic ${topic.id}:`, error);
        }
      }
      setResourceProgress({ completed: completedResources, total: currentCheatSheets.length });
      // Combined progress (problems + cheat sheets)
      let totalParts = 0;
      let progressSum = 0;
      if (probProg) {
        totalParts++;
        progressSum += (probProg.completedProblems.length / (probProg.totalProblems || 1));
      }
      if (currentCheatSheets.length > 0) {
        totalParts++;
        progressSum += (completedResources / currentCheatSheets.length);
      }
      setCombinedProgress(totalParts > 0 ? Math.round((progressSum / totalParts) * 100) : progress);
    };
    loadProgress();

    // Listen for global progress updates
    const handleProgressUpdate = () => {
      loadProgress();
    };
    window.addEventListener('user-progress-updated', handleProgressUpdate);
    return () => {
      window.removeEventListener('user-progress-updated', handleProgressUpdate);
    };
  }, [topic.id, progress]);

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => {
      onClick(topic.id);
    }}>
      <h3 className="font-semibold text-lg">{topic.name}</h3>
      <div className="mt-2">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${combinedProgress}%` }}
          ></div>
        </div>
        <span className="text-xs text-gray-600">
          {problemProgress ?
            `${problemProgress.completedProblems.length}/${problemProgress.totalProblems} problems completed` :
            `${progress}% problems completed`
          }
          {resourceProgress.total > 0 && (
            <>
              {" | "}
              {`${resourceProgress.completed}/${resourceProgress.total} cheat sheets completed`}
            </>
          )}
        </span>
      </div>
      <p className="text-gray-600 text-sm">{topic.description}</p>
      <div className="mt-2">
        <h4 className="font-medium text-sm">Essential Problems:</h4>
        <ul className="list-disc list-inside text-sm">
          {topic.essentialProblems.map((problem) => (
            <li key={problem.id} className="text-blue-600">
              {problem.title}
            </li>
          ))}
        </ul>
        <div className="mt-2 flex gap-4 text-xs text-gray-500">
          <span>Cheat Sheets: {cheatSheets.length}</span>
          <span>Videos: {topic.videoTutorials ? topic.videoTutorials.length : 0}</span>
        </div>
      </div>
    </div>
  );
};

export default MasteryTopicCard;
