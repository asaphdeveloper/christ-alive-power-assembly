import { useMemo, useState } from 'react';
import { Check, ChevronDown, RotateCcw } from 'lucide-react';
import { AdminLayout } from '../../AdminLayout';
import { AttendanceKpis } from '../../../../components/Admin/AttendanceKpis';
import { AttendanceTrendCard } from '../../../../components/Admin/AttendanceTrendCard';
import { BranchComparisonCard } from '../../../../components/Admin/BranchComparisonCard';
import attendanceConfig from '../../../../data/general-overseer-attendance.json';
import branchData from '../../../../data/branches.json';
import './AttendancePage.css';

const {
  records: attendanceData,
  groups: groupOptions,
  serviceDays,
} = attendanceConfig;
const services = serviceDays;
const serviceOrder = ['Sunday', 'Monday', 'Wednesday', 'Friday'];
const serviceDisplayNames = {
  Sunday: 'Sunday Service',
  Monday: 'Monday Prayers',
  Wednesday: 'Wednesday Bible Study',
  Friday: 'Friday Prayer Meeting',
};
const orderedBranchData = [...branchData].sort((first, second) => {
  const firstIsHeadquarter = /headquarter/i.test(first.name);
  const secondIsHeadquarter = /headquarter/i.test(second.name);
  return Number(secondIsHeadquarter) - Number(firstIsHeadquarter);
});
const expressionOptions = orderedBranchData.map(({ name }) => {
  const expressionName = /headquarter/i.test(name)
    ? 'Headquater'
    : name.replace(/ branch$/i, '');
  return {
    value: name,
    label: `${expressionName} expression`,
  };
});
const branches = ['All branches', ...orderedBranchData.map(({ name }) => name)];
const getExpressionLabel = (name) =>
  name === 'All branches'
    ? 'All expressions'
    : (expressionOptions.find((option) => option.value === name)?.label ??
      name);
const getValue = (record, key) =>
  key === 'total'
    ? record.men + record.women + record.youth + record.children
    : record[key];

export function GeneralOverseerAttendancePage() {
  const [branch, setBranch] = useState('All branches');
  const [service, setService] = useState(serviceDays[0]);
  const [group, setGroup] = useState('total');
  const [openFilter, setOpenFilter] = useState('');
  const latestDate = attendanceData.reduce(
    (latest, record) => (record.date > latest ? record.date : latest),
    '',
  );
  const latestWeekRecords = attendanceData.filter((record) => {
    const recordDate = new Date(`${record.date}T12:00:00`);
    const latest = new Date(`${latestDate}T12:00:00`);
    const mondayOffset = (latest.getDay() + 6) % 7;
    const weekStart = new Date(latest);
    weekStart.setDate(latest.getDate() - mondayOffset);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return recordDate >= weekStart && recordDate <= weekEnd;
  });
  const branchWeekRecords = useMemo(
    () =>
      latestWeekRecords
        .filter(
          (record) => branch === 'All branches' || record.branch === branch,
        )
        .sort(
          (first, second) =>
            serviceOrder.indexOf(first.service) -
              serviceOrder.indexOf(second.service) ||
            first.date.localeCompare(second.date),
        ),
    [branch, latestWeekRecords],
  );
  const filteredData = useMemo(
    () => branchWeekRecords.filter((record) => record.service === service),
    [branchWeekRecords, service],
  );
  const comparisonRecords = useMemo(
    () => latestWeekRecords.filter((record) => record.service === service),
    [service, latestWeekRecords],
  );
  const totals = useMemo(
    () =>
      groupOptions.map(({ key, label, color }) => ({
        key,
        label,
        color,
        value: filteredData.reduce(
          (sum, record) => sum + getValue(record, key),
          0,
        ),
      })),
    [filteredData],
  );

  const trendPoints = serviceOrder.map((serviceName) => {
    const serviceRecords = branchWeekRecords.filter(
      (record) => record.service === serviceName,
    );
    return {
      service: serviceName,
      records: serviceRecords,
    };
  });

  const trendData = {
    labels: trendPoints.map(
      (point) => serviceDisplayNames[point.service] ?? point.service,
    ),
    datasets: [
      {
        label: groupOptions.find((item) => item.key === group)?.label,
        data: trendPoints.map((point) =>
          point.records.reduce(
            (sum, record) => sum + getValue(record, group),
            0,
          ),
        ),
        borderColor: groupOptions.find((item) => item.key === group)?.color,
        backgroundColor: `${groupOptions.find((item) => item.key === group)?.color}24`,
        borderWidth: 2.5,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBorderWidth: 2,
        pointBackgroundColor: '#fff',
        pointBorderColor: groupOptions.find((item) => item.key === group)
          ?.color,
        fill: true,
        tension: 0.35,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' },
    plugins: {
      legend: { display: false },
      tooltip: {
        padding: 11,
        callbacks: {
          label: (item) =>
            `${item.dataset.label}: ${item.formattedValue} people`,
        },
      },
    },
    scales: {
      x: {
        offset: false,
        grid: { display: false },
        ticks: {
          color: '#7b8981',
          align: 'inner',
          maxRotation: 0,
          autoSkip: false,
          font: { size: 12, weight: 600 },
          padding: 8,
        },
        border: { display: false },
      },
      y: {
        beginAtZero: true,
        grid: { color: '#edf1ee' },
        ticks: {
          color: '#7b8981',
          precision: 0,
          font: { size: 12, weight: 600 },
        },
        border: { display: false },
      },
    },
  };

  const branchComparison = branches.slice(1).map((branchName) => ({
    branch: branchName,
    total: comparisonRecords
      .filter((record) => record.branch === branchName)
      .reduce((sum, record) => sum + getValue(record, group), 0),
  }));
  function resetFilters() {
    setBranch('All branches');
    setService(serviceDays[0]);
    setGroup('total');
    setOpenFilter('');
  }

  return (
    <AdminLayout workspace='general-overseer' pageTitle='Attendance overview'>
      <section
        className='general-overseer-page'
        aria-labelledby='general-overseer-title'
      >
        <header className='general-overseer-heading'>
          <div className='general-overseer-heading-copy'>
            <h1 id='general-overseer-title'>Attendance overview</h1>
            <p>Review Church's Attendance Across All Expressions.</p>
          </div>
          <section
            className='go-attendance-controls'
            aria-label='Attendance filters'
          >
            <div className='go-filter-control'>
              <button
                className='go-filter-button'
                type='button'
                aria-haspopup='menu'
                aria-expanded={openFilter === 'branch'}
                onClick={() =>
                  setOpenFilter(openFilter === 'branch' ? '' : 'branch')
                }
              >
                <span>{getExpressionLabel(branch)}</span>
                <ChevronDown size={15} aria-hidden='true' />
              </button>
              {openFilter === 'branch' && (
                <div
                  className='go-filter-menu'
                  role='menu'
                  aria-label='Expression filter'
                >
                  <button
                    className={`go-filter-option${branch === 'All branches' ? ' is-selected' : ''}`}
                    type='button'
                    role='menuitemradio'
                    aria-checked={branch === 'All branches'}
                    onClick={() => {
                      setBranch('All branches');
                      setOpenFilter('');
                    }}
                  >
                    <span>All expressions</span>
                    {branch === 'All branches' && (
                      <Check size={15} aria-hidden='true' />
                    )}
                  </button>
                  {expressionOptions.map(({ value, label }) => (
                    <button
                      className={`go-filter-option${branch === value ? ' is-selected' : ''}`}
                      type='button'
                      role='menuitemradio'
                      aria-checked={branch === value}
                      key={value}
                      onClick={() => {
                        setBranch(value);
                        setOpenFilter('');
                      }}
                    >
                      <span>{label}</span>
                      {branch === value && (
                        <Check size={15} aria-hidden='true' />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className='go-filter-control'>
              <button
                className='go-filter-button'
                type='button'
                aria-haspopup='menu'
                aria-expanded={openFilter === 'service'}
                onClick={() =>
                  setOpenFilter(openFilter === 'service' ? '' : 'service')
                }
              >
                <span>{service}</span>
                <ChevronDown size={15} aria-hidden='true' />
              </button>
              {openFilter === 'service' && (
                <div
                  className='go-filter-menu'
                  role='menu'
                  aria-label='Service filter'
                >
                  {services.map((item) => (
                    <button
                      className={`go-filter-option${service === item ? ' is-selected' : ''}`}
                      type='button'
                      role='menuitemradio'
                      aria-checked={service === item}
                      key={item}
                      onClick={() => {
                        setService(item);
                        setOpenFilter('');
                      }}
                    >
                      <span>{item}</span>
                      {service === item && (
                        <Check size={15} aria-hidden='true' />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className='go-filter-control'>
              <button
                className='go-filter-button'
                type='button'
                aria-haspopup='menu'
                aria-expanded={openFilter === 'group'}
                onClick={() =>
                  setOpenFilter(openFilter === 'group' ? '' : 'group')
                }
              >
                <span>
                  {groupOptions.find((item) => item.key === group)?.label}
                </span>
                <ChevronDown size={15} aria-hidden='true' />
              </button>
              {openFilter === 'group' && (
                <div
                  className='go-filter-menu'
                  role='menu'
                  aria-label='Attendance group filter'
                >
                  {groupOptions.map(({ key, label }) => (
                    <button
                      className={`go-filter-option${group === key ? ' is-selected' : ''}`}
                      type='button'
                      role='menuitemradio'
                      aria-checked={group === key}
                      key={key}
                      onClick={() => {
                        setGroup(key);
                        setOpenFilter('');
                      }}
                    >
                      <span>{label}</span>
                      {group === key && <Check size={15} aria-hidden='true' />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              className='go-filter-reset'
              type='button'
              onClick={resetFilters}
            >
              <RotateCcw size={14} aria-hidden='true' />
              <span>Reset filters</span>
            </button>
          </section>
        </header>

        <AttendanceKpis totals={totals} service={service} />

        <section
          className='go-report-comparison-row'
          aria-label='Expression comparison'
        >
          <BranchComparisonCard
            branchComparison={branchComparison}
            getExpressionLabel={getExpressionLabel}
            groupLabel={groupOptions.find((item) => item.key === group)?.label}
            service={service}
          />
        </section>

        <AttendanceTrendCard
          filteredData={filteredData}
          trendData={trendData}
          chartOptions={chartOptions}
          expressionLabel={getExpressionLabel(branch)}
          groupLabel={groupOptions.find((item) => item.key === group)?.label}
          service={service}
        />
      </section>
    </AdminLayout>
  );
}
