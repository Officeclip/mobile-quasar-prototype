export interface taskLists {
  taskType: taskType[];
  priority: taskPriority[];
  status: taskStatus[];
  tags: tag[];
  users: user[];
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

export interface regardingContact {
  id: string;
  name: string;
}

export interface tag {
  id: string;
  name: string;
}
export interface user {
  id: string;
  name: string;
}

