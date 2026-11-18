import { ClipboardCheck } from 'lucide-react';

const comparisonColors = [
  '#426ff5',
  '#5767f5',
  '#8694f5',
  '#25a88a',
  '#edaa50',
];

export function BranchComparisonCard({
  branchComparison,
  getExpressionLabel,
  groupLabel,
  service,
}) {
  const total = branchComparison.reduce((sum, item) => sum + item.total, 0);
  const colors = branchComparison.map(
    (_, index) => comparisonColors[index % comparisonColors.length],
  );
  const segmentWeights = branchComparison.map((item) => item.total || 0.01);

  return (
    <section
      className='go-attendance-chart-card go-branch-comparison'
      aria-labelledby='go-branch-comparison-title'
    >
      <header>
        <div>
          <span>
            <ClipboardCheck size={16} aria-hidden='true' />
            EXPRESSION COMPARISON
          </span>
          <h2 id='go-branch-comparison-title'>Expression comparison</h2>
          <p>
            {groupLabel} · {service} service
          </p>
        </div>
      </header>
      <div className='go-comparison-summary'>
        <strong>{total.toLocaleString()}</strong>
        <span>
          {groupLabel} across {branchComparison.length} expressions
        </span>
      </div>
      <div className='go-comparison-bar'>
        {branchComparison.map(
          ({ branch: branchName, total: branchTotal }, index) => (
            <div
              className='go-comparison-segment-wrap'
              key={branchName}
              style={{
                flex: `${segmentWeights[index]} 1 0%`,
              }}
            >
              <span className='go-comparison-percent'>
                {total ? Math.round((branchTotal / total) * 100) : 0}%
              </span>
              <span
                className='go-comparison-segment'
                style={{ backgroundColor: colors[index] }}
                title={`${getExpressionLabel(branchName)}: ${branchTotal.toLocaleString()}`}
              />
            </div>
          ),
        )}
      </div>
      <ul
        className='go-comparison-legend'
        aria-label={`${groupLabel} by expression`}
      >
        {branchComparison.map(
          ({ branch: branchName }, index) => (
            <li
              key={branchName}
              style={{
                flexGrow: segmentWeights[index],
                '--comparison-color': colors[index],
              }}
            >
              <span className='go-comparison-legend-name'>
                {getExpressionLabel(branchName)}
              </span>
            </li>
          ),
        )}
      </ul>
    </section>
  );
}
