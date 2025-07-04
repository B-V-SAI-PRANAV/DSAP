import React from 'react';

interface ProgressRadialProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

const ProgressRadial: React.FC<ProgressRadialProps> = ({ value, size = 100, strokeWidth = 10, label }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size}>
      <circle
        stroke="#e6e6e6"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        stroke="#4f46e5"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
      />
      {label && (
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="font-bold text-lg"
        >
          {label}
        </text>
      )}
    </svg>
  );
};

export default ProgressRadial;
