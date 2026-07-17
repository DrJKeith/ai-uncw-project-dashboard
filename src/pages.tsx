import { useMemo, useState } from 'react'
import { ContextLine } from './components/AppShell'
import { SourceNote, StatusLabel } from './components/StatusLabel'
import { formatDate, reportHref, statusClass } from './lib'
import type { DashboardData } from './types'

function PageHeader({ title, intro }: { title: string; intro?: string }) {
  return (
    <header className="page-header">
      <h1>{title}</h1>
      {intro && <p className="page-intro">{intro}</p>}
      <ContextLine />
    </header>
  )
}

export function OverviewPage({ data }: { data: DashboardData }) {
  const critical = data.risks.find((risk) => risk.severity === 'Critical')
  return (
    <>
      <section className="overview-hero page-width">
        <PageHeader title={data.metadata.title} />
        <div className="overview-grid">
          <div>
            <h2>Executive summary</h2>
            <p className="lead">{data.executiveSummary}</p>
          </div>
          <div className="priority-ledger">
            <h2>Current priorities</h2>
            <ol>{data.priorities.map((priority) => <li key={priority}>{priority}</li>)}</ol>
          </div>
        </div>
        {critical && (
          <a className="attention-rail critical" href={`#/risks/${critical.id}`}>
            <span className="attention-label">Critical risk</span>
            <strong>{critical.statement}</strong>
            <span>{critical.mitigation}</span>
          </a>
        )}
      </section>

      <section className="page-width recent-section">
        <div className="section-heading-row">
          <h2>Recent accomplishments</h2>
          <a href="#/accomplishments">View cumulative record</a>
        </div>
        <div className="open-record-list">
          {data.accomplishments.slice(0, 3).map((item) => (
            <a className="overview-record" href={`#/accomplishments/${item.id}`} key={item.id}>
              <time dateTime={item.date}>{formatDate(item.date)}</time>
              <span><strong>{item.title}</strong><small>{item.value}</small></span>
              <span>{item.workstream}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="identity-band">
        <div className="page-width">
          <h2>{data.metadata.identity}</h2>
          <p>{data.metadata.subidentity}</p>
          <p className="public-notice">{data.metadata.publicNotice}</p>
        </div>
      </section>
    </>
  )
}

export function AccomplishmentsPage({ data, selectedId }: { data: DashboardData; selectedId?: string }) {
  const [query, setQuery] = useState('')
  const [workstream, setWorkstream] = useState('all')
  const [view, setView] = useState<'recent' | 'cumulative'>('recent')
  const records = useMemo(() => data.accomplishments.filter((item) => {
    const searchable = `${item.title} ${item.description} ${item.value}`.toLowerCase()
    return searchable.includes(query.toLowerCase()) && (workstream === 'all' || item.workstream === workstream)
  }), [data.accomplishments, query, workstream])

  return (
    <div className="page-width page-section">
      <PageHeader title="Accomplishments" intro="Approved public records of progress and institutional value." />
      <div className="filter-bar" role="search">
        <label>Search records<input value={query} onChange={(event) => setQuery(event.target.value)} type="search" /></label>
        <label>Workstream<select value={workstream} onChange={(event) => setWorkstream(event.target.value)}><option value="all">All workstreams</option>{data.workstreams.map((item) => <option key={item.id}>{item.name}</option>)}</select></label>
        <button type="button" onClick={() => { setQuery(''); setWorkstream('all') }}>Clear filters</button>
      </div>
      <div className="view-tabs" role="group" aria-label="Record scope">
        <button className={view === 'recent' ? 'active' : ''} onClick={() => setView('recent')}>Recent period</button>
        <button className={view === 'cumulative' ? 'active' : ''} onClick={() => setView('cumulative')}>Cumulative record</button>
      </div>
      <p className="results-count" aria-live="polite">{records.length} {records.length === 1 ? 'record' : 'records'}</p>
      <div className="record-table accomplishment-table">
        <div className="record-table-header" aria-hidden="true"><span>Date</span><span>Accomplishment</span><span>Workstream</span><span>Status</span></div>
        {records.map((item) => {
          const expanded = item.id === selectedId
          return (
            <article className={expanded ? 'record-row is-selected' : 'record-row'} key={item.id} id={item.id}>
              <a className="record-summary" href={`#/accomplishments/${expanded ? '' : item.id}`} aria-expanded={expanded}>
                <time dateTime={item.date}>{formatDate(item.date)}</time>
                <strong>{item.title}</strong>
                <span>{item.workstream}</span>
                <StatusLabel status={item.status} />
              </a>
              {expanded && <div className="record-detail"><p>{item.description}</p><h3>Institutional value</h3><p>{item.value}</p><SourceNote reportId={item.reportId} sourceStatus={item.sourceStatus} /></div>}
            </article>
          )
        })}
      </div>
      {records.length === 0 && <p className="empty-state">No approved records match these filters.</p>}
    </div>
  )
}

export function WorkstreamsPage({ data, selectedId }: { data: DashboardData; selectedId?: string }) {
  const selected = data.workstreams.find((item) => item.id === selectedId) ?? data.workstreams[0]
  const related = data.accomplishments.filter((item) => selected.recentAccomplishmentIds.includes(item.id))
  return (
    <div className="page-width page-section">
      <PageHeader title="Workstreams" intro="Six coordinated areas of institutional AI capability and responsible implementation." />
      <div className="split-ledger">
        <nav className="workstream-index" aria-label="Workstreams">
          {data.workstreams.map((item) => <a className={item.id === selected.id ? 'is-selected' : ''} href={`#/workstreams/${item.id}`} key={item.id}><span>{item.name}</span><StatusLabel status={item.status} /></a>)}
        </nav>
        <article className="detail-ledger">
          <p className="eyeline">Public summary · {selected.sourceStatus}</p>
          <h2>{selected.name}</h2>
          <dl>
            <div><dt>Current status</dt><dd><StatusLabel status={selected.status} /></dd></div>
            <div><dt>Current focus</dt><dd>{selected.currentFocus}</dd></div>
            <div><dt>Next milestone</dt><dd>{selected.nextMilestone}</dd></div>
            <div><dt>Dependencies</dt><dd>{selected.dependencies}</dd></div>
            <div><dt>Target timing</dt><dd>{selected.targetTiming}</dd></div>
            <div><dt>Last report with update</dt><dd><a href={`#/reports/${selected.reportId}`}>{selected.reportId}</a></dd></div>
          </dl>
          <h3>Recent accomplishments</h3>
          {related.length ? <ul className="plain-link-list">{related.map((item) => <li key={item.id}><a href={`#/accomplishments/${item.id}`}>{item.title}</a></li>)}</ul> : <p>No public accomplishment is recorded for this workstream in the current snapshot.</p>}
        </article>
      </div>
    </div>
  )
}

export function RoadmapPage({ data }: { data: DashboardData; selectedId?: string }) {
  return (
    <div className="page-width page-section">
      <PageHeader title="Roadmap" intro="Now, Next, and Later reflect approved status language, not inferred completion." />
      <div className="roadmap-grid">
        {(['Now', 'Next', 'Later'] as const).map((horizon) => (
          <section key={horizon}>
            <h2>{horizon}</h2>
            <div className="roadmap-band">
              {data.milestones.filter((item) => item.horizon === horizon).map((item) => (
                <article key={item.id} id={item.id}>
                  <StatusLabel status={item.status} />
                  <h3>{item.title}</h3>
                  <p>{item.workstream} · {item.timing}</p>
                  <dl><dt>Dependency</dt><dd>{item.dependency}</dd></dl>
                  <SourceNote reportId={item.reportId} sourceStatus={item.sourceStatus} />
                </article>
              ))}
              <p className="omission-note">Omission from a newer report does not change an item’s status.</p>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

export function RisksPage({ data, selectedId }: { data: DashboardData; selectedId?: string }) {
  return (
    <div className="page-width page-section">
      <PageHeader title="Blockers, risks, and dependencies" intro="Only material, public-facing issues are included here." />
      <div className="risk-list">
        {data.risks.map((risk) => (
          <article className={`risk-row severity-${statusClass(risk.severity)} ${selectedId === risk.id ? 'is-selected' : ''}`} key={risk.id} id={risk.id}>
            <header><span className="severity-label">{risk.severity}</span><h2>{risk.statement}</h2></header>
            <div><p><strong>Workstream</strong><br />{risk.workstream}</p><p><strong>Mitigation</strong><br />{risk.mitigation}</p><p><strong>Supervisor attention</strong><br />{risk.attention ? 'Yes' : 'No'}</p></div>
            <SourceNote reportId={risk.reportId} sourceStatus={risk.sourceStatus} />
          </article>
        ))}
      </div>
    </div>
  )
}

export function DecisionsPage({ data }: { data: DashboardData }) {
  const actionItems = data.decisions.filter((item) => item.publicClassification === 'Action requested')
  const awareness = data.decisions.filter((item) => item.publicClassification === 'For awareness')
  return (
    <div className="page-width page-section">
      <PageHeader title="Decisions and support needed" intro="Public action requests are separated from informational updates." />
      <section className="decision-section"><h2>Action requested</h2>{actionItems.length ? actionItems.map((item) => <DecisionRow key={item.id} item={item} />) : <p className="empty-state">No decision or support request is approved for public display in the current snapshot.</p>}</section>
      <section className="decision-section awareness"><h2>For awareness</h2>{awareness.length ? awareness.map((item) => <DecisionRow key={item.id} item={item} />) : <p className="empty-state">Internal deliberations and private support requests are intentionally excluded from this public dashboard.</p>}</section>
    </div>
  )
}

function DecisionRow({ item }: { item: DashboardData['decisions'][number] }) {
  return <article className="decision-row"><h3>{item.request}</h3><dl><div><dt>Why it matters</dt><dd>{item.why}</dd></div><div><dt>Timing</dt><dd>{item.timing}</dd></div><div><dt>Status</dt><dd>{item.status}</dd></div></dl></article>
}

export function ReportsPage({ data, selectedId }: { data: DashboardData; selectedId?: string }) {
  const selected = data.reports.find((item) => item.id === selectedId)
  return (
    <div className="page-width page-section">
      <PageHeader title="Progress reports" intro="An immutable archive of the approved public summaries incorporated into this dashboard." />
      {!selected ? (
        <div className="report-index">
          {data.reports.map((report) => <a href={`#/reports/${report.id}`} key={report.id}><time dateTime={report.date}>{formatDate(report.date)}</time><span><strong>{report.period}</strong><small>{report.summary}</small></span><span>{report.sourceBasis}</span></a>)}
        </div>
      ) : (
        <article className="report-detail">
          <a className="back-link" href="#/reports">← All reports</a>
          <h2>{selected.period}</h2>
          <dl className="report-meta"><div><dt>Report date</dt><dd>{formatDate(selected.date)}</dd></div><div><dt>Source basis</dt><dd>{selected.sourceBasis}</dd></div><div><dt>Approved public scope</dt><dd>{selected.approval.scope}</dd></div></dl>
          <h3>Executive summary</h3><p className="lead">{selected.summary}</p>
          <h3>Dashboard changes</h3><ul>{selected.changes.map((change) => <li key={change}>{change}</li>)}</ul>
          <p><a className="button-link" href={reportHref(selected.publicReportPath)}>Open complete public report (Markdown)</a></p>
          <p className="source-note">Approved by {selected.approval.approvedBy} on {formatDate(selected.approval.approvedOn)}. This approval covers only the public-safe summary.</p>
        </article>
      )}
    </div>
  )
}

export function AboutPage({ data }: { data: DashboardData }) {
  return (
    <div className="page-width page-section narrow-page">
      <PageHeader title="About this record" />
      <h2>Purpose</h2><p>This is a durable public progress record for The AI Hub and GAABS. It is not an operational workspace.</p>
      <h2>Source boundary</h2><p>{data.metadata.publicNotice}</p>
      <h2>Manual updates only</h2><p>The dashboard changes only after Julian manually supplies a progress report, reviews the proposed public changes, and explicitly approves application. A push to <code>main</code> redeploys the already-approved repository state; it does not collect or import new information.</p>
      <h2>Privacy</h2><p>Internal deliberations, confidential stakeholder notes, private personnel information, and unapproved claims are excluded from the repository and the site. No analytics, cookies, trackers, external APIs, or live data connections are used.</p>
      <h2>Initiative identity</h2><p><strong>{data.metadata.identity}</strong> {data.metadata.subidentity}</p>
    </div>
  )
}

export function NotFoundPage() {
  return <div className="page-width page-section narrow-page"><PageHeader title="Page not found" /><p>The requested dashboard record does not exist.</p><p><a href="#/overview">Return to the overview</a></p></div>
}
