import { CalendarPlus, FilePenLine, Link2, Plus, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import api, { getApiError } from '../api/axios'
import InterviewForm from '../components/InterviewForm'
import StatusBadge from '../components/StatusBadge'
import {
  ConfirmDialog,
  EmptyState,
  ErrorState,
  LoadingState,
} from '../components/States'
import {
  formatTime,
  interviewStatuses,
  labelFor,
} from '../utils/helpers'

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState(null)
  const [applications, setApplications] = useState([])
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [editor, setEditor] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)

  const load = async () => {
    setError('')
    try {
      const [interviewResponse, applicationResponse] = await Promise.all([
        api.get('interviews/', { params: status ? { status } : {} }),
        api.get('applications/'),
      ])
      setInterviews(interviewResponse.data.results || interviewResponse.data)
      setApplications(applicationResponse.data.results || applicationResponse.data)
    } catch (requestError) {
      setError(getApiError(requestError))
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => load(), 0)
    return () => window.clearTimeout(timeoutId)
  }, [status])

  const saveInterview = async (payload) => {
    setBusy(true)
    try {
      if (editor?.id) {
        await api.patch('interviews/' + editor.id + '/', payload)
      } else {
        await api.post('interviews/', payload)
      }
      setEditor(null)
      load()
    } catch (requestError) {
      setError(getApiError(requestError))
    } finally {
      setBusy(false)
    }
  }

  const removeInterview = async () => {
    setBusy(true)
    try {
      await api.delete('interviews/' + deleting.id + '/')
      setDeleting(null)
      load()
    } catch (requestError) {
      setError(getApiError(requestError))
      setDeleting(null)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Your calendar</p>
          <h1>Interviews</h1>
        </div>
        <button className="button button-primary" onClick={() => setEditor({})}>
          <Plus size={17} /> Schedule interview
        </button>
      </div>

      <section className="filter-row compact-filter">
        <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter interview status">
          <option value="">All interview statuses</option>
          {interviewStatuses.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
        </select>
      </section>

      {error && <ErrorState message={error} onRetry={load} />}
      {!interviews && !error && <LoadingState label="Loading interviews" />}
      {interviews && interviews.length === 0 && (
        <EmptyState
          title="No interviews found"
          message="Schedule an interview when an application moves forward."
          action={<button className="button button-primary" onClick={() => setEditor({})}><CalendarPlus size={16} /> Schedule interview</button>}
        />
      )}
      {interviews?.length > 0 && (
        <div className="interview-board">
          {interviews.map((interview) => (
            <article className="interview-card" key={interview.id}>
              <div className="interview-card-top">
                <span className="date-chip"><strong>{new Date(interview.interview_date + 'T00:00:00').getDate()}</strong><small>{new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(interview.interview_date + 'T00:00:00'))}</small></span>
                <div className="interview-card-actions">
                  <button className="icon-button" title="Edit interview" aria-label="Edit interview" onClick={() => setEditor(interview)}><FilePenLine size={16} /></button>
                  <button className="icon-button danger-icon" title="Delete interview" aria-label="Delete interview" onClick={() => setDeleting(interview)}><Trash2 size={16} /></button>
                </div>
              </div>
              <div>
                <p className="eyebrow">{interview.company_name}</p>
                <h2>{interview.job_title}</h2>
                <p className="interview-meta">{labelFor(interviewStatuses, interview.status)} · {formatTime(interview.interview_time)}</p>
              </div>
              <div className="interview-card-footer">
                <span>{interview.interview_type}</span>
                <StatusBadge status={interview.status} kind="interview" />
              </div>
              {interview.interviewer && <p className="interviewer-name">With {interview.interviewer}</p>}
              {interview.meeting_link && <a className="meeting-link" href={interview.meeting_link} target="_blank" rel="noreferrer"><Link2 size={15} /> Join meeting</a>}
            </article>
          ))}
        </div>
      )}

      {editor && (
        <div className="dialog-backdrop" role="presentation">
          <div className="dialog form-dialog" role="dialog" aria-modal="true" aria-labelledby="interview-dialog-title">
            <div className="dialog-heading">
              <div><p className="eyebrow">{editor.id ? 'Update interview' : 'New interview'}</p><h2 id="interview-dialog-title">{editor.id ? 'Edit interview' : 'Schedule interview'}</h2></div>
              <button className="icon-button" title="Close" aria-label="Close" onClick={() => setEditor(null)}><X size={18} /></button>
            </div>
            <InterviewForm key={editor.id || 'new'} interview={editor.id ? editor : null} applications={applications} onSubmit={saveInterview} busy={busy} error={error} />
          </div>
        </div>
      )}
      {deleting && <ConfirmDialog title="Delete interview?" message={'This will permanently remove the interview for ' + deleting.company_name + '.'} onCancel={() => setDeleting(null)} onConfirm={removeInterview} busy={busy} />}
    </div>
  )
}
