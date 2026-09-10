import {
  ChevronLeft,
  ChevronRight,
  Eye,
  FilePenLine,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import api, { getApiError } from '../api/axios'
import StatusBadge from '../components/StatusBadge'
import { ConfirmDialog, EmptyState, ErrorState, LoadingState } from '../components/States'
import {
  applicationStatuses,
  formatDate,
  jobTypes,
  labelFor,
} from '../utils/helpers'

export default function ApplicationsPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    job_type: '',
    ordering: '-applied_date',
    page: 1,
  })
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)

  const loadApplications = async () => {
    setError('')
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== ''),
      )
      const { data } = await api.get('applications/', { params })
      setResult(data)
    } catch (requestError) {
      setError(getApiError(requestError))
    }
  }

  useEffect(() => {
    const timeout = setTimeout(loadApplications, 180)
    return () => clearTimeout(timeout)
  }, [filters])

  const updateFilter = (event) => {
    const { name, value } = event.target
    setFilters((current) => ({ ...current, [name]: value, page: 1 }))
  }

  const removeApplication = async () => {
    setBusy(true)
    try {
      await api.delete('applications/' + deleting.id + '/')
      setDeleting(null)
      loadApplications()
    } catch (requestError) {
      setError(getApiError(requestError))
      setDeleting(null)
    } finally {
      setBusy(false)
    }
  }

  const applications = result?.results || []
  const currentPage = filters.page
  const hasNext = Boolean(result?.next)

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Application pipeline</p>
          <h1>My applications</h1>
        </div>
        <Link className="button button-primary" to="/applications/add">
          <Plus size={17} /> Add application
        </Link>
      </div>

      <section className="filter-row" aria-label="Application filters">
        <label className="search-field">
          <Search size={17} />
          <input name="search" value={filters.search} onChange={updateFilter} placeholder="Search company or job title" />
        </label>
        <select name="status" value={filters.status} onChange={updateFilter} aria-label="Filter by status">
          <option value="">All statuses</option>
          {applicationStatuses.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
        </select>
        <select name="job_type" value={filters.job_type} onChange={updateFilter} aria-label="Filter by job type">
          <option value="">All job types</option>
          {jobTypes.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
        </select>
        <select name="ordering" value={filters.ordering} onChange={updateFilter} aria-label="Order applications">
          <option value="-applied_date">Newest applied</option>
          <option value="applied_date">Oldest applied</option>
          <option value="company_name">Company A-Z</option>
          <option value="job_title">Role A-Z</option>
        </select>
      </section>

      {error && <ErrorState message={error} onRetry={loadApplications} />}
      {!result && !error && <LoadingState label="Loading applications" />}
      {result && applications.length === 0 && (
        <EmptyState
          title="No applications found"
          message="Try changing your filters, or add your first opportunity."
          action={<Link className="button button-primary" to="/applications/add"><Plus size={16} /> Add application</Link>}
        />
      )}
      {result && applications.length > 0 && (
        <>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Applied</th>
                  <th>Type</th>
                  <th><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application.id}>
                    <td><strong>{application.company_name}</strong><small>{application.job_location || 'Location not set'}</small></td>
                    <td>{application.job_title}</td>
                    <td><StatusBadge status={application.status} /></td>
                    <td>{formatDate(application.applied_date)}</td>
                    <td>{labelFor(jobTypes, application.job_type)}</td>
                    <td className="row-actions">
                      <button className="icon-button" title="View application" aria-label="View application" onClick={() => navigate('/applications/' + application.id)}><Eye size={17} /></button>
                      <button className="icon-button" title="Edit application" aria-label="Edit application" onClick={() => navigate('/applications/' + application.id + '/edit')}><FilePenLine size={17} /></button>
                      <button className="icon-button danger-icon" title="Delete application" aria-label="Delete application" onClick={() => setDeleting(application)}><Trash2 size={17} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <span>{result.count} total application{result.count === 1 ? '' : 's'}</span>
            <div>
              <button className="icon-button" title="Previous page" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))}><ChevronLeft size={17} /></button>
              <span className="page-count">Page {currentPage}</span>
              <button className="icon-button" title="Next page" aria-label="Next page" disabled={!hasNext} onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}><ChevronRight size={17} /></button>
            </div>
          </div>
        </>
      )}
      {deleting && (
        <ConfirmDialog
          title="Delete application?"
          message={'This will permanently delete ' + deleting.company_name + ' and its related interviews.'}
          onCancel={() => setDeleting(null)}
          onConfirm={removeApplication}
          busy={busy}
        />
      )}
    </div>
  )
}
