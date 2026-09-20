import { SectionHeading } from './SectionHeading';
import { Link } from 'react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon, Notification01Icon } from '@hugeicons/core-free-icons';
import Image1 from '../../../assets/images/slide-02.jpg';
import Image2 from '../../../assets/images/slide-01.jpg';
import Image3 from '../../../assets/images/slide-03.jpg';
import './UpcomingSection.css';

export const Upcoming = () => {
  return (
    <section className="upcoming-section" id="upcoming-section" aria-labelledby="upcoming-title">
      <div className="upcoming-header">
        <SectionHeading icon={Notification01Icon} label="Coming Soon" titleId="upcoming-title">
          <span>Upcoming</span> Programs
        </SectionHeading>
        <div className="upcoming-more">
          <Link to="/">
            View all events
            <HugeiconsIcon icon={ArrowRight01Icon} size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="upcoming-cards">
        <article className="upcoming-card">
          <img className="upcoming-card-photo" src={Image1}
            alt="Christ Alive Power Assembly church gathering"
            loading="lazy" width="1920" height="1280" />
          <div className="upcoming-card-details">
            <h3>Annual Prayer &amp; Fasting</h3>
            <dl className="upcoming-card-schedule">
              <div><dt>Date</dt><dd>Date to be announced</dd></div>
              <div><dt>Time</dt><dd>TBA</dd></div>
            </dl>
          </div>
          <p className="upcoming-card-description">
            A sacred day of corporate prayer and fasting as we seek God's face together as a congregation.
            Come with an open heart — leave transformed.
          </p>
        </article>

        <article className="upcoming-card">
          <img className="upcoming-card-photo" src={Image2}
            alt="Christ Alive Power Assembly church gathering"
            loading="lazy" width="1920" height="1280" />
          <div className="upcoming-card-details">
            <h3>Grace &amp; Glory Convention</h3>
            <dl className="upcoming-card-schedule">
              <div><dt>Date</dt><dd>Date to be announced</dd></div>
              <div><dt>Time</dt><dd>TBA</dd></div>
            </dl>
          </div>
          <p className="upcoming-card-description">
            Three days of Spirit-led worship, powerful teaching, and rich fellowship with believers
            from across the region. One of the highlights of our church year.
          </p>
        </article>

        <article className="upcoming-card">
          <img className="upcoming-card-photo" src={Image3}
            alt="Christ Alive Power Assembly church gathering"
            loading="lazy" width="1920" height="1280" />
          <div className="upcoming-card-details">
            <h3>Women&apos;s Day Celebration</h3>
            <dl className="upcoming-card-schedule">
              <div><dt>Date</dt><dd>Date to be announced</dd></div>
              <div><dt>Time</dt><dd>TBA</dd></div>
            </dl>
          </div>
          <p className="upcoming-card-description">A joyful, spirit-filled day honouring the women of our congregation — through worship, inspiring messages, and meaningful fellowship.</p>
        </article>
      </div>

    </section>
  );
};

export default Upcoming;
