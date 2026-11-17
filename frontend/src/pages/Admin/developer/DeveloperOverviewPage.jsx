import { ArrowRight, MapPinned, Users } from 'lucide-react';
import { Link } from 'react-router';
import './DeveloperOverviewPage.css';

const overviewLinks = [
  {
    title: 'Administrators',
    description: 'Manage administrator accounts and workspace assignments.',
    to: '/admin/all-admins',
    icon: Users,
  },
  {
    title: 'Branches',
    description: 'Review church locations and their assigned administrators.',
    to: '/admin/branches',
    icon: MapPinned,
  },
];

export function DeveloperOverviewPage() {
  return (
    <section className='developer-overview-page' aria-label='Developer workspace overview'>
      <header>
        <p>ADMINISTRATION</p>
      </header>
      <div className='developer-overview-links'>
        {overviewLinks.map(({ title, description, to, icon: Icon }) => (
          <article key={title}>
            <span className='developer-overview-icon'><Icon size={19} aria-hidden='true' /></span>
            <div><h2>{title}</h2><p>{description}</p></div>
            <Link to={to} aria-label={`Open ${title}`}><ArrowRight size={16} aria-hidden='true' /></Link>
          </article>
        ))}
      </div>
    </section>
  );
}
