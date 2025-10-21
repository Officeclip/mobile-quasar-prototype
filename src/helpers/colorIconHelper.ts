export function getTaskStatusIcon(status: string) {
  switch (status) {
    case 'Active':
      return 'lock_open';
    case 'Pending':
      return 'hourglass_top';
    case 'Completed':
      return 'check';
    default:
      return '';
  }
}

export function getTaskStatusColor(status: string) {
  // Add or remove colors as needed
  switch (status) {
    case 'Active':
      return 'grey-9'; // Grey for tasks that are open/not started
    case 'Pending':
      return 'amber-10'; // Amber for tasks that are on hold or awaiting action
    case 'Completed':
      return 'green-8'; // Green for tasks that have been completed
    // Add more status options here if necessary
    default:
      return 'grey'; // Default case when the status does not match any of the above
  }
}

export function getPriorityIcon(priority: string) {
  switch (priority) {
    case 'High':
      return 'arrow_upward';
    case 'Medium':
      return 'horizontal_rule';
    case 'Low':
      return 'arrow_downward';

    default:
      return '';
  }
}

export function getPriorityColor(priority: string) {
  switch (priority) {
    case 'High':
      return 'red';
    case 'Medium':
      return 'amber-10';
    case 'Low':
      return 'green-8';

    default:
      return 'grey';
  }
}

export function getExpenseOrTimesheetStatusColor(status: string) {
  switch (status) {
    case 'Saved':
      return 'status-saved';
    case 'Approved':
      return 'status-approved';
    case 'Pending':
      return 'status-pending';
    case 'Rejected':
      return 'status-rejected';
    case 'Submitted':
      return 'status-pending';
    default:
      return '';
  }
}

export function getEventShowTimeAsColor(name = '') {
  if (name) {
    switch (name) {
      case 'Busy':
        return 'bg-red-4'; // Using Quasar's color classes for better dark mode handling
      case 'Free':
        return 'bg-white';
      case 'Tentative':
        return 'bg-blue-4';
      case 'Out of Office':
        return 'bg-blue-grey-8';
    }
  } else {
    return ['bg-red-4', 'bg-white', 'bg-amber-5', 'bg-blue-4']; // Quasar color classes
  }
}

export function getIssueTrackerLabelColor(status: string) {
  switch (status) {
    case 'Open':
      return 'status-open';
    case 'Closed':
      return 'status-closed';
    case 'Resolved':
      return 'status-resolved';
    case 'Reopened':
      return 'status-reopened';
    case 'High':
      return 'criticality-high';
    case 'Low':
      return 'criticality-low';
    case 'Medium':
      return 'criticality-medium';
    default:
      return '';
  }
}
