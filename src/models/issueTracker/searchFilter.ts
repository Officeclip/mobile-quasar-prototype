export interface searchFilter {
  searchString: string;
  starredIssues: string;
  statusId: number | string;
  criticalityId: number | string;
  categoryId: number | string;
  kindId: number | string;
  createdById: string;
  assignedToId: number | string;
  modifiedById: string;
}
