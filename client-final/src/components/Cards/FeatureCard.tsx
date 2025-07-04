import React from 'react';

interface FeatureCardProps {
  number: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ number, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="bg-blue-100 text-blue-600 rounded-full w-10 h-10 flex items-center justify-center font-bold">
          {number}
        </div>
        <div>
          <h3 className="font-bold text-lg mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
