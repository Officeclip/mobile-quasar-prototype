import { defineStore } from 'pinia';
import axios from 'axios';
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

export const useTaskListsStore = defineStore('taskListsStore', {
  state: () => ({
    // timesheetList: undefined as TimesheetList | undefined,
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
        const response = await axios.get(`${Constants.endPointUrl}/task-lists`);
        const taskLists: taskLists = response.data;
        console.log('taskLists', taskLists);

        this.tags = taskLists.tags;
        this.taskTypes = taskLists.taskType;
        this.taskPriorities = taskLists.priority;
        this.taskStatuses = taskLists.status;
        this.regardingParent = taskLists.regardingParentTypes;
        // this.regardingContacts = eventLists.regardingContact;
      } catch (error) {
        console.error(error);
      }
    },

    async getFilteredUsers(searchString: string) {
      try {
        this.users = [];
        const response = await axios.get(`${Constants.endPointUrl}/task-lists`);
        const taskLists = response.data;
        const regardingContacts = taskLists.users;
        const filtered = regardingContacts.filter((t: regardingContact) => {
          return t.name.toLowerCase().includes(searchString.toLowerCase());
        });
        console.log('getRegardingContactList: ', filtered);
        await new Promise((r) => setTimeout(r, 500));
        this.users = filtered;
        // console.log("Filtered contacts: ", this.regardingContacts);
      } catch (error) {
        console.error(error);
      }
    },
  },
});
