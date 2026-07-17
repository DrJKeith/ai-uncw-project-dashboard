import { useEffect } from 'react'
import dataSource from './data/current.json'
import type { DashboardData } from './types'
import { AppShell, useRoute } from './components/AppShell'
import {
  AboutPage,
  AccomplishmentsPage,
  DecisionsPage,
  NotFoundPage,
  OverviewPage,
  ReportsPage,
  RisksPage,
  RoadmapPage,
  WorkstreamsPage,
} from './pages'

const data = dataSource as DashboardData

export default function App() {
  const route = useRoute()
  const [page, detail] = route.split('/')

  useEffect(() => {
    const labels: Record<string, string> = {
      overview: data.metadata.title,
      accomplishments: 'Accomplishments',
      workstreams: 'Workstreams',
      roadmap: 'Roadmap',
      risks: 'Risks',
      decisions: 'Decisions and support needed',
      reports: 'Progress reports',
      about: 'About this record',
    }
    document.title = `${labels[page] ?? 'Page not found'} · AI@UNCW`
  }, [page])

  const content = (() => {
    switch (page) {
      case 'overview': return <OverviewPage data={data} />
      case 'accomplishments': return <AccomplishmentsPage data={data} selectedId={detail} />
      case 'workstreams': return <WorkstreamsPage data={data} selectedId={detail} />
      case 'roadmap': return <RoadmapPage data={data} selectedId={detail} />
      case 'risks': return <RisksPage data={data} selectedId={detail} />
      case 'decisions': return <DecisionsPage data={data} />
      case 'reports': return <ReportsPage data={data} selectedId={detail} />
      case 'about': return <AboutPage data={data} />
      default: return <NotFoundPage />
    }
  })()

  return <AppShell route={route}>{content}</AppShell>
}
