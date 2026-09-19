import { Link } from 'react-router';
import {
  ArrowUpRight, Bell, ChevronLeft, ChevronRight, CircleCheck, CircleUserRound,
  CloudUpload, Download, Ellipsis, ExternalLink, FilePlus2, FileText, Files,
  Layers, LayoutDashboard, PencilLine, Search,
} from 'lucide-react';
import '@fontsource-variable/inter/wght.css';
import ChurchLogo from '../../assets/images/capa-logo.png';
import './AdminDashboardPage.css';

const stats = [
  { label: 'Total documents', value: '5', note: '2 added this month', icon: Files },
  { label: 'Listed', value: '3', note: 'Visible on the website', icon: CircleCheck },
  { label: 'Drafts', value: '2', note: 'Waiting to be listed', icon: PencilLine },
  { label: 'Categories', value: '3', note: 'Bulletins, Bible study, Prayer', icon: Layers },
];

const resources = [
  { title: 'Weekly Prayer Points', file: 'weekly-prayer-points.pdf', category: 'Prayer', date: '19 September 2026', status: 'Draft' },
  { title: 'Youth Devotional', file: 'youth-devotional.pdf', category: 'Bible study', date: '18 September 2026', status: 'Draft' },
  { title: 'Sunday Bulletin', file: 'sunday-bulletin.pdf', category: 'Bulletins', date: '25 August 2025', status: 'Listed' },
  { title: 'Bible Study Guide', file: 'bible-study-guide.pdf', category: 'Bible study', date: '16 September 2025', status: 'Listed' },
  { title: 'Prayer Guide', file: 'prayer-guide.pdf', category: 'Prayer', date: '29 September 2026', status: 'Listed' },
];

const activity = [
  { text: <><strong>Weekly Prayer Points</strong> was added as a draft</>, time: 'Today', draft: true },
  { text: <><strong>Youth Devotional</strong> was added as a draft</>, time: 'Yesterday', draft: true },
  { text: <><strong>Prayer Guide</strong> was listed on the website</>, time: '3 days ago', draft: false },
];

export const AdminDashboardPage = () => (
  <main className="admin-dashboard">
    <aside className="admin-sidebar" aria-label="Dashboard navigation">
      <Link className="admin-brand" to="/" aria-label="Christ Alive Power Assembly home">
        <img src={ChurchLogo} alt="" width="36" height="36" />
        <span className="admin-brand-name">Christ Alive<br />Power Assembly</span>
      </Link>

      <nav className="admin-sidebar-nav" aria-label="Workspace">
        <p className="admin-sidebar-label">Workspace</p>
        <a className="admin-sidebar-link active" href="#admin-overview" aria-current="page"><LayoutDashboard size={18} aria-hidden="true" /><span>Overview</span></a>
        <a className="admin-sidebar-link" href="#admin-library"><Files size={18} aria-hidden="true" /><span>Resource library</span></a>
        <a className="admin-sidebar-link" href="#admin-add-resource"><FilePlus2 size={18} aria-hidden="true" /><span>Add document</span></a>
      </nav>

      <div className="admin-sidebar-bottom">
        <span className="admin-avatar" aria-hidden="true"><CircleUserRound size={20} /></span>
        <div className="admin-sidebar-user-info">
          <strong>Admin workspace</strong>
          <span>Resource manager</span>
        </div>
      </div>
    </aside>

    <div className="admin-dashboard-main" id="admin-overview">
      <header className="admin-topbar">
        <Link className="admin-topbar-brand" to="/" aria-label="Christ Alive Power Assembly home">
          <img src={ChurchLogo} alt="" width="30" height="30" />
          <span>Christ Alive</span>
        </Link>
        <nav className="admin-breadcrumb" aria-label="Breadcrumb">
          <span>Workspace</span>
          <span className="admin-breadcrumb-sep" aria-hidden="true">/</span>
          <strong>Resources</strong>
        </nav>
        <div className="admin-topbar-actions">
          <label className="admin-search">
            <Search size={16} aria-hidden="true" />
            <span className="admin-sr-only">Search</span>
            <input type="search" placeholder="Search" />
          </label>
          <button className="admin-icon-button has-dot" type="button" aria-label="Notifications"><Bell size={18} aria-hidden="true" /></button>
          <Link to="/" className="admin-icon-button" aria-label="View website" title="View website"><ExternalLink size={18} aria-hidden="true" /></Link>
          <span className="admin-topbar-divider" aria-hidden="true" />
          <span className="admin-topbar-avatar" aria-label="Admin workspace"><CircleUserRound size={22} aria-hidden="true" /></span>
        </div>
      </header>

      <div className="admin-page-content">
        <div className="admin-page-header">
          <div>
            <h1>Resources</h1>
            <p>Prepare and organize the documents shared with your church community.</p>
          </div>
          <div className="admin-page-actions">
            <button className="admin-button admin-button-secondary" type="button"><Download size={16} aria-hidden="true" /> Export list</button>
            <a className="admin-button admin-button-primary" href="#admin-add-resource"><FilePlus2 size={16} aria-hidden="true" /> Add document</a>
          </div>
        </div>

        <section className="admin-stats" aria-label="Resource summary">
          {stats.map(({ label, value, note, icon: Icon }) => (
            <div className="admin-stat" key={label}>
              <div className="admin-stat-top">
                <span>{label}</span>
                <span className="admin-stat-icon"><Icon size={17} aria-hidden="true" /></span>
              </div>
              <strong>{value}</strong>
              <small>{note}</small>
            </div>
          ))}
        </section>

        <div className="admin-content-grid">
          <section className="admin-panel" id="admin-library" aria-labelledby="admin-library-title">
            <div className="admin-panel-header">
              <h2 id="admin-library-title">Documents</h2>
              <p>Everything shared with your community, in one place.</p>
            </div>

            <div className="admin-toolbar">
              <div className="admin-tabs">
                <span className="admin-tab is-active">All <span className="admin-tab-count">5</span></span>
                <span className="admin-tab">Listed <span className="admin-tab-count">3</span></span>
                <span className="admin-tab">Drafts <span className="admin-tab-count">2</span></span>
              </div>
              <label className="admin-search">
                <Search size={16} aria-hidden="true" />
                <span className="admin-sr-only">Search documents</span>
                <input type="search" placeholder="Search documents" />
              </label>
            </div>

            <div className="admin-table-scroll">
              <table className="admin-resource-table">
                <thead>
                  <tr>
                    <th scope="col">Document</th>
                    <th scope="col">Category</th>
                    <th scope="col">Added</th>
                    <th scope="col">Status</th>
                    <th scope="col"><span className="admin-sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {resources.map((item) => (
                    <tr key={item.file}>
                      <td>
                        <div className="admin-file">
                          <span className="admin-file-icon"><FileText size={18} aria-hidden="true" /></span>
                          <span className="admin-file-info"><strong>{item.title}</strong><small>{item.file}</small></span>
                        </div>
                      </td>
                      <td><span className="admin-chip">{item.category}</span></td>
                      <td>{item.date}</td>
                      <td><span className={`admin-status admin-status-${item.status.toLowerCase()}`}>{item.status}</span></td>
                      <td><button className="admin-icon-button" type="button" aria-label={`More actions for ${item.title}`}><Ellipsis size={18} aria-hidden="true" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="admin-pagination">
              <span>Showing 1 to 5 of 5 documents</span>
              <div>
                <button className="admin-icon-button" type="button" aria-label="Previous page"><ChevronLeft size={16} aria-hidden="true" /></button>
                <span>Page 1 of 1</span>
                <button className="admin-icon-button" type="button" aria-label="Next page"><ChevronRight size={16} aria-hidden="true" /></button>
              </div>
            </div>
          </section>

          <div className="admin-side">
            <section className="admin-panel" id="admin-add-resource" aria-labelledby="admin-upload-title">
              <div className="admin-panel-header">
                <h2 id="admin-upload-title">Add a document</h2>
                <p>Upload a PDF and choose where it belongs.</p>
              </div>
              <div className="admin-upload-form">
                <div className="admin-field">
                  <label htmlFor="resource-title">Document title</label>
                  <input id="resource-title" type="text" placeholder="Sunday Bulletin" />
                </div>
                <div className="admin-field">
                  <label htmlFor="resource-category">Category</label>
                  <select id="resource-category">
                    <option>Bulletins</option>
                    <option>Bible study</option>
                    <option>Prayer</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label htmlFor="resource-description">Short description</label>
                  <textarea id="resource-description" rows="3" placeholder="What will readers find inside?" />
                </div>
                <div className="admin-dropzone">
                  <span className="admin-dropzone-icon"><CloudUpload size={20} aria-hidden="true" /></span>
                  <strong><em>Choose a PDF</em> or drop it here</strong>
                  <span>PDF only, up to 20 MB</span>
                </div>
                <button className="admin-button admin-button-primary admin-button-block" type="button"><FilePlus2 size={16} aria-hidden="true" /> Save as draft</button>
              </div>
            </section>

            <section className="admin-panel" aria-labelledby="admin-activity-title">
              <div className="admin-panel-header">
                <h2 id="admin-activity-title">Recent activity</h2>
                <p>The latest changes to your library.</p>
              </div>
              <ul className="admin-activity">
                {activity.map((item, index) => (
                  <li key={index}>
                    <span className={`admin-activity-icon${item.draft ? ' is-draft' : ''}`}>
                      {item.draft ? <PencilLine size={15} aria-hidden="true" /> : <CircleCheck size={15} aria-hidden="true" />}
                    </span>
                    <div><p>{item.text}</p><small>{item.time}</small></div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <footer className="admin-page-footer">
          <span>Christ Alive Power Assembly</span>
          <Link to="/">View website <ArrowUpRight size={14} aria-hidden="true" /></Link>
        </footer>
      </div>
    </div>
  </main>
);
