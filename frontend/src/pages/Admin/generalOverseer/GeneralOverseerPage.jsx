import { ArrowRight, MapPinned, Users } from 'lucide-react';
import { Link } from 'react-router';
import { AdminLayout } from '../AdminLayout';
import './GeneralOverseerPage.css';

const overviewLinks = [
  {
    title: 'Administrators',
    description: 'Review the administrators assigned to each branch.',
    to: '/admin/developer/admins',
    label: 'View administrators',
    icon: Users,
  },
  {
    title: 'Branches',
    description: 'View branch locations and their assigned administrators.',
    to: '/admin/developer/branches',
    label: 'View branches',
    icon: MapPinned,
  },
];

export function GeneralOverseerPage() {
  return (
    <AdminLayout workspace='general-overseer' pageTitle='Overview'>
      <section className='general-overseer-page' aria-labelledby='general-overseer-title'>
        <header className='general-overseer-heading'>
          <p className='general-overseer-kicker'>GENERAL OVERSEER WORKSPACE</p>
          <h1 id='general-overseer-title'>Welcome, General Overseer</h1>
          <p>Use this workspace to review administrators and church branches.</p>
        </header>
        <div className='general-overseer-links'>
          {overviewLinks.map(({ title, description, to, label, icon: Icon }) => (
            <article className='general-overseer-card' key={title}>
              <span className='general-overseer-icon'><Icon size={20} aria-hidden='true' /></span>
              <h2>{title}</h2>
              <p>{description}</p>
              <Link to={to}>
                {label}
                <ArrowRight size={16} aria-hidden='true' />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
}
