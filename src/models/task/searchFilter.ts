export interface searchFilter {
  filterString: string;
  dueDateValue: string;
  dueDateOption: string;
  modifiedDateValue: string;
  modifiedDateOption: string;
  statusId: number | string;
  priorityId: number | string;
  taskTypeId: number | string;
  assignedTo: number | string;
  ownedById: number | string;
  regardingTypeId: number | string;
  regardingValueId: number | string;
  showCompleted: boolean;
}
