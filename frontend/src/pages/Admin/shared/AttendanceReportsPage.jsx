import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ClipboardList,
  SquareExclamationPoint,
  BadgeCheck,
  CheckCheck,
  Files,
  MoreVertical,
  Search,
  Users,
} from 'lucide-react';
import { AdminLayout } from '../AdminLayout';
import { Toast } from '../../../components/Toast';
import { useAuth } from '../../../auth/useAuth';
import emptyIllustration from '../../../assets/images/empty.svg';
import { AdminFilterDropdown } from '../../../components/Admin/shared/AdminFilterDropdown';
import initialReports from '../../../data/general-overseer-received-reports.json';
import branches from '../../../data/branches.json';
import './AttendanceReportsPage.css';

const formatDate = (value) =>
  new Date(`${value}T12:00:00`).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const formatSubmittedAt = (value) =>
  `${new Date(value).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })}, ${new Date(value).toLocaleTimeString('en-NG', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })}`;

export function AttendanceReportsPage() {
  const { admin } = useAuth();
  const workspace =
    admin?.role === 'headquater-media-admin'
      ? 'headquater-media-admin'
      : 'general-overseer';
  const [query, setQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-sent');
  const reports = initialReports;
  const [openMenuId, setOpenMenuId] = useState(null);
  const [acknowledgedReports, setAcknowledgedReports] = useState([]);
  const [acknowledgementToast, setAcknowledgementToast] = useState(null);
  useEffect(() => {
    if (openMenuId === null) return undefined;

    function closeMenuOutside(event) {
      const target = event.target;
      if (
        target instanceof Element &&
        !target.closest('.attendance-report-card-menu') &&
        !target.closest('.attendance-report-card-actions')
      ) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener('pointerdown', closeMenuOutside);
    return () => document.removeEventListener('pointerdown', closeMenuOutside);
  }, [openMenuId]);
  const serviceDays = ['Sunday', 'Monday', 'Wednesday', 'Friday'].filter(
    (service) => reports.some((report) => report.service === service),
  );

  const filteredReports = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return [...reports]
      .filter((report) =>
        branchFilter === 'all' ? true : report.branch === branchFilter,
      )
      .filter((report) =>
        statusFilter === 'all' ? true : report.status === statusFilter,
      )
      .filter((report) =>
        serviceFilter === 'all' ? true : report.service === serviceFilter,
      )
      .filter((report) =>
        `${report.branch} ${report.service} ${report.submittedBy}`
          .toLowerCase()
          .includes(normalizedQuery),
      )
      .sort((first, second) =>
        sortBy === 'attendance'
          ? second.total - first.total
          : new Date(second.submittedAt) - new Date(first.submittedAt),
      );
  }, [branchFilter, query, serviceFilter, sortBy, statusFilter]);

  const receivedCount = reports.filter(
    (report) => report.status === 'Received',
  ).length;
  const pendingCount = reports.filter(
    (report) => report.status === 'Pending',
  ).length;
  const expectedCount =
    branches.length * new Set(reports.map((report) => report.service)).size;
  const receivedProgress = expectedCount
    ? Math.min((receivedCount / expectedCount) * 100, 100)
    : 0;
  const totalAttendance = reports.reduce(
    (sum, report) => sum + report.total,
    0,
  );

  function acknowledgeReport(report) {
    setAcknowledgedReports((current) =>
      current.includes(report.id) ? current : [...current, report.id],
    );
    setOpenMenuId(null);
    setAcknowledgementToast({
      id: Date.now(),
      message: `${report.branch} ${report.service.toLowerCase()} attendance marked acknowledged on this page.`,
    });
  }

  return (
    <AdminLayout workspace={workspace} pageTitle='Attendance reports'>
      <section
        className='attendance-reports-page'
        aria-labelledby='attendance-reports-title'
      >
        {acknowledgementToast && (
          <Toast
            key={acknowledgementToast.id}
            message={acknowledgementToast.message}
          />
        )}
        <header className='attendance-reports-heading'>
          <div>
            <h1 id='attendance-reports-title'>Attendance reports</h1>
            <p>View attendance reports sent from your church branches.</p>
          </div>
          <span className='attendance-reports-heading-icon' aria-hidden='true'>
            <ClipboardList size={22} />
          </span>
        </header>

        <div className='attendance-report-summary' aria-label='Report summary'>
          <article className='attendance-report-summary-card'>
            <BadgeCheck
              className='attendance-report-summary-icon is-green'
              size={16}
              aria-hidden='true'
            />
            <span className='attendance-report-summary-label'>
              Received reports
            </span>
            <strong>{receivedCount}</strong>
          </article>
          <article className='attendance-report-summary-card'>
            <SquareExclamationPoint
              className='attendance-report-summary-icon is-amber'
              size={16}
              aria-hidden='true'
            />
            <span className='attendance-report-summary-label'>
              Pending reports
            </span>
            <strong>{pendingCount}</strong>
          </article>
          <article className='attendance-report-summary-card is-expected'>
            <Files
              className='attendance-report-summary-icon is-blue'
              size={16}
              aria-hidden='true'
            />
            <span className='attendance-report-summary-label'>
              Expected reports
            </span>
            <strong>{expectedCount}</strong>
            <div
              className='attendance-report-summary-progress'
              role='progressbar'
              aria-label='Received reports progress'
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(receivedProgress)}
            >
              <span style={{ width: `${receivedProgress}%` }} />
            </div>
          </article>
          <article className='attendance-report-summary-card'>
            <Users
              className='attendance-report-summary-icon is-blue'
              size={16}
              aria-hidden='true'
            />
            <span className='attendance-report-summary-label'>
              People recorded
            </span>
            <strong>{totalAttendance.toLocaleString()}</strong>
          </article>
        </div>

        <section
          className='attendance-reports-panel'
          aria-label='Branch attendance submissions'
        >
          <div className='attendance-reports-toolbar'>
            <div className='attendance-reports-toolbar-leading'>
              <div
                className='attendance-report-service-tabs'
                aria-label='Filter reports by service day'
              >
                {[
                  { label: 'All', value: 'all' },
                  ...serviceDays.map((service) => ({
                    label: {
                      Sunday: 'Sun',
                      Monday: 'Mon',
                      Wednesday: 'Wed',
                      Friday: 'Fri',
                    }[service],
                    value: service,
                  })),
                ].map((tab) => (
                  <button
                    key={tab.value}
                    type='button'
                    className={`attendance-report-service-tab${serviceFilter === tab.value ? ' is-active' : ''}`}
                    aria-pressed={serviceFilter === tab.value}
                    onClick={() => setServiceFilter(tab.value)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <div className='attendance-reports-filters'>
              <label className='attendance-reports-search'>
                <Search size={16} aria-hidden='true' />
                <input
                  type='search'
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder='Search branch or submitter'
                  aria-label='Search branch or submitter'
                />
              </label>
              <AdminFilterDropdown
                name='attendance-report-branch'
                label={branchFilter === 'all' ? 'All branches' : branchFilter}
                value={branchFilter}
                options={[
                  { label: 'All branches', value: 'all' },
                  ...branches.map((branch) => ({
                    label: branch.name,
                    value: branch.name,
                  })),
                ]}
                onSelect={setBranchFilter}
              />
              <AdminFilterDropdown
                name='attendance-report-status'
                label={statusFilter === 'all' ? 'All statuses' : statusFilter}
                value={statusFilter}
                options={[
                  { label: 'All statuses', value: 'all' },
                  { label: 'Received', value: 'Received' },
                  { label: 'Pending', value: 'Pending' },
                ]}
                onSelect={setStatusFilter}
              />
              <AdminFilterDropdown
                name='attendance-report-sort'
                label={
                  sortBy === 'attendance'
                    ? 'Highest attendance'
                    : 'Date sent'
                }
                value={sortBy}
                options={[
                  { label: 'Highest attendance', value: 'attendance' },
                  { label: 'Date sent', value: 'date-sent' },
                ]}
                onSelect={setSortBy}
              />
            </div>
          </div>

          <div
            className={`attendance-report-cards${filteredReports.length === 0 ? ' is-empty' : ''}`}
            aria-live='polite'
          >
            {filteredReports.map((report) => (
              <article
                className={`attendance-report-card${report.status === 'Pending' ? ' is-pending' : ''}`}
                key={report.id}
              >
                <div
                  className={`attendance-report-card-banner ${report.status === 'Pending' ? 'is-pending' : ''}`}
                >
                  {report.status === 'Received' && (
                    <>
                      <button
                        className='attendance-report-card-actions'
                        type='button'
                        aria-label={`More actions for ${report.branch} ${report.service} report`}
                        title='More actions'
                        aria-haspopup='menu'
                        aria-expanded={openMenuId === report.id}
                        onClick={() =>
                          setOpenMenuId((current) =>
                            current === report.id ? null : report.id,
                          )
                        }
                      >
                        <MoreVertical size={18} aria-hidden='true' />
                      </button>
                      {openMenuId === report.id && (
                        <div className='attendance-report-card-menu' role='menu'>
                          <button
                            type='button'
                            role='menuitem'
                            disabled={acknowledgedReports.includes(report.id)}
                            onClick={() => acknowledgeReport(report)}
                          >
                            <CheckCheck size={15} aria-hidden='true' />
                            {acknowledgedReports.includes(report.id)
                              ? 'Acknowledged'
                              : 'Acknowledge'}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                  <span
                    className='attendance-report-card-banner-icon'
                    aria-hidden='true'
                  >
                    <ClipboardList size={22} />
                  </span>
                </div>
                <div className='attendance-report-card-copy'>
                  <span className='attendance-report-service'>
                    {report.service.toUpperCase()} SERVICE
                  </span>
                  <h3>{report.branch}</h3>
                  <p className='attendance-report-card-date'>
                    Service date · {formatDate(report.date)}
                  </p>
                  {report.status !== 'Pending' && (
                    <div className='attendance-report-copy-total'>
                      <span>Total people</span>
                      <strong>{report.total.toLocaleString()}</strong>
                    </div>
                  )}
                </div>
                {report.status !== 'Pending' && (
                  <div className='attendance-report-card-attendance'>
                    <dl className='attendance-report-demographics'>
                      <div>
                        <dt>Men</dt>
                        <dd>{report.men}</dd>
                      </div>
                      <div>
                        <dt>Women</dt>
                        <dd>{report.women}</dd>
                      </div>
                      <div>
                        <dt>Youth</dt>
                        <dd>{report.youth}</dd>
                      </div>
                      <div>
                        <dt>Children</dt>
                        <dd>{report.children}</dd>
                      </div>
                    </dl>
                  </div>
                )}
                {report.status !== 'Pending' && (
                  <div className='attendance-report-card-received'>
                    <span>
                      <strong>Received</strong>
                      {formatSubmittedAt(report.submittedAt)}
                    </span>
                  </div>
                )}
                <footer className='attendance-report-card-meta'>
                  {report.status !== 'Pending' && (
                    <span>
                      <strong>Submitted by</strong>
                      {report.submittedBy}
                    </span>
                  )}
                  <span
                    className={`attendance-report-status ${report.status === 'Pending' ? 'is-pending' : 'is-received'}`}
                  >
                    {report.status === 'Pending' ? (
                      <SquareExclamationPoint size={13} aria-hidden='true' />
                    ) : (
                      <BadgeCheck size={13} aria-hidden='true' />
                    )}
                    {report.status}
                  </span>
                </footer>
              </article>
            ))}
            {filteredReports.length === 0 && (
              <div className='attendance-reports-empty'>
                <img src={emptyIllustration} alt='' aria-hidden='true' />
                <h2>No attendance report sent yet</h2>
              </div>
            )}
          </div>
        </section>
      </section>
    </AdminLayout>
  );
}
