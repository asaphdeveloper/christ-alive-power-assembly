import { ArrowRight, Clapperboard } from 'lucide-react';
import { Link } from 'react-router';
import { AdminLayout } from '../AdminLayout';
import './HeadquaterOverviewPage.css';

const overviewLinks = [
  {
    title: 'Upload resources',
    description: 'Manage church documents and Sunday hymn lyrics.',
    to: '/admin/upload-resource',
    icon: Clapperboard,
  },
];

export function HeadquaterOverviewPage() {
  return (
    <AdminLayout
      workspace='headquater-media-admin'
      pageTitle='Overview'
      showWelcomeBanner
    >
      <section
        className='headquater-overview-page'
        aria-labelledby='headquater-overview-label'
      >
        <header>
          <p id='headquater-overview-label'>HEADQUARTER MEDIA</p>
        </header>
        <div className='headquater-overview-links'>
          {overviewLinks.map(({ title, description, to, icon: Icon }) => (
            <article key={title}>
              <span>
                <Icon size={19} aria-hidden='true' />
              </span>
              <div>
                <h2>{title}</h2>
                <p>{description}</p>
              </div>
              <Link to={to} aria-label={`Open ${title}`}>
                <ArrowRight size={16} aria-hidden='true' />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}
