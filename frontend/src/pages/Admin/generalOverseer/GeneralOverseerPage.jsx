import { ArrowRight, CircleDollarSign, ClipboardCheck, MapPinned, Users } from 'lucide-react';
import { Link } from 'react-router';
import { AdminLayout } from '../AdminLayout';
import './GeneralOverseerPage.css';

const overviewLinks = [
  { title: 'Attendance', description: 'Review attendance totals and service trends across all branches.', to: '/admin/general-overseer/attendance', label: 'View attendance', icon: ClipboardCheck },
  { title: 'Finance', description: 'Review financial reports and summaries across all branches.', to: '/admin/general-overseer/finance', label: 'View finance', icon: CircleDollarSign },
  { title: 'Administrators', description: 'Review the administrators assigned to each branch.', to: '/admin/developer/admins', label: 'View administrators', icon: Users },
  { title: 'Branches', description: 'View branch locations and their assigned administrators.', to: '/admin/developer/branches', label: 'View branches', icon: MapPinned },
];

export function GeneralOverseerPage() {
  return (
    <AdminLayout workspace='general-overseer' pageTitle='Overview'>
      <section className='go-overview-page' aria-labelledby='general-overseer-title'>
        <header className='go-overview-heading'>
          <h1 id='general-overseer-title'>Welcome, General Overseer</h1>
          <p>Use this workspace to review church attendance, administrators and branches.</p>
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
