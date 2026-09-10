import { useState } from 'react'

import {
  applicationStatuses,
  jobTypes,
} from '../utils/helpers'

const initialForm = {
  company_name: '',
  job_title: '',
  job_location: '',
  job_type: 'full_time',
  job_url: '',
  applied_date: new Date().toISOString().slice(0, 10),
  status: 'applied',
  salary: '',
  notes: '',
}

export default function ApplicationForm({ application, onSubmit, busy, error }) {
  const [form, setForm] = useState(() => application ? {
    ...initialForm,
    ...application,
    salary: application.salary || '',
  } : initialForm)

  const update = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const submit = (event) => {
    event.preventDefault()
    onSubmit({
      ...form,
      salary: form.salary === '' ? null : form.salary,
    })
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      {error && <div className="form-error">{error}</div>}
      <label>
        <span>Company name</span>
        <input name="company_name" value={form.company_name} onChange={update} required />
      </label>
      <label>
        <span>Job title</span>
        <input name="job_title" value={form.job_title} onChange={update} required />
      </label>
      <label>
        <span>Location</span>
        <input name="job_location" value={form.job_location} onChange={update} placeholder="City or remote" />
      </label>
      <label>
        <span>Job type</span>
        <select name="job_type" value={form.job_type} onChange={update}>
          {jobTypes.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
        </select>
      </label>
      <label>
        <span>Applied date</span>
        <input name="applied_date" type="date" value={form.applied_date} onChange={update} required />
      </label>
      <label>
        <span>Status</span>
        <select name="status" value={form.status} onChange={update}>
          {applicationStatuses.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
        </select>
      </label>
      <label>
        <span>Job link</span>
        <input name="job_url" type="url" value={form.job_url} onChange={update} placeholder="https://example.com/job" />
      </label>
      <label>
        <span>Salary</span>
        <input name="salary" type="number" min="0" step="0.01" value={form.salary} onChange={update} placeholder="Optional" />
      </label>
      <label className="form-wide">
        <span>Notes</span>
        <textarea name="notes" value={form.notes} onChange={update} rows="5" placeholder="Anything useful for your follow-up" />
      </label>
      <div className="form-actions form-wide">
        <button className="button button-primary" disabled={busy}>
          {busy ? 'Saving...' : application ? 'Save changes' : 'Add application'}
        </button>
      </div>
    </form>
  )
}
