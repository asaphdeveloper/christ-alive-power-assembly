import { AdminLayout } from '../AdminLayout';
import './BranchFinanceSecretaryPage.css';

export function BranchFinanceSecretaryPage() {
  return (
    <AdminLayout workspace='branch-finance-secretary' pageTitle='Overview'>
      <section className='branch-finance-secretary-page' aria-labelledby='branch-finance-secretary-title'>
        <header className='branch-finance-secretary-heading'>
          <p>BRANCH WORKSPACE</p>
          <h1 id='branch-finance-secretary-title'>Branch Finance Secretary</h1>
        </header>
      </section>
    </AdminLayout>
  );
}
