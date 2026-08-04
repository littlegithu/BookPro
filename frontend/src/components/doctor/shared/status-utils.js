export function getStatusColor(status) {
  switch (status) {
    case 'Scheduled':
      return 'bg-blue-light text-blue'
    case 'Completed':
      return 'bg-green-light text-green'
    case 'Cancelled':
      return 'bg-red-light text-red'
    case 'Pending':
      return 'bg-yellow-light text-yellow'
    case 'Verified':
      return 'bg-green-light text-green'
    case 'Rejected':
      return 'bg-red-light text-red'
    case 'Checked In':
      return 'bg-purple-light text-purple'
    case 'Called':
      return 'bg-indigo-light text-indigo'
    default:
      return 'bg-gray-light text-gray'
  }
}

export function getAvailabilityColor(status) {
  switch (status) {
    case 'Available':
      return 'bg-green-light text-green'
    case 'Unavailable':
      return 'bg-red-light text-red'
    case 'Busy':
      return 'bg-yellow-light text-yellow'
    case 'On Leave':
      return 'bg-gray-light text-gray'
    default:
      return 'bg-gray-light text-gray'
  }
}

export function getConsultationTypeColor(type) {
  switch (type) {
    case 'Physical':
      return 'bg-teal-light text-teal'
    case 'Virtual':
      return 'bg-blue-light text-blue'
    case 'Both':
      return 'bg-purple-light text-purple'
    default:
      return 'bg-gray-light text-gray'
  }
}
