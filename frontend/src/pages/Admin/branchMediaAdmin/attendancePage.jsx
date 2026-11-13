import { useMemo, useState } from 'react';
import { Baby, CalendarDays, Check, Clock3, Mars, ShieldCheck, UsersRound, Venus } from 'lucide-react';
import { AdminLayout } from '../AdminLayout';
import attendanceHistory from '../../../data/attendance-history.json';
import './attendancePage.css';

const attendanceGroups = [
  { key: 'men', label: 'Men', icon: Mars },
  { key: 'women', label: 'Women', icon: Venus },
  { key: 'youth', label: 'Youth', icon: UsersRound },
  { key: 'children', label: 'Children', icon: Baby },
];

const emptyAttendance = { men: '', women: '', youth: '', children: '' };

function getToday() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

function getService(date) {
  if (!date) return '';
  const weekday = new Date(`${date}T12:00:00`).getDay();
  return ({ 0: 'Sunday', 1: 'Monday', 3: 'Wednesday', 5: 'Friday' })[weekday] ?? '';
}

function getWeekStart(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  const day = date.getDay();
  date.setDate(date.getDate() - (day === 0 ? 6 : day - 1));
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatDate(dateString, options = { day: 'numeric', month: 'short', year: 'numeric' }) {
  return new Date(`${dateString}T12:00:00`).toLocaleDateString('en-NG', options);
}

function formatCalendarDate(date, options = { day: 'numeric', month: 'short' }) {
  return date.toLocaleDateString('en-NG', options);
}

export function AttendancePage({ user = { name: 'Branch Media Admin', branch: 'Bauchi Branch' } }) {
  const [date, setDate] = useState(getToday);
  const [figures, setFigures] = useState(emptyAttendance);
  const [records, setRecords] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const service = useMemo(() => getService(date), [date]);
  const membersTotal = attendanceGroups.reduce((sum, group) => sum + Number(figures[group.key] || 0), 0);
  const alreadySent = attendanceHistory.some((record) => record.branch === user.branch && record.serviceDate === date && record.serviceDay === service && record.status === 'Delivered');
  const weekStart = getWeekStart(getToday());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  const weeklyRecords = attendanceHistory
    .filter((record) => {
      const recordDate = new Date(`${record.serviceDate}T12:00:00`);
      return record.branch === user.branch && recordDate >= weekStart && recordDate <= weekEnd;
    })
    .map((record) => ({
      ...record,
      date: record.serviceDate,
      service: record.serviceDay,
      total: record.men + record.women + record.youth + record.children,
    }))
    .sort((first, second) => first.date.localeCompare(second.date));

  function changeFigure(event) {
    const { name, value } = event.target;
    setFigures((current) => ({ ...current, [name]: value.replace(/\D/g, '') }));
    setError('');
    setSuccess('');
  }

  function reviewAttendance(event) {
    event.preventDefault();
    if (!service) {
      setError('No service on this day. Choose Sunday, Monday, Wednesday or Friday.');
      return;
    }
    if (date > getToday()) {
      setError('Choose today or an earlier service date.');
      return;
    }
    if (Object.values(figures).some((value) => value === '')) {
      setError('Fill in every group. Enter 0 if nobody attended.');
      return;
    }
    if (alreadySent) {
      setError('Attendance has already been sent for this branch, date and service.');
      return;
    }

    setShowConfirmation(true);
    setError('');
  }

  function confirmAttendance() {
    const record = {
      branch: user.branch,
      date,
      service,
      men: Number(figures.men),
      women: Number(figures.women),
      youth: Number(figures.youth),
      children: Number(figures.children),
      total: membersTotal,
      submittedBy: user.name,
      submittedAt: new Date().toISOString(),
    };

    // TODO: Replace the local state update with the attendance API request.
    setRecords((current) => [...current, record]);
    setFigures(emptyAttendance);
    setShowConfirmation(false);
    setSuccess(`${service} attendance was sent for ${formatDate(date)}.`);
    setError('');
  }

  return (
    <AdminLayout workspace='branch-attendance-admin' pageTitle='Attendance'>
      <section className='attendance-page' aria-label={`${user.branch} attendance`}>
        <header className='attendance-page-heading' aria-labelledby='attendance-page-title'>
          <h1 id='attendance-page-title'>Attendance</h1>
          <span>Record and review weekly service attendance for {user.branch}.</span>
        </header>
        <form className='attendance-entry-panel' onSubmit={reviewAttendance} noValidate>
          <header className='attendance-entry-title'><h1>Record attendance</h1><p>{user.branch} · enter 0 for any group with no attendance.</p></header>
          {showConfirmation ? (
            <section className='attendance-confirmation' aria-labelledby='attendance-confirmation-title'>
              <div className='attendance-confirmation-heading'>
                <span>Review before sending</span>
                <h2 id='attendance-confirmation-title'>Confirm attendance</h2>
                <p>{user.branch} · {formatDate(date)} · {service} service</p>
              </div>
              <dl className='attendance-confirmation-counts'>
                {attendanceGroups.map(({ key, label }) => (
                  <div key={key}><dt>{label}</dt><dd>{Number(figures[key])}</dd></div>
                ))}
                <div className='attendance-confirmation-total'><dt>Total</dt><dd>{membersTotal}</dd></div>
              </dl>
              <div className='attendance-confirmation-actions'>
                <button className='attendance-edit-button' type='button' onClick={() => setShowConfirmation(false)}>Edit</button>
                <button className='attendance-send-button' type='button' onClick={confirmAttendance}><Check size={17} aria-hidden='true' />Confirm</button>
              </div>
            </section>
          ) : <>
          <div className='attendance-date-service-row'>
            <label className='attendance-date-field'><span className='attendance-date-service-label'>Service date</span><span className='attendance-date-input'><CalendarDays size={17} aria-hidden='true' /><input type='date' value={date} max={getToday()} onChange={(event) => { setDate(event.target.value); setError(''); setSuccess(''); }} required /></span></label>
            <div className='attendance-service-field'>
              <span className='attendance-date-service-label'>Service</span>
              <div className={`attendance-service-chip${service ? '' : ' is-unavailable'}`} aria-live='polite'>
                <strong>{service ? `${service} service` : 'No service on this day'}</strong>
              </div>
            </div>
          </div>
          <fieldset className='attendance-groups-fieldset'>
            <legend>Members present</legend>
            <div className='attendance-groups-grid'>
              {attendanceGroups.map(({ key, label, icon: Icon }) => (
                <label className='attendance-count-field' key={key}>
                  <span className={`attendance-count-icon attendance-count-icon-${key}`}>
                    <Icon size={17} aria-hidden='true' />
                  </span>
                  <span>{label}</span>
                  <input
                    name={key}
                    type='text'
                    inputMode='numeric'
                    pattern='[0-9]*'
                    value={figures[key]}
                    onChange={changeFigure}
                    required
                    aria-label={`${label} attendance`}
                  />
                </label>
              ))}
            </div>
          </fieldset>
          <div className='attendance-members-total' aria-live='polite'><span>Members present total</span><strong>{membersTotal}</strong></div>
          {error && <p className='attendance-validation-message' role='alert'>{error}</p>}
          {alreadySent && !success && <p className='attendance-validation-message' role='alert'>Attendance has already been sent for this branch, date and service.</p>}
          {success && <p className='attendance-success-message' role='status'>{success}</p>}
          <button className='attendance-send-button' type='submit' disabled={!service || alreadySent}><Check size={17} aria-hidden='true' />Send attendance</button>
          </>}
        </form>

        <section className='attendance-week-history' aria-labelledby='attendance-history-title'>
          <header><div><p>WEEKLY HISTORY</p><h2 id='attendance-history-title'>This week</h2></div><span>{formatCalendarDate(weekStart)} – {formatCalendarDate(weekEnd)}</span></header>
          {weeklyRecords.length ? (
            <div className='attendance-history-table-wrap'>
              <table className='attendance-history-table'>
                <thead>
                  <tr>
                    <th scope='col'>Service Date</th>
                    <th scope='col'>Service Day</th>
                    <th scope='col'>Men</th>
                    <th scope='col'>Women</th>
                    <th scope='col'>Youth</th>
                    <th scope='col'>Children</th>
                    <th scope='col'>Total</th>
                    <th scope='col'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklyRecords.map((record) => (
                    <tr key={`${record.date}-${record.service}`}>
                      <td>{formatDate(record.date)}</td>
                      <td>{record.service}</td>
                      <td>{record.men}</td>
                      <td>{record.women}</td>
                      <td>{record.youth}</td>
                      <td>{record.children}</td>
                      <td className='attendance-history-total'>{record.total}</td>
                      <td>
                        <span className={`attendance-history-status${record.status === 'Delivered' ? ' is-delivered' : ' is-pending'}`}>
                          {record.status === 'Delivered'
                            ? <ShieldCheck size={14} aria-hidden='true' />
                            : <Clock3 size={14} aria-hidden='true' />}
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className='attendance-history-empty'>No attendance records for your branch this week.</p>
          )}
        </section>
      </section>
    </AdminLayout>
  );
}
