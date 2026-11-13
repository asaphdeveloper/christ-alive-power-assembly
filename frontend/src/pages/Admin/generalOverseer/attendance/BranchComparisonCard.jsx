import { UsersRound } from 'lucide-react';

export function BranchComparisonCard({
  branchComparison,
  getExpressionLabel,
  groupLabel,
  service,
}) {
  return (
    <section
      className='go-attendance-chart-card go-branch-comparison'
      aria-labelledby='go-branch-comparison-title'
    >
      <header>
        <div>
          <span>
            <UsersRound size={16} aria-hidden='true' />
            EXPRESSION COMPARISON
          </span>
          <h2 id='go-branch-comparison-title'>{groupLabel} by expression</h2>
          <p>{service} service</p>
        </div>
      </header>
      <div className='go-expression-cards'>
        {branchComparison.map(({ branch: branchName, total }) => (
          <article className='go-expression-card' key={branchName}>
            <span className='go-expression-card-name'>
              {getExpressionLabel(branchName)}
            </span>
            <strong>{total.toLocaleString()}</strong>
            <small>{groupLabel} · {service}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
