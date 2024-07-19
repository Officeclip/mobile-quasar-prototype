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
    case 'Approved':
      return 'green-2';
    case 'Pending':
      return 'yellow-3';
    case 'Rejected':
      return 'red-2';
    case 'Submitted':
      return 'yellow-3';
    default:
      return '';
  }
}

export function getEventShowTimeAsColor(name = '') {
  if (name) {
    switch (name) {
      case 'Busy':
        return '#FF0000';
      case 'Free':
        return '#FFFFFF';
      case 'Tentative':
        return '#EFB505';
      case 'Out Of Office':
        return '#003399';
    }
  } else {
    return ['#FF0000', '#FFFFFF', '#EFB505', '#003399'];
  }
}
