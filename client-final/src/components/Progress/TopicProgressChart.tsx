import React from 'react';
import { Bar } from 'react-chartjs-2';

interface TopicProgressChartProps {
  topics: Array<{ name: string; progress: number }>;
}

const TopicProgressChart: React.FC<TopicProgressChartProps> = ({ topics }) => {
  const data = {
    labels: topics.map(topic => topic.name),
    datasets: [
      {
        label: 'Progress',
        data: topics.map(topic => topic.progress),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <div>
      <Bar
        data={data}
        options={{
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
            },
          },
        }}
      />
    </div>
  );
};

export default TopicProgressChart;
