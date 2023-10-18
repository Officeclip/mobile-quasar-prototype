export interface subTask {
  id: number;
  parentId: number;
  title: string;
  description: string;
  assignee: subtaskAssignee;
  isCompleted: boolean;
  completedDate: string;
}

export interface subtaskAssignee {
  id: string;
  name: string;
}
