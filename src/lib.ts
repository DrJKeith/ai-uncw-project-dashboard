import type { Status } from './types'

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`))

export const statusClass = (status: Status | string) =>
  status.toLowerCase().replaceAll(' ', '-').replaceAll('/', '-')

export const reportHref = (path: string) => {
  const file = path.split('/').at(-1)
  return `${import.meta.env.BASE_URL}reports/${file}`
}
