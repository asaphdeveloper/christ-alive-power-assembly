import { useMemo, useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Search,
  Users,
} from 'lucide-react';
import { AdminLayout } from '../AdminLayout';
import reports from '../../../data/general-overseer-received-reports.json';
import branches from '../../../data/branches.json';
import './AttendanceReportsPage.css';

const formatDate = (value) =>
  new Date(`${value}T12:00:00`).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const formatSubmittedAt = (value) =>
  new Date(value).toLocaleString('en-NG', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });

export function AttendanceReportsPage() {
  const [query, setQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

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
        `${report.branch} ${report.service} ${report.submittedBy}`
          .toLowerCase()
          .includes(normalizedQuery),
      )
      .sort((first, second) => second.date.localeCompare(first.date));
  }, [branchFilter, query, statusFilter]);

  const pendingCount = reports.filter((report) => report.status === 'Pending').length;
  const totalAttendance = reports.reduce((sum, report) => sum + report.total, 0);

  return (
    <AdminLayout workspace='general-overseer' pageTitle='Attendance reports'>
      <section className='attendance-reports-page' aria-labelledby='attendance-reports-title'>
        <header className='attendance-reports-heading'>
          <div>
            <span className='attendance-reports-eyebrow'>Branch submissions</span>
            <h1 id='attendance-reports-title'>Attendance reports</h1>
            <p>View attendance reports sent from your church branches.</p>
          </div>
          <span className='attendance-reports-heading-icon' aria-hidden='true'>
            <ClipboardList size={22} />
          </span>
        </header>

        <div className='attendance-report-summary' aria-label='Report summary'>
          <article className='attendance-report-summary-card'>
            <span className='attendance-report-summary-icon is-green'><ClipboardList size={18} /></span>
            <div><span>Total reports</span><strong>{reports.length}</strong></div>
          </article>
          <article className='attendance-report-summary-card'>
            <span className='attendance-report-summary-icon is-amber'><Clock3 size={18} /></span>
            <div><span>Awaiting review</span><strong>{pendingCount}</strong></div>
          </article>
          <article className='attendance-report-summary-card'>
            <span className='attendance-report-summary-icon is-blue'><Users size={18} /></span>
            <div><span>People recorded</span><strong>{totalAttendance.toLocaleString()}</strong></div>
          </article>
        </div>

        <section className='attendance-reports-panel' aria-label='Branch attendance submissions'>
          <div className='attendance-reports-toolbar'>
            <div className='attendance-reports-toolbar-copy'>
              <h2>Submitted reports</h2>
              <p>{filteredReports.length} report{filteredReports.length === 1 ? '' : 's'} shown</p>
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
              <select value={branchFilter} onChange={(event) => setBranchFilter(event.target.value)} aria-label='Filter by branch'>
                <option value='all'>All branches</option>
                {branches.map((branch) => <option key={branch.name} value={branch.name}>{branch.name}</option>)}
              </select>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label='Filter by status'>
                <option value='all'>All statuses</option>
                <option value='Delivered'>Delivered</option>
                <option value='Pending'>Pending</option>
              </select>
            </div>
          </div>

          <div className='attendance-reports-table-wrap'>
            <table className='attendance-reports-table'>
              <thead>
                <tr>
                  <th scope='col'>Branch / service</th>
                  <th scope='col'>Service date</th>
                  <th scope='col'>Attendance</th>
                  <th scope='col'>Submitted by</th>
                  <th scope='col'>Received</th>
                  <th scope='col'>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id}>
                    <td data-label='Branch / service'>
                      <strong>{report.branch}</strong>
                      <span className='attendance-report-service'>{report.service} service</span>
                    </td>
                    <td data-label='Service date'><span className='attendance-report-date'><CalendarDays size={14} />{formatDate(report.date)}</span></td>
                    <td data-label='Attendance'>
                      <strong className='attendance-report-total'>{report.total.toLocaleString()}</strong>
                      <span className='attendance-report-demographics'>M {report.men} · W {report.women} · Y {report.youth} · C {report.children}</span>
                    </td>
                    <td data-label='Submitted by'>{report.submittedBy}</td>
                    <td data-label='Received'>{formatSubmittedAt(report.submittedAt)}</td>
                    <td data-label='Status'><span className={`attendance-report-status ${report.status === 'Pending' ? 'is-pending' : 'is-delivered'}`}>
                      {report.status === 'Pending' ? <Clock3 size={13} /> : <CheckCircle2 size={13} />}
                      {report.status}
                    </span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredReports.length === 0 && (
              <div className='attendance-reports-empty'>No attendance reports match those filters.</div>
            )}
          </div>
        </section>
      </section>
    </AdminLayout>
  );
}
