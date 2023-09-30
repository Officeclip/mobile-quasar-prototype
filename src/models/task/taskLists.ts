export interface taskLists {
  taskType: taskType[];
  taskPriority: taskPriority[];
  taskStatus: taskStatus[];
}

export interface taskType {
  id: string;
  name: string;
}

export interface taskPriority {
  id: string;
  name: string;
}

export interface taskStatus {
  id: string;
  name: string;
}
