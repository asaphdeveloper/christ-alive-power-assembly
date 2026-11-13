import {
  BadgeCheck,
  Baby,
  CalendarCheck,
  CalendarDays,
  Check,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  GraduationCap,
  Mars,
  MapPin,
  OctagonAlert,
  UsersRound,
  Venus,
} from 'lucide-react';

export function ReceivedReportsCard({
  receivedServiceGroups,
  receivedServiceFilter,
  setReceivedServiceFilter,
  openFilter,
  setOpenFilter,
  orderedBranchData,
  serviceOrder,
  serviceDisplayNames,
  getExpressionLabel,
  formatFullMonthDate,
  formatSubmittedAt,
}) {
  const reportsReceived = receivedServiceGroups.reduce(
    (sum, item) => sum + item.reports.length,
    0,
  );

  return (
    <section
      className='go-attendance-chart-card go-received-reports'
      aria-labelledby='go-received-reports-title'
    >
      <header className='go-received-heading'>
        <div>
          <span>
            <ClipboardCheck size={16} aria-hidden='true' />
            ATTENDANCE REPORTS
          </span>
          <h2 id='go-received-reports-title'>
            Expressions Service Attendance
          </h2>
        </div>
        <div className='go-received-controls'>
          <span className='go-chart-record-count'>
            {reportsReceived} out of {orderedBranchData.length} reports received
          </span>
          <div className='go-filter-control go-received-service-control'>
            <button
              className='go-filter-button'
              type='button'
              aria-haspopup='menu'
              aria-expanded={openFilter === 'received-service'}
              onClick={() =>
                setOpenFilter(
                  openFilter === 'received-service' ? '' : 'received-service',
                )
              }
            >
              <span>
                {serviceDisplayNames[receivedServiceFilter] ??
                  receivedServiceFilter}
              </span>
              <ChevronDown size={15} aria-hidden='true' />
            </button>
            {openFilter === 'received-service' && (
              <div
                className='go-filter-menu'
                role='menu'
                aria-label='Received report service'
              >
                {serviceOrder.map((serviceName) => (
                  <button
                    className={`go-filter-option${receivedServiceFilter === serviceName ? ' is-selected' : ''}`}
                    type='button'
                    role='menuitemradio'
                    aria-checked={receivedServiceFilter === serviceName}
                    key={serviceName}
                    onClick={() => {
                      setReceivedServiceFilter(serviceName);
                      setOpenFilter('');
                    }}
                  >
                    <span>
                      {serviceDisplayNames[serviceName] ?? serviceName}
                    </span>
                    {receivedServiceFilter === serviceName && (
                      <Check size={15} aria-hidden='true' />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>
      <div className='go-received-table-wrap'>
        <table className='go-received-table'>
          <thead>
            <tr>
              <th scope='col'><span className='go-table-heading'><MapPin size={14} aria-hidden='true' />Expression</span></th>
              <th scope='col'><span className='go-table-heading'><CalendarDays size={14} aria-hidden='true' />Date</span></th>
              <th scope='col'><span className='go-table-heading'><CalendarCheck size={14} aria-hidden='true' />Service</span></th>
              <th scope='col'><span className='go-table-heading'><Mars size={14} aria-hidden='true' />Men</span></th>
              <th scope='col'><span className='go-table-heading'><Venus size={14} aria-hidden='true' />Women</span></th>
              <th scope='col'><span className='go-table-heading'><GraduationCap size={14} aria-hidden='true' />Youth</span></th>
              <th scope='col'><span className='go-table-heading'><Baby size={14} aria-hidden='true' />Children</span></th>
              <th scope='col'><span className='go-table-heading'><UsersRound size={14} aria-hidden='true' />Total</span></th>
              <th scope='col'><span className='go-table-heading'><Clock3 size={14} aria-hidden='true' />Submitted at</span></th>
              <th scope='col'><span className='go-table-heading'><BadgeCheck size={14} aria-hidden='true' />Status</span></th>
            </tr>
          </thead>
          {receivedServiceGroups.map(
            ({ service: serviceName, serviceDate, reports, pendingBranches }) => (
              <tbody className='go-received-service-group' key={serviceName}>
                <tr className='go-received-service-title'>
                  <th colSpan='10'>
                    <span>
                      {serviceDisplayNames[serviceName] ?? serviceName}
                    </span>
                  </th>
                </tr>
                <tr className='go-received-category-row'>
                  <th colSpan='10'>
                    <BadgeCheck size={15} aria-hidden='true' />
                    Received <span>{reports.length}</span>
                  </th>
                </tr>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td>
                      <span className='go-received-expression-cell'>
                        <BadgeCheck size={16} aria-hidden='true' />
                        {getExpressionLabel(report.branch)}
                      </span>
                    </td>
                    <td>{formatFullMonthDate(report.date)}</td>
                    <td>{report.service}</td>
                    <td>{report.men}</td>
                    <td>{report.women}</td>
                    <td>{report.youth}</td>
                    <td>{report.children}</td>
                    <td className='go-received-total'>{report.total}</td>
                    <td>{formatSubmittedAt(report.submittedAt)}</td>
                    <td>
                      <span className='go-report-status is-delivered'>
                        <BadgeCheck size={14} aria-hidden='true' />
                        Received
                      </span>
                    </td>
                  </tr>
                ))}
                {pendingBranches.length > 0 && (
                  <>
                    <tr className='go-received-category-row is-awaiting'>
                      <th colSpan='10'>
                        <OctagonAlert size={15} aria-hidden='true' />
                        Pending <span>{pendingBranches.length}</span>
                      </th>
                    </tr>
                    {pendingBranches.map((branchName) => (
                      <tr
                        className='go-received-pending-row'
                        key={`${serviceName}-${branchName}`}
                      >
                        <td>
                          <span className='go-received-expression-cell is-awaiting'>
                            <OctagonAlert size={16} aria-hidden='true' />
                            {getExpressionLabel(branchName)}
                          </span>
                        </td>
                        <td>
                          {serviceDate
                            ? formatFullMonthDate(serviceDate)
                            : '—'}
                        </td>
                        <td>{serviceName}</td>
                        <td colSpan='6'>—</td>
                        <td>
                          <span className='go-report-status is-pending'>
                            <OctagonAlert size={14} aria-hidden='true' />
                            Pending
                          </span>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            ),
          )}
        </table>
      </div>
    </section>
  );
}
