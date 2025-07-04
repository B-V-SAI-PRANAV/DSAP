// FileName: MultipleFiles/ConceptCard.tsx
import React from 'react';
import { Concept } from '../../types'; // Import Concept from consolidated types

interface ConceptCardProps {
  concept: Concept;
}

const ConceptCard: React.FC<ConceptCardProps> = ({ concept }) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-lg">{concept.name}</h3>
      <p className="text-gray-600 text-sm">{concept.description}</p>
      <div className="mt-2">
        {concept.resources.map((resource) => (
          <a key={resource.url} href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block text-sm">
            {resource.title}
          </a>
        ))}
      </div>
    </div>
  );
};

export default ConceptCard;
