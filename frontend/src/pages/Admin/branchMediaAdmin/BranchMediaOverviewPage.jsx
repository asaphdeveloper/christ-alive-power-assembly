import { AdminLayout } from '../AdminLayout';
import { useAuth } from '../../../auth/useAuth';
import { ArrowRight, ClipboardCheck } from 'lucide-react';
import { Link } from 'react-router';
import './BranchMediaOverviewPage.css';

const overviewLinks = [
  {
    title: 'Branch attendance',
    description: 'Record and review weekly service attendance for your branch.',
    to: '/admin/branch-media-admin/attendance',
    label: 'Manage branch attendance',
    icon: ClipboardCheck,
  },
];

export function BranchMediaOverviewPage() {
  useAuth();
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
          <p id='branch-media-overview-title'>BRANCH MEDIA ADMIN</p>
        </header>
        <div className='branch-media-overview-links'>
          {overviewLinks.map(({ title, description, to, label, icon: Icon }) => (
            <article className='branch-media-overview-card' key={title}>
              <span className='branch-media-overview-icon'>
                <Icon size={19} aria-hidden='true' />
              </span>
              <div className='branch-media-overview-copy'>
                <h2>{title}</h2>
                <p>{description}</p>
              </div>
              <Link to={to} aria-label={label}>
                <ArrowRight size={16} aria-hidden='true' />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}
