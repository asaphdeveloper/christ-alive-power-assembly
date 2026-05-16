import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Notification01Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";
import "./UpcomingSection.css";

const events = [
  {
    id: 1,
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

const EventRow = ({ event, index, isActive, onToggle }) => (
  <div
    className={`event-row ${isActive ? "event-row-active" : ""}`}
    style={{ "-i": index }}
    onClick={onToggle}
    role="button"
    tabIndex={0}
    aria-expanded={isActive}
    aria-label={event.title}
    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onToggle()}
  >
    <div className="event-row-fill" aria-hidden="true" />

    <div className="event-row-track">
      <div className="event-row-index" aria-hidden="true">
        <span className="event-row-num">{event.num}</span>
        <span className="event-row-connector" />
      </div>

      <div className="event-row-main">
        <div className="event-row-top-line">
          <span className="event-row-category">{event.category}</span>
          {event.tag && <span className="event-row-tag">{event.tag}</span>}
        </div>

        <h3 className="event-row-title">{event.title}</h3>

        <div className="event-row-detail">
          <div>
            <p className="event-row-desc">{event.description}</p>
            <div className="event-row-actions">
              <a
                href="#"
                className="event-row-cta"
                aria-label={`View details for ${event.title}`}
                onClick={(e) => e.stopPropagation()}
              >
                <span>View Details</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={13} strokeWidth={2.5} />
              </a>
              <button
                className="event-row-notify"
                aria-label={`Get notified about ${event.title}`}
                onClick={(e) => e.stopPropagation()}
              >
                <HugeiconsIcon icon={Notification01Icon} size={13} />
                <span>Notify Me</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="event-row-right">
        <div className="event-row-date-block">
          <span className="event-row-date">{event.date}</span>
          <span className="event-row-time">{event.time}</span>
        </div>
        <span className="event-row-chevron" aria-hidden="true">
          <HugeiconsIcon icon={ArrowDown01Icon} size={16} strokeWidth={2} />
        </span>
      </div>
    </div>

    <div className="event-row-sep" aria-hidden="true" />
  </div>
);

export const Upcoming = () => {
  const [activeId, setActiveId] = useState(null);
  const toggle = (id) => setActiveId((prev) => (prev === id ? null : id));

  return (
    <section className="upcoming-section" id="upcoming-section">
      <div className="section-header">
        <div className="upcoming-heading">
          <button className="btn-secondary upcoming-btn">
            <HugeiconsIcon icon={Notification01Icon} className="icon" />
            <span>What's coming</span>
          </button>
          <h2><span>Upcoming</span> Events</h2>
        </div>
      </div>

      <div className="events-list" role="list">
        {events.map((event, i) => (
          <EventRow
            key={event.id}
            event={event}
            index={i}
            isActive={activeId === event.id}
            onToggle={() => toggle(event.id)}
          />
        ))}
      </div>
    </section>
  );
};

export default Upcoming;