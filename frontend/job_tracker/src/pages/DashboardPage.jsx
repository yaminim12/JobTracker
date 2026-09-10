import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  CircleDot,
  CircleX,
  Clock3,
  SearchCheck,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import api, { getApiError } from '../api/axios'
import StatusBadge from '../components/StatusBadge'
import { ErrorState, LoadingState } from '../components/States'
import { formatDate, formatTime } from '../utils/helpers'

const cards = [
  ['total_applications', 'Total applications', BriefcaseBusiness],
  ['applied', 'Applied', CircleDot],
  ['shortlisted', 'Shortlisted', SearchCheck],
  ['interview', 'Interviewing', CalendarClock],
  ['selected', 'Selected', CheckCircle2],
  ['rejected', 'Rejected', CircleX],
]

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null)
  const [error, setError] = useState('')

  const loadDashboard = async () => {
    setError('')
    try {
      const { data } = await api.get('dashboard/')
      setDashboard(data)
    } catch (requestError) {
      setError(getApiError(requestError))
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => loadDashboard(), 0)
    return () => window.clearTimeout(timeoutId)
  }, [])

  if (!dashboard && !error) return <LoadingState label="Loading your overview" />
  if (error) return <ErrorState message={error} onRetry={loadDashboard} />

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Your search</p>
          <h1>Overview</h1>
        </div>
        <Link className="button button-primary" to="/applications/add">
          <BriefcaseBusiness size={17} /> Add application
        </Link>
      </div>

      <section className="stat-grid" aria-label="Application statistics">
        {cards.map(([key, label, Icon]) => (
          <article className={`stat-card stat-${key}`} key={key}>
            <span className="stat-icon"><Icon size={19} /></span>
            <span className="stat-label">{label}</span>
            <strong>{dashboard.statistics[key] || 0}</strong>
          </article>
        ))}
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <h2>Recent applications</h2>
              <p>Newest additions to your tracker.</p>
            </div>
            <Link className="text-link" to="/applications">View all <ArrowRight size={15} /></Link>
          </div>
          {dashboard.recent_applications.length === 0 ? (
            <div className="compact-empty">Your next application will appear here.</div>
          ) : (
            <div className="activity-list">
              {dashboard.recent_applications.map((application) => (
                <Link to={`/applications/${application.id}`} className="activity-row" key={application.id}>
                  <span className="company-monogram">{application.company_name.slice(0, 1)}</span>
                  <span className="activity-copy">
                    <strong>{application.company_name}</strong>
                    <small>{application.job_title} · {formatDate(application.applied_date)}</small>
                  </span>
                  <StatusBadge status={application.status} />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="panel">
          <div className="panel-heading">
            <div>
              <h2>Upcoming interviews</h2>
              <p>Keep your next conversations in view.</p>
            </div>
            <Link className="text-link" to="/interviews">View all <ArrowRight size={15} /></Link>
          </div>
          {dashboard.upcoming_interviews.length === 0 ? (
            <div className="compact-empty">No interviews scheduled yet.</div>
          ) : (
            <div className="interview-list">
              {dashboard.upcoming_interviews.map((interview) => (
                <div className="interview-row" key={interview.id}>
                  <span className="date-chip"><strong>{new Date(interview.interview_date + 'T00:00:00').getDate()}</strong><small>{new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(interview.interview_date + 'T00:00:00'))}</small></span>
                  <span className="activity-copy">
                    <strong>{interview.company_name}</strong>
                    <small>{interview.job_title} · {formatTime(interview.interview_time)}</small>
                  </span>
                  <span className="interview-type"><Clock3 size={14} /> {interview.interview_type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
