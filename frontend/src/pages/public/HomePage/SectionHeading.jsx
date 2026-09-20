import { HugeiconsIcon } from '@hugeicons/react';
import './SectionHeading.css';

export const SectionHeading = ({ icon, label, titleId, className = '', children }) => (
  <div className={`section-heading ${className}`.trim()}>
    <span className="btn-secondary section-heading-badge">
      <HugeiconsIcon icon={icon} className="icon" aria-hidden="true" />
      <span>{label}</span>
    </span>
    <h2 id={titleId}>{children}</h2>
  </div>
);
