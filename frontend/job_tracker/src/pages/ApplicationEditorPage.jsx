import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import api, { getApiError } from '../api/axios'
import ApplicationForm from '../components/ApplicationForm'
import { ErrorState, LoadingState } from '../components/States'

export default function ApplicationEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(Boolean(id))
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const loadApplication = async () => {
    if (!id) return
    try {
      const { data } = await api.get('applications/' + id + '/')
      setApplication(data)
    } catch (requestError) {
      setError(getApiError(requestError))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => loadApplication(), 0)
    return () => window.clearTimeout(timeoutId)
  }, [id])

  const save = async (payload) => {
    setBusy(true)
    setError('')
    try {
      const request = id
        ? api.patch('applications/' + id + '/', payload)
        : api.post('applications/', payload)
      const { data } = await request
      navigate('/applications/' + data.id)
    } catch (requestError) {
      setError(getApiError(requestError))
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <LoadingState label="Loading application" />
  if (id && error && !application) return <ErrorState message={error} onRetry={loadApplication} />

  return (
    <div className="page narrow-page">
      <Link className="back-link" to={id ? '/applications/' + id : '/applications'}><ArrowLeft size={16} /> Back to applications</Link>
      <div className="page-heading form-page-heading">
        <div>
          <p className="eyebrow">{id ? 'Update application' : 'New opportunity'}</p>
          <h1>{id ? 'Edit application' : 'Add application'}</h1>
        </div>
      </div>
      <section className="form-surface">
        <ApplicationForm application={application} onSubmit={save} busy={busy} error={error} />
      </section>
    </div>
  )
}
