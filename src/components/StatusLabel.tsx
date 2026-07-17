import { statusClass } from '../lib'

export function StatusLabel({ status }: { status: string }) {
  return <span className={`status-label status-${statusClass(status)}`}><span aria-hidden="true" />{status}</span>
}

export function SourceNote({ reportId, sourceStatus }: { reportId: string; sourceStatus: string }) {
  return (
    <p className="source-note">
      Source: <a href={`#/reports/${reportId}`}>{reportId}</a> · {sourceStatus} · not live-verified
    </p>
  )
}
