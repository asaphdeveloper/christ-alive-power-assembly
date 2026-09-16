import { useEffect } from 'react';
import { Link } from 'react-router';
import { Footer } from '../../components/Footer';
import { events } from './events';
import './EventsPage.css';

export const EventsPage = () => {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  return (
    <>
      <title>Programs & Events | Christ Alive Power Assembly</title>
      <main className="events-page">
        <Link className="events-back" to="/">← Back to home</Link>
        <div className="events-page-intro">
          <p>Christ Alive Power Assembly</p>
          <h1>Programs &amp; <span>Events</span></h1>
          <p>Explore our church gatherings, program schedules, and who can attend.</p>
        </div>
        <div className="events-page-list">
          {events.map((event) => (
            <article className="events-page-item" key={event.id}>
              <img src={event.image} alt="Christ Alive Power Assembly gathering" loading="lazy" />
              <div>
                <p className="events-page-category">{event.category}</p>
                <h2>{event.title}</h2>
                <p className="events-page-description">{event.description}</p>
                <dl>
                  <div><dt>Date</dt><dd>{event.date}</dd></div>
                  <div><dt>Time</dt><dd>{event.time}</dd></div>
                  {event.tag && <div><dt>Who can attend</dt><dd>{event.tag}</dd></div>}
                </dl>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
};
