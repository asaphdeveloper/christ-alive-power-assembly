import { useMemo, useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileCheck2,
  Files,
  Search,
  Users,
} from 'lucide-react';
import { AdminLayout } from '../AdminLayout';
import { AdminFilterDropdown } from './AdminFilterDropdown';
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

  const receivedCount = reports.filter((report) => report.status === 'Delivered').length;
  const pendingCount = reports.filter((report) => report.status === 'Pending').length;
  const expectedCount =
    branches.length * new Set(reports.map((report) => report.service)).size;
  const totalAttendance = reports.reduce((sum, report) => sum + report.total, 0);

  return (
    <AdminLayout workspace='general-overseer' pageTitle='Attendance reports'>
      <section className='attendance-reports-page' aria-labelledby='attendance-reports-title'>
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
            <FileCheck2 className='attendance-report-summary-icon is-green' size={16} aria-hidden='true' />
            <span className='attendance-report-summary-label'>Received reports</span>
            <strong>{receivedCount}</strong>
          </article>
          <article className='attendance-report-summary-card'>
            <Clock3 className='attendance-report-summary-icon is-amber' size={16} aria-hidden='true' />
            <span className='attendance-report-summary-label'>Pending reports</span>
            <strong>{pendingCount}</strong>
          </article>
          <article className='attendance-report-summary-card'>
            <Files className='attendance-report-summary-icon is-blue' size={16} aria-hidden='true' />
            <span className='attendance-report-summary-label'>Expected reports</span>
            <strong>{expectedCount}</strong>
          </article>
          <article className='attendance-report-summary-card'>
            <Users className='attendance-report-summary-icon is-blue' size={16} aria-hidden='true' />
            <span className='attendance-report-summary-label'>People recorded</span>
            <strong>{totalAttendance.toLocaleString()}</strong>
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
                  { label: 'Received', value: 'Delivered' },
                  { label: 'Pending', value: 'Pending' },
                ]}
                onSelect={setStatusFilter}
              />
            </div>
          </div>

          <div className='attendance-reports-table-wrap'>
            <table className='attendance-reports-table'>
              <thead>
                <tr>
                  <th scope='col'>#</th>
                  <th scope='col'>Branch / service</th>
                  <th scope='col'>Service date</th>
                  <th scope='col'>Attendance</th>
                  <th scope='col'>Submitted by</th>
                  <th scope='col'>Received</th>
                  <th scope='col'>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report, index) => (
                  <tr key={report.id}>
                    <td data-label='#' className='attendance-report-row-number'>{index + 1}</td>
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
                    <td data-label='Status'><span className={`attendance-report-status ${report.status === 'Pending' ? 'is-pending' : 'is-received'}`}>
                      {report.status === 'Pending' ? <Clock3 size={13} /> : <CheckCircle2 size={13} />}
                      {report.status === 'Delivered' ? 'Received' : report.status}
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
