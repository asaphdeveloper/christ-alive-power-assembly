import {
  ArrowUpRight,
  Building2,
  Church,
  LayoutDashboard,
  MapPin,
  ShieldCheck,
  UsersRound,
} from 'lucide-react';
import './AdminPortalPage.css';

const branches = [
  { name: 'Jos Branch', location: 'Jos', administrator: 'Jos Branch Admin', initials: 'JB', color: 'sage' },
  { name: 'Wukari Branch', location: 'Wukari', administrator: 'Wukari Branch Admin', initials: 'WB', color: 'blue' },
  { name: 'Bauchi Branch', location: 'Bauchi', administrator: 'Bauchi Branch Admin', initials: 'BB', color: 'gold' },
];

const administrators = [
  { name: 'General Overseer', level: 'Organization leadership', scope: 'All branches', initials: 'GO' },
  { name: 'Headquarters Admin', level: 'Headquarters', scope: 'Church headquarters', initials: 'HQ' },
  ...branches.map((branch) => ({
    name: branch.administrator,
    level: 'Branch administration',
    scope: branch.name,
    initials: branch.initials,
  })),
];

const navigation = [
  { label: 'Overview', href: '#overview', icon: LayoutDashboard },
  { label: 'Branches', href: '#branches', icon: Church },
  { label: 'Administrators', href: '#administrators', icon: UsersRound },
];

export function AdminPortalPage() {
  return (
    <main className="admin-portal" id="main-content">
      <aside className="admin-sidebar" aria-label="Admin portal navigation">
        <a className="admin-brand" href="#overview" aria-label="Church administration home">
          <span className="admin-brand-mark"><Church size={21} strokeWidth={1.8} /></span>
          <span className="admin-brand-copy"><strong>CAPA</strong><small>Church Administration</small></span>
        </a>

        <div className="admin-nav-label">WORKSPACE</div>
        <nav className="admin-nav">
          {navigation.map(({ label, href, icon: Icon }, index) => (
            <a key={label} href={href} className={`admin-nav-link${index === 0 ? ' is-active' : ''}`}>
              <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <div className="admin-sidebar-foot">
          <ShieldCheck size={17} aria-hidden="true" />
          <span>Administration portal</span>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-breadcrumb"><span>Workspace</span><span aria-hidden="true">/</span><strong>Overview</strong></div>
          <div className="admin-topbar-context"><span className="admin-status-dot" /> Church administration</div>
        </header>

        <div className="admin-content">
          <section className="admin-page-heading" id="overview" aria-labelledby="admin-title">
            <div>
              <p className="admin-eyebrow">ADMINISTRATION</p>
              <h1 id="admin-title">Church overview</h1>
              <p>Manage your church organization, branches, and administration structure.</p>
            </div>
            <div className="admin-date-chip"><Building2 size={16} aria-hidden="true" /> Organization-wide view</div>
          </section>

          <section className="admin-summary-grid" aria-label="Organization summary">
            <article className="admin-summary-card">
              <span className="admin-summary-icon green"><Church size={19} aria-hidden="true" /></span>
              <div><p>Church branches</p><strong>03</strong><small>Across the organization</small></div>
            </article>
            <article className="admin-summary-card">
              <span className="admin-summary-icon violet"><UsersRound size={19} aria-hidden="true" /></span>
              <div><p>Administrators</p><strong>05</strong><small>Across all levels</small></div>
            </article>
            <article className="admin-summary-card">
              <span className="admin-summary-icon amber"><ShieldCheck size={19} aria-hidden="true" /></span>
              <div><p>Administration levels</p><strong>03</strong><small>Organization, HQ, branch</small></div>
            </article>
          </section>

          <section className="admin-section" id="branches" aria-labelledby="branches-title">
            <div className="admin-section-heading">
              <div><p className="admin-eyebrow">YOUR ORGANIZATION</p><h2 id="branches-title">Church branches</h2></div>
              <a className="admin-section-link" href="#administrators">View administrators <ArrowUpRight size={16} aria-hidden="true" /></a>
            </div>
            <div className="admin-branch-grid">
              {branches.map((branch) => (
                <article className="admin-branch-card" key={branch.name}>
                  <div className="admin-branch-card-top">
                    <span className={`admin-branch-icon ${branch.color}`}><Church size={20} aria-hidden="true" /></span>
                    <span className="admin-branch-status"><span /> Active</span>
                  </div>
                  <h3>{branch.name}</h3>
                  <p className="admin-branch-location"><MapPin size={15} aria-hidden="true" /> {branch.location}</p>
                  <div className="admin-branch-divider" />
                  <p className="admin-card-caption">BRANCH ADMINISTRATOR</p>
                  <div className="admin-branch-admin">
                    <span className={`admin-avatar ${branch.color}`}>{branch.initials}</span>
                    <strong>{branch.administrator}</strong>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="admin-section admin-admins-section" id="administrators" aria-labelledby="administrators-title">
            <div className="admin-section-heading">
              <div><p className="admin-eyebrow">ACCESS STRUCTURE</p><h2 id="administrators-title">Administration</h2></div>
              <span className="admin-count-label">{administrators.length} administrators</span>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th scope="col">Administrator</th><th scope="col">Level</th><th scope="col">Responsible for</th></tr></thead>
                <tbody>
                  {administrators.map((administrator) => (
                    <tr key={administrator.name}>
                      <td><span className="admin-table-person"><span className="admin-avatar neutral">{administrator.initials}</span><strong>{administrator.name}</strong></span></td>
                      <td>{administrator.level}</td>
                      <td>{administrator.scope}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <footer className="admin-footer">Christ Alive Power Assembly <span>•</span> Administration portal</footer>
        </div>
      </div>
    </main>
  );
}
