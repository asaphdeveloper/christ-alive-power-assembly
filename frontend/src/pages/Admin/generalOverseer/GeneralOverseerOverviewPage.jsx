import { ArrowRight, Clapperboard, ClipboardCheck, ClipboardList } from 'lucide-react';
import { Link } from 'react-router';
import { AdminLayout } from '../AdminLayout';
import './GeneralOverseerOverviewPage.css';

const overviewLinks = [
  { title: 'Attendance overview', description: 'Review attendance totals and service trends across all branches.', to: '/admin/attendance-overview', label: 'View attendance overview', icon: ClipboardCheck },
  { title: 'Attendance reports', description: 'Review attendance reports submitted by each branch.', to: '/admin/attendance-reports', label: 'View attendance reports', icon: ClipboardList },
  { title: 'Upload resources', description: 'Manage church documents and Sunday hymn lyrics.', to: '/admin/upload-resource', label: 'Upload resources', icon: Clapperboard },
];

export function GeneralOverseerOverviewPage() {
  return (
    <AdminLayout
      workspace='general-overseer'
      pageTitle='Overview'
      showWelcomeBanner
    >
      <section className='go-overview-page' aria-labelledby='general-overseer-label'>
        <header>
          <p id='general-overseer-label'>GENERAL OVERSEER</p>
        </header>
        <div className='go-overview-links'>
          {overviewLinks.map(({ title, description, to, label, icon: Icon }) => (
            <article className='go-overview-card' key={title}>
              <span className='go-overview-icon'><Icon size={19} aria-hidden='true' /></span>
              <div className='go-overview-copy'><h2>{title}</h2><p>{description}</p></div>
              <Link to={to} aria-label={label}><ArrowRight size={16} aria-hidden='true' /></Link>
            </article>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}
