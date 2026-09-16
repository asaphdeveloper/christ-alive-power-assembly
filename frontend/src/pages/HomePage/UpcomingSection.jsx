import { Link } from 'react-router';
import { events } from '../EventsPage/events';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon, Notification01Icon } from '@hugeicons/core-free-icons';
import './UpcomingSection.css';

export const Upcoming = () => {
  const visibleEvents = events.slice(0, 3);

  return (
    <section className="upcoming-section" id="upcoming-section" aria-labelledby="upcoming-title">
      <div className="upcoming-header">
        <div className="upcoming-intro">
          <span className="upcoming-label">
            <HugeiconsIcon icon={Notification01Icon} size={14} aria-hidden="true" />
            What's coming
          </span>
          <h2 id="upcoming-title"><span>Upcoming</span> Programs</h2>
        </div>

        <div className="upcoming-more">
          <Link to="/events">
            View all events
            <HugeiconsIcon icon={ArrowRight01Icon} size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="upcoming-cards">
        {visibleEvents.map((event) => (
          <article className="upcoming-card" key={event.id}>
            <img className="upcoming-card-photo" src={event.image} alt="Christ Alive Power Assembly church gathering" loading="lazy" width="1920" height="1280" />
            <details className="upcoming-card-details">
              <summary>
                <h3>{event.title}</h3>
                <HugeiconsIcon icon={ArrowRight01Icon} size={22} aria-hidden="true" />
              </summary>
              <dl className="upcoming-card-schedule">
                <div><dt>Date</dt><dd>{event.date}</dd></div>
                <div><dt>Time</dt><dd>{event.time}</dd></div>
                {event.tag && <div><dt>Who can attend</dt><dd>{event.tag}</dd></div>}
              </dl>
            </details>
            <p className="upcoming-card-description">{event.description}</p>
          </article>
        ))}
      </div>

    </section>
  );
};

export default Upcoming;
