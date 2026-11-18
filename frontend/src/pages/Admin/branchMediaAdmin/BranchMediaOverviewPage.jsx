import { AdminLayout } from '../AdminLayout';
import { useAuth } from '../../../auth/useAuth';
import './BranchMediaOverviewPage.css';

export function BranchMediaOverviewPage() {
  const { admin } = useAuth();
  const branchName = admin?.branch?.name ?? 'your assigned branch';
  return (
    <AdminLayout
      workspace='branch-media-admin'
      pageTitle='Overview'
      showWelcomeBanner
    >
      <section
        className='branch-media-overview-page'
        aria-labelledby='branch-media-overview-title'
      >
        <header className='branch-media-overview-heading'>
          <h1 id='branch-media-overview-title'>Overview</h1>
          <p>Welcome to the {branchName} branch media workspace.</p>
        </header>
      </section>
    </AdminLayout>
  );
}
