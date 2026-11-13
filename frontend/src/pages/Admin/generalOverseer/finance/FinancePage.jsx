import { AdminLayout } from '../../AdminLayout';
import '../GeneralOverseerPage.css';

export function GeneralOverseerFinancePage() {
  return (
    <AdminLayout workspace='general-overseer' pageTitle='Finance'>
      <section className='general-overseer-page' aria-labelledby='general-overseer-finance-title'>
        <header className='general-overseer-heading'>
          <h1 id='general-overseer-finance-title'>Finance overview</h1>
          <p>Review financial activity and reports across all expressions.</p>
        </header>
        <article className='general-overseer-card'>
          <h2>Finance reports</h2>
          <p>Branch financial summaries will appear here.</p>
        </article>
      </section>
    </AdminLayout>
  );
}
