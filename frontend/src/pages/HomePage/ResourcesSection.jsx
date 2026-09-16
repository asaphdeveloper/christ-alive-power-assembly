import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { CloudDownloadIcon, ViewIcon } from '@hugeicons/core-free-icons';
import './ResourcesSection.css';

// Sample metadata for the static design; PDF files are not connected yet.
const resourceTypes = [
  { id: 'bulletin', title: 'Sunday Bulletin', category: 'Bulletins', description: 'Service notes, church announcements, and the week ahead.', uploadedAt: '2026-09-13', fileType: 'PDF', fileSize: '882 KB' },
  { id: 'study', title: 'Bible Study Guide', category: 'Bible study', description: 'Scripture, study notes, and questions to grow in your faith.', uploadedAt: '2026-09-16', fileType: 'PDF', fileSize: '2.4 MB' },
  { id: 'prayer', title: 'Prayer Guide', category: 'Prayer', description: 'Prayer points and Scripture for your personal quiet time.', uploadedAt: '2026-09-11', fileType: 'PDF', fileSize: '516 KB' },
];

// Replace the pending entries with published admin records containing pdfUrl,
// downloadUrl (optional), fileType, fileSize (display text), and uploadedAt (ISO date).
export const Resources = ({ materials = resourceTypes }) => {
  const [category, setCategory] = useState('All materials');
  const categories = ['All materials', ...new Set(materials.map((item) => item.category))];
  const visible = materials.filter((item) => category === 'All materials' || item.category === category);

  return (
    <section className="church-resources" id="resources-section" aria-labelledby="resources-title">
      <div className="church-resources-inner">
        <div className="church-resources-heading">
          <span className="btn-secondary church-resources-badge"><HugeiconsIcon icon={CloudDownloadIcon} className="icon" aria-hidden="true" /> Grow in the Word</span>
          <h2 id="resources-title"><span>Church</span> Resources</h2>
        </div>
        <p className="church-resources-intro">Take the message with you. Browse our materials, read online, or download a PDF to keep.</p>
        <div className="church-resources-toolbar">
          <div className="church-resources-filters" role="group" aria-label="Filter resources">
            {categories.map((name) => <button key={name} type="button" aria-pressed={name === category} onClick={() => setCategory(name)}>{name}</button>)}
          </div>
          <span className="church-resources-count" role="status">{visible.length} {visible.length === 1 ? 'material' : 'materials'}</span>
        </div>
        <ul className="church-resources-list">
          {visible.map((item) => {
            const date = item.uploadedAt ? new Date(item.uploadedAt) : null;
            const hasUploadDate = date && !Number.isNaN(date.getTime());
            const fileType = item.fileType || 'PDF';
            return (
              <li className="church-resource" key={item.id}>
                <div className="church-resource-file" aria-hidden="true">
                  <svg width="26" height="30" viewBox="0 0 26 30" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 1h11l7 7v21H4z" /><path d="M15 1v8h7M8 15h10M8 20h10" /></svg>
                  <span>{fileType}</span>
                </div>
                <div className="church-resource-details">
                  <p className="church-resource-category">{item.category}</p>
                  <h3>{item.title}</h3>
                  <p className="church-resource-description">{item.description}</p>
                  <dl className="church-resource-meta">
                    <div>
                      <dt>Uploaded</dt>
                      <dd>{hasUploadDate
                        ? <time dateTime={item.uploadedAt}>{date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}</time>
                        : item.pdfUrl ? 'Not provided' : 'Awaiting upload'}</dd>
                    </div>
                    <div><dt>File type</dt><dd>{fileType}</dd></div>
                    <div><dt>File size</dt><dd>{item.fileSize || 'Not available yet'}</dd></div>
                  </dl>
                </div>
                <div className="church-resource-actions">
                  {item.pdfUrl ? <>
                    <a className="church-resource-open" href={item.pdfUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${item.title} PDF in a new tab`}><HugeiconsIcon icon={ViewIcon} size={18} aria-hidden="true" /> Open PDF</a>
                    <a className="church-resource-download" href={item.downloadUrl || item.pdfUrl} download aria-label={`Download ${item.title}`}><HugeiconsIcon icon={CloudDownloadIcon} size={18} aria-hidden="true" /> Download</a>
                  </> : <>
                    <button className="church-resource-open" type="button" disabled><HugeiconsIcon icon={ViewIcon} size={18} aria-hidden="true" /> Open PDF</button>
                    <button className="church-resource-download" type="button" disabled><HugeiconsIcon icon={CloudDownloadIcon} size={18} aria-hidden="true" /> Download</button>
                  </>}
                </div>
              </li>
            );
          })}
        </ul>
        {visible.length === 0 && <p className="church-resources-empty">No materials published yet. Check back soon for new resources.</p>}
        <p className="church-resources-note">Freely available for your personal study and spiritual growth.</p>
      </div>
    </section>
  );
};
