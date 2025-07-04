// File: src/react-calendar-heatmap.d.ts
declare module 'react-calendar-heatmap' {
  import React from 'react';

  interface CalendarHeatmapValue {
    date: string;
    count: number;
  }

  interface CalendarHeatmapProps {
    startDate: Date;
    endDate: Date;
    values: CalendarHeatmapValue[];
    classForValue: (value: CalendarHeatmapValue | null) => string;
    tooltipDataAttrs: (value: CalendarHeatmapValue | null) => { 'data-tip': string };
    colors?: string[]; // Optional colors prop
  }

  const CalendarHeatmap: React.FC<CalendarHeatmapProps>;
  export default CalendarHeatmap; // Ensure default export
}
