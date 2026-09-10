export const applicationStatuses = [
  ['applied', 'Applied'],
  ['shortlisted', 'Shortlisted'],
  ['interview', 'Interview'],
  ['selected', 'Selected'],
  ['rejected', 'Rejected'],
]

export const jobTypes = [
  ['full_time', 'Full Time'],
  ['part_time', 'Part Time'],
  ['internship', 'Internship'],
  ['contract', 'Contract'],
]

export const interviewTypes = [
  ['technical', 'Technical'],
  ['hr', 'HR'],
  ['aptitude', 'Aptitude'],
  ['managerial', 'Managerial'],
  ['other', 'Other'],
]

export const interviewStatuses = [
  ['scheduled', 'Scheduled'],
  ['completed', 'Completed'],
  ['cancelled', 'Cancelled'],
]

export const formatDate = (value) => {
  if (!value) return 'Not set'
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`))
}

export const formatTime = (value) => {
  if (!value) return ''
  const [hours, minutes] = value.split(':')
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(2000, 0, 1, hours, minutes))
}

export const formatCurrency = (value) => (
  value ? new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value) : 'Not specified'
)

export const labelFor = (options, value) => (
  options.find(([key]) => key === value)?.[1] || value
)
