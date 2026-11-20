import { useEffect, useMemo, useState } from 'react';
import {
  Baby,
  CalendarDays,
  Check,
  Clock3,
  Mars,
  Plus,
  Trophy,
  ShieldCheck,
  UsersRound,
  Venus,
  X,
} from 'lucide-react';
import { AdminLayout } from '../AdminLayout';
import { Toast } from '../../../components/Toast';
import attendanceHistory from '../../../data/attendance-history.json';
import './attendancePage.css';

const attendanceGroups = [
  { key: 'men', label: 'Men', icon: Mars },
  { key: 'women', label: 'Women', icon: Venus },
  { key: 'youth', label: 'Youth', icon: UsersRound },
  { key: 'children', label: 'Children', icon: Baby },
];

const emptyAttendance = {
  men: '',
  women: '',
  youth: '',
  children: '',
};

function getToday() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 10);
}

function getService(date) {
  if (!date) return '';
  const weekday = new Date(`${date}T12:00:00`).getDay();
  return (
    { 0: 'Sunday', 1: 'Monday', 3: 'Wednesday', 5: 'Friday' }[weekday] ?? ''
  );
}

function getWeekStart(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  const day = date.getDay();
  date.setDate(date.getDate() - (day === 0 ? 6 : day - 1));
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatDate(
  dateString,
  options = { day: 'numeric', month: 'short', year: 'numeric' },
) {
  return new Date(`${dateString}T12:00:00`).toLocaleDateString(
    'en-NG',
    options,
  );
}

function formatCalendarDate(
  date,
  options = { day: 'numeric', month: 'short' },
) {
  return date.toLocaleDateString('en-NG', options);
}

export function AttendancePage({
  user = { name: 'Branch Media Admin', branch: 'your assigned branch' },
}) {
  const [date, setDate] = useState(getToday);
  const [figures, setFigures] = useState(emptyAttendance);
  const [records, setRecords] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isEntryOpen, setIsEntryOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const service = useMemo(() => getService(date), [date]);
  useEffect(() => {
    if (!isEntryOpen) return undefined;
    function handleKeyDown(event) {
      if (event.key === 'Escape') setIsEntryOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isEntryOpen]);
  const membersTotal = attendanceGroups.reduce(
    (sum, group) => sum + Number(figures[group.key] || 0),
    0,
  );
  const alreadySent = [...attendanceHistory, ...records].some(
    (record) =>
      record.branch === user.branch &&
      record.serviceDate === date &&
      record.serviceDay === service &&
      record.status === 'Delivered',
  );
  const weekStart = getWeekStart(getToday());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  const branchRecords = [...attendanceHistory, ...records]
    .filter((record) => record.branch === user.branch)
    .map((record) => ({
      ...record,
      date: record.serviceDate ?? record.date,
      service: record.serviceDay ?? record.service,
      total:
        Number(record.men || 0) +
        Number(record.women || 0) +
        Number(record.youth || 0) +
        Number(record.children || 0),
    }));
  const serviceRecordSamples = {
    Sunday: { total: 184, date: '2026-10-18' },
    Monday: { total: 96, date: '2026-10-19' },
    Wednesday: { total: 132, date: '2026-10-21' },
    Friday: { total: 108, date: '2026-10-23' },
  };
  const serviceRecords = ['Sunday', 'Monday', 'Wednesday', 'Friday'].map(
    (serviceDay) => {
      const highest = branchRecords
        .filter((record) => record.service === serviceDay)
        .reduce(
          (currentHighest, record) =>
            !currentHighest || record.total > currentHighest.total
              ? record
              : currentHighest,
          null,
        );
      return {
        service: serviceDay,
        ...(highest ?? serviceRecordSamples[serviceDay]),
        isSample: !highest,
      };
    },
  );
  const weeklyRecords = branchRecords
    .filter((record) => {
      const recordDate = new Date(`${record.date}T12:00:00`);
      return recordDate >= weekStart && recordDate <= weekEnd;
    })
    .sort((first, second) => first.date.localeCompare(second.date));

  function changeFigure(event) {
    const { name, value } = event.target;
    setFigures((current) => ({ ...current, [name]: value.replace(/\D/g, '') }));
    setError('');
    setSuccess(null);
  }

  function reviewAttendance(event) {
    event.preventDefault();
    if (!service) {
      setError(
        'No service on this day. Choose Sunday, Monday, Wednesday or Friday.',
      );
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
      setError(
        'Attendance has already been sent for this branch, date and service.',
      );
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
    setIsEntryOpen(false);
    setSuccess({
      id: Date.now(),
      message: `${service} attendance was sent for ${formatDate(date)}.`,
    });
    setError('');
  }

  return (
    <AdminLayout workspace='branch-media-admin' pageTitle='Attendance'>
      <section
        className='attendance-page'
        aria-label={`${user.branch} attendance`}
      >
        {success && <Toast key={success.id} message={success.message} />}
        <header
          className='attendance-page-heading'
          aria-labelledby='attendance-page-title'
        >
          <h1 id='attendance-page-title'>Branch Attendance</h1>
          <span>
            Record and review weekly service attendance for {user.branch}.
          </span>
        </header>
        <section
          className='attendance-record-summary'
          aria-label='Highest attendance by service day'
        >
          {serviceRecords.map((record) => (
            <article className='attendance-stat-card' key={record.service}>
              <span className='attendance-stat-icon'>
                <Trophy size={18} aria-hidden='true' />
              </span>
              <div>
                <p>Highest attendance {record.service}</p>
                <strong>{record.total.toLocaleString()}</strong>
                <span>
                  {record.isSample ? 'Temporary sample · ' : 'Record set '}
                  {formatDate(record.date, {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </article>
          ))}
        </section>
        <div className='attendance-entry-launch'>
          <button
            className='attendance-record-button'
            type='button'
            onClick={() => {
              setIsEntryOpen(true);
              setShowConfirmation(false);
              setError('');
            }}
          >
            <Plus size={17} aria-hidden='true' />
            Record attendance
          </button>
        </div>
        {isEntryOpen && (
          <div
            className='attendance-modal-backdrop'
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setIsEntryOpen(false);
            }}
          >
            <form
              className='attendance-entry-panel'
              onSubmit={reviewAttendance}
              noValidate
              role='dialog'
              aria-modal='true'
              aria-labelledby='attendance-entry-title'
            >
              <header className='attendance-entry-title'>
                <div>
                  <h1 id='attendance-entry-title'>Record attendance</h1>
                  <p>
                    {user.branch} · enter 0 for any group with no attendance.
                  </p>
                </div>
                <button
                  className='attendance-modal-close'
                  type='button'
                  aria-label='Close attendance form'
                  onClick={() => setIsEntryOpen(false)}
                >
                  <X size={19} aria-hidden='true' />
                </button>
              </header>
              {showConfirmation ? (
                <section
                  className='attendance-confirmation'
                  aria-labelledby='attendance-confirmation-title'
                >
                  <div className='attendance-confirmation-heading'>
                    <span>Review before sending</span>
                    <h2 id='attendance-confirmation-title'>
                      Confirm attendance
                    </h2>
                    <p>
                      {user.branch} · {formatDate(date)} · {service} service
                    </p>
                  </div>
                  <dl className='attendance-confirmation-counts'>
                    {attendanceGroups.map(({ key, label }) => (
                      <div key={key}>
                        <dt>{label}</dt>
                        <dd>{Number(figures[key])}</dd>
                      </div>
                    ))}
                    <div className='attendance-confirmation-total'>
                      <dt>Total</dt>
                      <dd>{membersTotal}</dd>
                    </div>
                  </dl>
                  <div className='attendance-confirmation-actions'>
                    <button
                      className='attendance-edit-button'
                      type='button'
                      onClick={() => setShowConfirmation(false)}
                    >
                      Edit
                    </button>
                    <button
                      className='attendance-send-button'
                      type='button'
                      onClick={confirmAttendance}
                    >
                      <Check size={17} aria-hidden='true' />
                      Confirm
                    </button>
                  </div>
                </section>
              ) : (
                <>
                  <div className='attendance-date-service-row'>
                    <label className='attendance-date-field'>
                      <span className='attendance-date-service-label'>
                        Service date
                      </span>
                      <span className='attendance-date-input'>
                        <CalendarDays size={17} aria-hidden='true' />
                        <input
                          type='date'
                          value={date}
                          max={getToday()}
                          onChange={(event) => {
                            setDate(event.target.value);
                            setError('');
                            setSuccess(null);
                          }}
                          required
                        />
                      </span>
                    </label>
                    <div className='attendance-service-field'>
                      <span className='attendance-date-service-label'>
                        Service
                      </span>
                      <div
                        className={`attendance-service-chip${service ? '' : ' is-unavailable'}`}
                        aria-live='polite'
                      >
                        <strong>
                          {service
                            ? `${service} service`
                            : 'No service on this day'}
                        </strong>
                      </div>
                    </div>
                  </div>
                  <fieldset className='attendance-groups-fieldset'>
                    <legend>Attendance counts</legend>
                    <div className='attendance-groups-grid'>
                      {attendanceGroups.map(({ key, label, icon: Icon }) => (
                        <label className='attendance-count-field' key={key}>
                          <span
                            className={`attendance-count-icon attendance-count-icon-${key}`}
                          >
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
                  <div className='attendance-members-total' aria-live='polite'>
                    <span>Total attendance</span>
                    <strong>{membersTotal}</strong>
                  </div>
                  {error && (
                    <p className='attendance-validation-message' role='alert'>
                      {error}
                    </p>
                  )}
                  {alreadySent && !success && (
                    <p className='attendance-validation-message' role='alert'>
                      Attendance has already been sent for this branch, date and
                      service.
                    </p>
                  )}
                  <button
                    className='attendance-send-button'
                    type='submit'
                    disabled={!service || alreadySent}
                  >
                    <Check size={17} aria-hidden='true' />
                    Send attendance
                  </button>
                </>
              )}
            </form>
          </div>
        )}

        <section
          className='attendance-week-history'
          aria-labelledby='attendance-history-title'
        >
          <header>
            <div>
              <p>WEEKLY HISTORY</p>
              {/* <h2 id='attendance-history-title'>This week</h2> */}
            </div>
            <span>
              {formatCalendarDate(weekStart)} – {formatCalendarDate(weekEnd)}
            </span>
          </header>
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
                      <td className='attendance-history-total'>
                        {record.total}
                      </td>
                      <td>
                        <span
                          className={`attendance-history-status${record.status === 'Delivered' ? ' is-delivered' : ' is-pending'}`}
                        >
                          {record.status === 'Delivered' ? (
                            <ShieldCheck size={14} aria-hidden='true' />
                          ) : (
                            <Clock3 size={14} aria-hidden='true' />
                          )}
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className='attendance-history-empty'>
              No attendance records for your branch this week.
            </p>
          )}
        </section>
      </section>
    </AdminLayout>
  );
}
