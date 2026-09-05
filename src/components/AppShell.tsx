import { useEffect, useState, type ReactNode } from 'react'
import dataSource from '../data/current.json'
import type { DashboardData } from '../types'
import { formatDate } from '../lib'

const data = dataSource as DashboardData

export const navigation = [
  ['overview', 'Overview'],
  ['accomplishments', 'Accomplishments'],
  ['workstreams', 'Workstreams'],
  ['roadmap', 'Roadmap'],
  ['risks', 'Risks'],
  ['decisions', 'Decisions'],
  ['reports', 'Reports'],
] as const

export function useRoute() {
  const read = () => window.location.hash.replace(/^#\/?/, '') || 'overview'
  const [route, setRoute] = useState(read)

  useEffect(() => {
    const update = () => {
      setRoute(read())
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])

  return route
}

export function ContextLine() {
  return (
    <dl className="context-line" aria-label="Dashboard source context">
      <div><dt>As of</dt><dd>{formatDate(data.metadata.asOf)}</dd></div>
      <div><dt>Reporting period</dt><dd>{data.metadata.reportingPeriod}</dd></div>
      <div><dt>Source basis</dt><dd>{data.metadata.sourceBasis}</dd></div>
    </dl>
  )
}

export function AppShell({ route, children }: { route: string; children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const active = route.split('/')[0]
  const activeLabel = navigation.find(([slug]) => slug === active)?.[1] ?? (active === 'about' ? 'About this record' : 'Overview')

  useEffect(() => setMenuOpen(false), [route])

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <aside className="public-sidebar">
        <a className="public-brand" href="#/overview"><span>AI Hub</span><small>GAABS · UNCW</small></a>
        <p className="public-label"><span aria-hidden="true" /> Approved public record</p>
        <nav className="public-nav" aria-label="Primary">
          {navigation.map(([slug, label]) => (
            <a key={slug} href={`#/${slug}`} aria-current={active === slug ? 'page' : undefined}>{label}</a>
          ))}
          <a href="#/about" aria-current={active === 'about' ? 'page' : undefined}>About this record</a>
        </nav>
        <p className="public-sidebar-note">The AI Hub coordinates.<br />GAABS builds.</p>
      </aside>
      <div className="public-main-shell">
        <header className="public-topbar">
          <p>Public dashboard <span>/</span> <strong>{activeLabel}</strong></p>
        <button
          className="menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((value) => !value)}
        >
          Menu
        </button>
        <nav id="primary-navigation" className={menuOpen ? 'mobile-nav is-open' : 'mobile-nav'} aria-label="Mobile primary">
          {navigation.map(([slug, label]) => (
            <a key={slug} href={`#/${slug}`} aria-current={active === slug ? 'page' : undefined}>{label}</a>
          ))}
          <a href="#/about" aria-current={active === 'about' ? 'page' : undefined}>About this record</a>
        </nav>
        </header>
        <main id="main-content" tabIndex={-1}>{children}</main>
        <footer className="site-footer">
          <p>Questions or comments? Contact <a href="mailto:ai@uncw.edu">AI@UNCW</a>.</p>
          <p>Approved public summary · Updated {formatDate(data.metadata.asOf)}</p>
        </footer>
      </div>
    </div>
  )
}
