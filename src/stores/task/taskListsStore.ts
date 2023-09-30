import { defineStore } from 'pinia';
import axios from 'axios';
import { Constants } from '../Constants';
import {taskLists, taskPriority, taskStatus, taskType} from "src/models/task/taskLists";

export const useTaskListsStore = defineStore('taskListsStore', {
  state: () => ({
    // timesheetList: undefined as TimesheetList | undefined,
    taskTypes: [] as taskType[],
    taskPriorities: [] as taskPriority[],
    taskStatuses: [] as taskStatus[],
  }),

  getters: {
    TaskTypes: (state) => state.taskTypes,
    TaskPriorities: (state) => state.taskPriorities,
    TaskStatuses: (state) => state.taskStatuses,
  },

  actions: {
    async getTaskLists() {
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}/task-lists`
        );

        const taskLists:taskLists = response.data[0];
        console.log('eventLists', taskLists);

        this.taskTypes = taskLists.taskType;
        this.taskPriorities = taskLists.taskPriority;
        this.taskStatuses = taskLists.taskStatus;
        // this.regardingContacts = eventLists.regardingContact;
      } catch (error) {
        console.error(error);
      }
    }
  },
});
