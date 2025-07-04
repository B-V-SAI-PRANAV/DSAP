// File: src/components/Calendar/CalendarHeatmap.tsx
import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap'; // Ensure this is the correct import

interface CalendarHeatmapProps {
  data: Record<string, number>;
  colors?: string[]; // Optional colors prop
}

const MyCalendarHeatmap: React.FC<CalendarHeatmapProps> = ({ data, colors }) => {
  const heatmapData = Object.entries(data).map(([date, count]) => ({
    date,
    count,
  }));

  return (
    <CalendarHeatmap
      startDate={new Date('2023-01-01')}
      endDate={new Date()}
      values={heatmapData}
      classForValue={(value: { date: string; count: number } | null) => {
        if (!value) {
          return 'color-empty';
        }
        return `color-github-${value.count}`;
      }}
      tooltipDataAttrs={(value: { date: string; count: number } | null) => {
        return {
          'data-tip': `${value?.date}: ${value?.count} activities`,
        };
      }}
      colors={colors} // Pass the colors prop to the CalendarHeatmap
    />
  );
};

export default MyCalendarHeatmap;
