import { useState } from 'react';
import { CalendarDays, UserRoundPlus, Users } from 'lucide-react';
import { AdminLayout } from '../AdminLayout';
import './VisitorsPage.css';

function getToday() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 10);
}

export function VisitorsPage() {
  const [visitors, setVisitors] = useState([]);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [visitDate, setVisitDate] = useState(getToday);

  function addVisitor(event) {
    event.preventDefault();
    setVisitors((current) => [
      { id: `${Date.now()}-${name}`, name: name.trim(), contact: contact.trim(), date: visitDate },
      ...current,
    ]);
    setName('');
    setContact('');
  }

  return (
    <AdminLayout workspace='branch-media-admin' pageTitle='Visitors'>
      <section className='branch-visitors-page' aria-labelledby='branch-visitors-title'>
        <header className='branch-visitors-heading'>
          <p>BRANCH MEDIA ADMIN</p>
          <h1 id='branch-visitors-title'>Visitors</h1>
          <span>Record and review visitors to your branch.</span>
        </header>

        <div className='branch-visitors-layout'>
          <form className='branch-visitors-form' onSubmit={addVisitor}>
            <div className='branch-visitors-card-heading'>
              <span><UserRoundPlus size={18} aria-hidden='true' /></span>
              <div>
                <h2>Record a visitor</h2>
                <p>Add a visitor to the branch log.</p>
              </div>
            </div>
            <label>
              <span>Visitor name</span>
              <input value={name} onChange={(event) => setName(event.target.value)} required />
            </label>
            <label>
              <span>Contact (optional)</span>
              <input value={contact} onChange={(event) => setContact(event.target.value)} />
            </label>
            <label>
              <span>Visit date</span>
              <input type='date' value={visitDate} max={getToday()} onChange={(event) => setVisitDate(event.target.value)} required />
            </label>
            <button type='submit'><UserRoundPlus size={16} aria-hidden='true' /> Add visitor</button>
          </form>

          <section className='branch-visitors-list' aria-labelledby='branch-visitors-list-title'>
            <header className='branch-visitors-card-heading'>
              <span><Users size={18} aria-hidden='true' /></span>
              <div>
                <h2 id='branch-visitors-list-title'>Visitor log</h2>
                <p>{visitors.length} visitor{visitors.length === 1 ? '' : 's'} recorded in this session.</p>
              </div>
            </header>
            {visitors.length ? (
              <ul>
                {visitors.map((visitor) => (
                  <li key={visitor.id}>
                    <span className='branch-visitors-avatar' aria-hidden='true'>{visitor.name.charAt(0).toUpperCase()}</span>
                    <div><strong>{visitor.name}</strong><span>{visitor.contact || 'No contact provided'}</span></div>
                    <time dateTime={visitor.date}><CalendarDays size={14} aria-hidden='true' />{visitor.date}</time>
                  </li>
                ))}
              </ul>
            ) : (
              <div className='branch-visitors-empty'>
                <Users size={24} aria-hidden='true' />
                <strong>No visitors recorded yet</strong>
                <span>Visitors you add will appear here.</span>
              </div>
            )}
          </section>
        </div>
      </section>
    </AdminLayout>
  );
}
