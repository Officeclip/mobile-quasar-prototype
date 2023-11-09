export function getTaskStatusIcon(status: string) {
  switch (status) {
    case 'Open':
      return 'lock_open';
    case 'In Progress':
      return 'autorenew';
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
    case 'Open':
      return 'grey'; // Grey for tasks that are open/not started
    case 'In Progress':
      return 'blue'; // Blue for tasks that are currently being worked on
    case 'Pending':
      return 'amber'; // Amber for tasks that are on hold or awaiting action
    case 'Completed':
      return 'green'; // Green for tasks that have been completed
    // Add more status options here if necessary
    default:
      return ''; // Default case when the status does not match any of the above
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

    // case 'High':
    //   return 'error';
    // case 'Medium':
    //   return 'error_outline';
    // case 'Low':
    //   return 'report_problem';


    // case 'High':
    //   return 'star';
    // case 'Medium':
    //   return 'star_half';
    // case 'Low':
    //   return 'star_outline';

    default:
      return '';
  }
}

export function getPriorityColor(priority: string) {
  switch (priority) {

    // case 'High':
    //   return '#d85c5c';
    // case 'Medium':
    //   return '#ea9a49';
    // case 'Low':
    //   return '#85e56a';

    case 'High':
      return 'red';
    case 'Medium':
      return 'amber';
    case 'Low':
      return 'green';

    default:
      return '';
  }
}
