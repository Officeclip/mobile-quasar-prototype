import { defineStore } from 'pinia';
import { Constants } from '../Constants';
import {
  regardingParent,
  tag,
  taskLists,
  taskPriority,
  taskStatus,
  taskType,
  user,
} from 'src/models/task/taskLists';
import { regardingContact } from 'src/models/task/taskLists';
import util from 'src/helpers/util';

export const useTaskListsStore = defineStore('taskListsStore', {
  state: () => ({
    taskTypes: [] as taskType[],
    regardingParent: [] as regardingParent[],
    tags: [] as tag[],
    taskPriorities: [] as taskPriority[],
    users: [] as user[],
    taskStatuses: [] as taskStatus[],
  }),

  getters: {
    Tags: (state) => state.tags,
    RegardingParent: (state) => state.regardingParent,
    TaskTypes: (state) => state.taskTypes,
    Users: (state) => state.users,
    TaskPriorities: (state) => state.taskPriorities,
    TaskStatuses: (state) => state.taskStatuses,
  },

  actions: {
    async getTaskLists() {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.getEndPointUrl()}/task-lists`
        );
        const taskLists: taskLists = response.data[0];
        this.tags = taskLists.tags;
        this.taskTypes = taskLists.taskType;
        this.users = taskLists.users;
        this.taskPriorities = taskLists.priority;
        this.taskStatuses = taskLists.status;
        this.regardingParent = taskLists.regardingParentTypes;
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async getFilteredUsers(searchString: string) {
      try {
        this.users = [];
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.getEndPointUrl()}/task-lists`
        );
        const userList = response.data[0].users;
        const filtered = userList.filter((t: regardingContact) => {
          return t.name.toLowerCase().includes(searchString.toLowerCase());
        });
        await new Promise((r) => setTimeout(r, 500));
        this.users = filtered;
      } catch (error) {
        Constants.throwError(error);
      }
    },
  },
});
