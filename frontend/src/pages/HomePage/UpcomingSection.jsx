import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon, Notification01Icon } from '@hugeicons/core-free-icons';
import PrayerImage from '../../assets/images/slide-02.jpg';
import ConventionImage from '../../assets/images/slide-01.jpg';
import CelebrationImage from '../../assets/images/slide-03.jpg';
import YouthImage from '../../assets/images/slide-04.jpg';
import './UpcomingSection.css';

const events = [
  {
    id: 1,
    image: PrayerImage,
    num: "01",
    title: "Annual Prayer & Fasting",
    date: "7th August, 2025",
    time: "6:00 AM – 6:00 PM",
    category: "Spiritual",
    tag: "All Members",
    description:
      "A sacred day of corporate prayer and fasting as we seek God's face together as a congregation. Come with an open heart — leave transformed.",
  },
  {
    id: 2,
    image: ConventionImage,
    num: "02",
    title: "Grace & Glory Convention",
    date: "14th August, 2025",
    time: "9:00 AM – 5:00 PM",
    category: "Convention",
    tag: "",
    description:
      "Three days of Spirit-led worship, powerful teaching, and rich fellowship with believers from across the region. One of the highlights of our church year.",
  },
  {
    id: 3,
    image: CelebrationImage,
    num: "03",
    title: "Women's Day Celebration",
    date: "Date to be announced",
    time: "TBA",
    category: "Celebration",
    tag: "Women Only",
    description:
      "A joyful, spirit-filled day honouring the women of our congregation — through worship, inspiring messages, and meaningful fellowship.",
  },
  {
    id: 4,
    image: YouthImage,
    num: "04",
    title: "Youth Summer Retreat",
    date: "Date to be announced",
    time: "TBA",
    category: "Youth",
    tag: "Ages 13–25",
    description:
      "A full weekend away for our young people — worship nights, mentorship, games, and encounters with the Word that will stay with them long after.",
  },
];

export const Upcoming = () => {
  const [showAll, setShowAll] = useState(false);
  const visibleEvents = showAll ? events : events.slice(0, 3);

  return (
    <section className="upcoming-section" id="upcoming-section" aria-labelledby="upcoming-title">
      <div className="upcoming-header">
      <div className="upcoming-intro">
        <span className="upcoming-label">
          <HugeiconsIcon icon={Notification01Icon} size={14} aria-hidden="true" />
          What's coming
        </span>
        <h2 id="upcoming-title">Come together.<br /><span>Grow in faith.</span></h2>
        <p>Upcoming events at Christ Alive Power Assembly.</p>
      </div>

      {events.length > 3 && <div className="upcoming-more">
        <button type="button" onClick={() => setShowAll((current) => !current)} aria-expanded={showAll}>
          {showAll ? 'Show fewer events' : 'View all events'}
          <HugeiconsIcon icon={ArrowRight01Icon} size={18} aria-hidden="true" />
        </button>
      </div>}
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
