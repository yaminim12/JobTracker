import { ArrowLeft, ExternalLink, FilePenLine, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import api, { getApiError } from '../api/axios'
import StatusBadge from '../components/StatusBadge'
import { ErrorState, LoadingState } from '../components/States'
import {
  formatCurrency,
  formatDate,
  formatTime,
  jobTypes,
  labelFor,
} from '../utils/helpers'

export default function ApplicationDetailPage() {
  const { id } = useParams()
  const [application, setApplication] = useState(null)
  const [interviews, setInterviews] = useState([])
  const [error, setError] = useState('')

  const load = async () => {
    setError('')
    try {
      const [applicationResponse, interviewResponse] = await Promise.all([
        api.get('applications/' + id + '/'),
        api.get('interviews/', { params: { application: id } }),
      ])
      setApplication(applicationResponse.data)
      setInterviews(interviewResponse.data.results || interviewResponse.data)
    } catch (requestError) {
      setError(getApiError(requestError))
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => load(), 0)
    return () => window.clearTimeout(timeoutId)
  }, [id])

  if (!application && !error) return <LoadingState label="Loading application details" />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div className="page narrow-page">
      <Link className="back-link" to="/applications"><ArrowLeft size={16} /> Back to applications</Link>
      <div className="detail-heading">
        <div>
          <p className="eyebrow">{application.company_name}</p>
          <h1>{application.job_title}</h1>
          <p className="detail-location"><MapPin size={16} /> {application.job_location || 'Location not set'}</p>
        </div>
        <div className="detail-actions">
          <StatusBadge status={application.status} />
          <Link className="button button-secondary" to={'/applications/' + application.id + '/edit'}><FilePenLine size={16} /> Edit</Link>
        </div>
      </div>

      <section className="detail-grid">
        <div className="detail-block">
          <span>Applied</span>
          <strong>{formatDate(application.applied_date)}</strong>
        </div>
        <div className="detail-block">
          <span>Job type</span>
          <strong>{labelFor(jobTypes, application.job_type)}</strong>
        </div>
        <div className="detail-block">
          <span>Salary</span>
          <strong>{formatCurrency(application.salary)}</strong>
        </div>
        <div className="detail-block">
          <span>Job link</span>
          {application.job_url ? <a href={application.job_url} target="_blank" rel="noreferrer">Open listing <ExternalLink size={14} /></a> : <strong>Not added</strong>}
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading"><h2>Notes</h2></div>
        <p className="notes-copy">{application.notes || 'No notes added yet.'}</p>
      </section>

      <section className="content-section">
        <div className="section-heading"><h2>Interviews</h2><Link className="text-link" to="/interviews">Manage interviews</Link></div>
        {interviews.length === 0 ? <p className="muted-copy">No interviews have been scheduled for this application.</p> : (
          <div className="timeline-list">
            {interviews.map((interview) => (
              <div className="timeline-row" key={interview.id}>
                <span className="timeline-date">{formatDate(interview.interview_date)}</span>
                <span><strong>{interview.interview_type}</strong><small>{formatTime(interview.interview_time)}{interview.interviewer ? ' · ' + interview.interviewer : ''}</small></span>
                <StatusBadge status={interview.status} kind="interview" />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
