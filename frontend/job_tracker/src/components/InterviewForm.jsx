import { useState } from 'react'

import {
  interviewStatuses,
  interviewTypes,
} from '../utils/helpers'

const initialForm = {
  application: '',
  interview_date: new Date().toISOString().slice(0, 10),
  interview_time: '10:00',
  interview_type: 'technical',
  interviewer: '',
  meeting_link: '',
  notes: '',
  status: 'scheduled',
}

export default function InterviewForm({ interview, applications, onSubmit, busy, error }) {
  const [form, setForm] = useState(() => interview ? { ...initialForm, ...interview } : initialForm)

  const update = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const submit = (event) => {
    event.preventDefault()
    onSubmit({ ...form, application: Number(form.application) })
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      {error && <div className="form-error">{error}</div>}
      <label className="form-wide">
        <span>Application</span>
        <select name="application" value={form.application} onChange={update} required>
          <option value="">Choose an application</option>
          {applications.map((application) => (
            <option key={application.id} value={application.id}>
              {application.company_name} - {application.job_title}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Date</span>
        <input name="interview_date" type="date" value={form.interview_date} onChange={update} required />
      </label>
      <label>
        <span>Time</span>
        <input name="interview_time" type="time" value={form.interview_time} onChange={update} required />
      </label>
      <label>
        <span>Type</span>
        <select name="interview_type" value={form.interview_type} onChange={update}>
          {interviewTypes.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
        </select>
      </label>
      <label>
        <span>Status</span>
        <select name="status" value={form.status} onChange={update}>
          {interviewStatuses.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
        </select>
      </label>
      <label>
        <span>Interviewer</span>
        <input name="interviewer" value={form.interviewer} onChange={update} placeholder="Optional" />
      </label>
      <label>
        <span>Meeting link</span>
        <input name="meeting_link" type="url" value={form.meeting_link} onChange={update} placeholder="Optional" />
      </label>
      <label className="form-wide">
        <span>Notes</span>
        <textarea name="notes" rows="4" value={form.notes} onChange={update} placeholder="Preparation notes or follow-up" />
      </label>
      <div className="form-actions form-wide">
        <button className="button button-primary" disabled={busy}>
          {busy ? 'Saving...' : interview ? 'Save changes' : 'Schedule interview'}
        </button>
      </div>
    </form>
  )
}
