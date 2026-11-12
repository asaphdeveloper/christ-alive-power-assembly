import { AdminLayout } from '../AdminLayout';
import './BranchMediaAdminPage.css';

export function BranchMediaAdminPage() {
  return (
    <AdminLayout workspace='branch-media-admin' pageTitle='Overview'>
      <section className='branch-media-admin-page' aria-labelledby='branch-media-admin-title'>
        <header className='branch-media-admin-heading'>
          <p>BRANCH WORKSPACE</p>
          <h1 id='branch-media-admin-title'>Branch Media Admin</h1>
        </header>
      </section>
    </AdminLayout>
  );
}
