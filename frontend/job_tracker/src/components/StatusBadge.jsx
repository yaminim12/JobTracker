import { labelFor, applicationStatuses, interviewStatuses } from '../utils/helpers'

export default function StatusBadge({ status, kind = 'application' }) {
  const options = kind === 'interview' ? interviewStatuses : applicationStatuses
  return <span className={`status-badge status-${status}`}>{labelFor(options, status)}</span>
}
