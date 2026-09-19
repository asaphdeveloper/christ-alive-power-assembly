import { useState } from 'react';
import { SectionHeading } from './SectionHeading';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CloudDownloadIcon, ViewIcon, BookOpen01Icon, GridViewIcon,
  News01Icon, HandPrayerIcon
} from '@hugeicons/core-free-icons';
import './ResourcesSection.css';

const categoryIcons = { 'All materials': GridViewIcon, Bulletins: News01Icon, 'Bible study': BookOpen01Icon, Prayer: HandPrayerIcon };

const resourceTypes = [
  { id: 'bulletin', title: 'Sunday Bulletin', category: 'Bulletins', description: 'Service notes, church announcements, and the week ahead.', date: '25 August 2025', day: 'Sunday' },
  { id: 'study', title: 'Bible Study Guide', category: 'Bible study', description: 'Scripture, study notes, and questions to grow in your faith.', date: '16 September 2025', day: 'Monday' },
  { id: 'prayer', title: 'Prayer Guide', category: 'Prayer', description: 'Prayer points and Scripture for your personal quiet time.', date: '29 September 2026', day: 'Wednesday' },
];

export const Resources = () => {
  const [category, setCategory] = useState('All materials');
  const categories = ['All materials', ...new Set(resourceTypes.map((item) => item.category))];
  const visible = resourceTypes.filter((item) => category === 'All materials' || item.category === category);

  return (
    <section className="church-resources" id="resources-section" aria-labelledby="resources-title">
      <div className="church-resources-inner">
        <SectionHeading icon={CloudDownloadIcon} label="Grow in the Word" titleId="resources-title">
          <span>Church</span> Resources
        </SectionHeading>
        <p className="church-resources-intro">Browse our materials, read online, or download a PDF to keep.</p>
        <div className="church-resources-toolbar">
          <div className="church-resources-filters" role="group" aria-label="Filter resources">
            {categories.map((name) => <button key={name} type="button" aria-pressed={name === category} onClick={() => setCategory(name)}><HugeiconsIcon icon={categoryIcons[name] || BookOpen01Icon} size={18} aria-hidden="true" />
              <span>{name}</span>
              <span className="church-resource-filter-count" aria-hidden="true">{name === 'All materials' ? resourceTypes.length : resourceTypes.filter((item) => item.category === name).length}</span>
            </button>)}
          </div>
          <span className="church-resources-count" role="status">{visible.length} {visible.length === 1 ? 'material' : 'materials'}</span>
        </div>

        <ul className="church-resources-list">
          {visible.map((item) => (
            <li className="church-resource" key={item.id}>
              <div className="church-resource-file" aria-hidden="true">
                <svg width="26" height="30" viewBox="0 0 26 30" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 1h11l7 7v21H4z" /><path d="M15 1v8h7M8 15h10M8 20h10" /></svg>
                <span>PDF</span>
              </div>
              <div className="church-resource-details">
                <h3>{item.title}</h3>
                <p className="church-resource-description">{item.description}</p>
                <div>
                  <span className="church-resource-new-badge">New</span>
                  <span className="church-resource-day">{item.day}</span>
                  <span className="church-resource-date">{item.date}</span>
                </div>
              </div>

              <div className="church-resource-actions">
                <button className="church-resource-open" type="button" title="Available when the PDF is published">
                  <HugeiconsIcon icon={ViewIcon} size={18} aria-hidden="true" /> Open PDF</button>
                <button className="church-resource-download" type="button" title="Available when the PDF is published">
                  <HugeiconsIcon icon={CloudDownloadIcon} size={18} aria-hidden="true" /> Download</button>
              </div>
            </li>
          ))}
        </ul>
        {visible.length === 0 && <p className="church-resources-empty">No materials published yet. Check back soon for new resources.</p>}
      </div>
    </section>
  );
};
