import { useState } from 'react';
import { SectionHeading } from './SectionHeading';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CloudDownloadIcon, ViewIcon, GridViewIcon, MusicNote01Icon
} from '@hugeicons/core-free-icons';
import './ResourcesSection.css';

const categoryIcons = { 'All materials': GridViewIcon, Hymn: MusicNote01Icon };

const hymnVerses = [
  ['Amazing grace! How sweet the sound', 'That saved a wretch like me!', 'I once was lost, but now am found;', 'Was blind, but now I see.'],
  ["'Twas grace that taught my heart to fear,", 'And grace my fears relieved;', 'How precious did that grace appear', 'The hour I first believed!'],
  ['Through many dangers, toils, and snares,', 'I have already come;', "'Tis grace hath brought me safe thus far,", 'And grace will lead me home.'],
  ['Through many dangers, toils, and snares,', 'I have already come;', "'Tis grace hath brought me safe thus far,", 'And grace will lead me home.'],
  ['Through many dangers, toils, and snares,', 'I have already come;', "'Tis grace hath brought me safe thus far,", 'And grace will lead me home.'],
  ['Through many dangers, toils, and snares,', 'I have already come;', "'Tis grace hath brought me safe thus far,", 'And grace will lead me home.'],
];

const resourceTypes = [
  { id: 'bulletin', title: 'Sunday Bulletin', category: 'Bulletins', description: 'Service notes, church announcements, and the week ahead.', date: '25 August 2025', day: 'Sunday' },
  { id: 'study', title: 'Bible Study Guide', category: 'Bible study', description: 'Scripture, study notes, and questions to grow in your faith.', date: '16 September 2025', day: 'Monday' },
  { id: 'prayer', title: 'Prayer Guide', category: 'Prayer', description: 'Prayer points and Scripture for your personal quiet time.', date: '29 September 2026', day: 'Wednesday' },
  { id: 'amazing-grace', title: 'Amazing Grace', category: 'Hymn', description: 'A classic hymn of grace and hope.', type: 'hymn' },
];

export const Resources = () => {
  const [category, setCategory] = useState('All materials');
  const categories = ['All materials', 'Hymn'];
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
            {categories.map((name) => <button key={name} type="button" aria-pressed={name === category} onClick={() => setCategory(name)}><HugeiconsIcon icon={categoryIcons[name]} size={18} aria-hidden="true" />
              <span>{name}</span>
              <span className="church-resource-filter-count" aria-hidden="true">{name === 'All materials' ? resourceTypes.length : resourceTypes.filter((item) => item.category === name).length}</span>
            </button>)}
          </div>
        </div>

        <ul className="church-resources-list">
          {visible.map((item) => (
            item.type === 'hymn' ? (
              <li className="church-resource-hymn" key={item.id}>
                <div className="church-resource-hymn-heading">
                  <span className="church-resource-hymn-icon"><HugeiconsIcon icon={MusicNote01Icon} size={22} aria-hidden="true" /></span>
                  <div><span className="church-resource-hymn-label">Hymn</span><h3>{item.title}</h3><p>{item.description}</p></div>
                </div>
                {category === 'Hymn' ? (
                  <div className="church-resource-hymn-verses" aria-label={`${item.title} lyrics`}>
                    {hymnVerses.map((verse, index) => <div className="church-resource-hymn-verse" key={index}><span>Verse {index + 1}</span><p>{verse.map((line) => <span key={line}>{line}<br /></span>)}</p></div>)}
                  </div>
                ) : <button className="church-resource-hymn-read" type="button" onClick={() => setCategory('Hymn')}>Read lyrics</button>}
              </li>
            ) : <li className="church-resource" key={item.id}>
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
                  <HugeiconsIcon icon={ViewIcon} size={18} aria-hidden="true" /> Open</button>
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
