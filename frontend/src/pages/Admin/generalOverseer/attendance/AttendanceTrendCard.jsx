import { Line } from 'react-chartjs-2';
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { ChartNoAxesCombined } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
);

export function AttendanceTrendCard({
  filteredData,
  trendData,
  chartOptions,
  expressionLabel,
  groupLabel,
  service,
}) {
  return (
    <section
      className='go-attendance-chart-card'
      aria-labelledby='go-trend-title'
    >
      <header className='go-trend-heading'>
        <div>
          <span>
            <ChartNoAxesCombined size={16} aria-hidden='true' />
            ATTENDANCE TREND
          </span>
          <h2 id='go-trend-title'>{expressionLabel}</h2>
          <p>{groupLabel} · {service.toLowerCase()}</p>
        </div>
      </header>
      {filteredData.length ? (
        <div className='go-line-chart-wrap'>
          <Line data={trendData} options={chartOptions} />
        </div>
      ) : (
        <p className='go-chart-empty'>
          No attendance records match these filters.
        </p>
      )}
    </section>
  );
}
