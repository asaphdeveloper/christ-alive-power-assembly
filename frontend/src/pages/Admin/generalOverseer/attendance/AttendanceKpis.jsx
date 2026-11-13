export function AttendanceKpis({ totals, service }) {
  return (
    <section className='go-attendance-kpis' aria-label='Attendance totals'>
      {totals.map(({ key, label, color, value }) => (
        <article className='go-attendance-kpi' key={key}>
          <span className='go-kpi-dot' style={{ backgroundColor: color }} />
          <span>{label}</span>
          <strong>{value.toLocaleString()}</strong>
          <small>{service} service</small>
        </article>
      ))}
    </section>
  );
}
