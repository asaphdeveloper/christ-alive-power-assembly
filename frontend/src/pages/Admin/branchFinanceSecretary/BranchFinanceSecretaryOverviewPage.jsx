import { Landmark, MapPin } from 'lucide-react';
import { AdminLayout } from '../AdminLayout';
import './BranchFinanceSecretaryOverviewPage.css';

export function BranchFinanceSecretaryOverviewPage() {
  return (
    <AdminLayout
      workspace='branch-finance-secretary'
      pageTitle='Overview'
    >
      <section
        className='branch-finance-overview-page'
        aria-labelledby='branch-finance-overview-title'
      >
        <header className='branch-finance-overview-heading'>
          <p>BRANCH FINANCE WORKSPACE</p>
          <h1 id='branch-finance-overview-title'>Branch Finance Secretary</h1>
          <span>Manage and review financial activity for your branch.</span>
        </header>
        <div className='branch-finance-overview-facts'>
          <article>
            <span><MapPin size={19} aria-hidden='true' /></span>
            <div><h2>Assigned branch</h2><p>Bauchi Branch</p></div>
          </article>
          <article>
            <span><Landmark size={19} aria-hidden='true' /></span>
            <div><h2>Workspace</h2><p>Branch finance administration</p></div>
          </article>
        </div>
      </section>
    </AdminLayout>
  );
}
