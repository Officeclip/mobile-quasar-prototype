import {defineStore} from 'pinia';
import axios from 'axios';
import {taskSummary} from "src/models/task/taskSummary";
import {Constants} from "stores/Constants";

export const useTaskSummaryStore = defineStore('taskSummaryStore', {
  state: () => ({
    taskSummaries: [] as taskSummary[],
    taskSummary: undefined as taskSummary | undefined,
  }),

  getters: {
    TaskSummaries: (state) => state.taskSummaries,
    TaskSummary: (state) => state.taskSummary,
  },

  actions: {
    async getTasks(parentObjectId: number, parentObjectServiceType: number) {
      // console.log(`TasksStore: getTasks: parameters: ${parentObjectId}, ${parentObjectServiceType}`);
      const callStr =
        parentObjectId > 0 && parentObjectServiceType > 0
          ? `${Constants.endPointUrl}/task-summary?parentObjectId=${parentObjectId}&parentObjectServiceType=${parentObjectServiceType}`
          : `${Constants.endPointUrl}/task-summary`;
      try {
        const response = await axios.get(callStr);
        this.taskSummaries = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    async getTask(id: number) {
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}/task-summary?id=${id}`
        );
        this.taskSummary = response.data[0];
      } catch (error) {
        console.error(error);
      }
    },

    async addTask(taskSummary: taskSummary) {
      this.taskSummaries.push(taskSummary);

      const res = await axios.post(`${Constants.endPointUrl}/task-summary`, taskSummary);

      if (res.status === 200) {
        await this.getTask(taskSummary.id);
      } else {
        console.error(res);
      }
    },

    async editTask(taskSummary: taskSummary) {
      console.log(`editNote 1: ${this.taskSummary?.id}`);
      // not added yet
      try {
        const response = await axios.put(
          `${Constants.endPointUrl}/task-summary/${taskSummary.id}`,
          taskSummary
        );
        if (response.status === 200) {
          //debugger;
          this.taskSummary = response.data;
        }
      } catch (error) {
        console.error(`editTask Error: ${error}`);
      }
    },

    async deleteTask(id: any) {
      try {
        const response = await axios.delete(
          `${Constants.endPointUrl}/task-summary/${id}`
        );
        if (response.status === 200) {
          //debugger;
          this.taskSummary = response.data;
          //  console.log(`editNote 3: ${this.note?.title}`);
        }
      } catch (error) {
        console.error(`deleteNote Error: ${error}`);
      }
    },

    async getFilteredTasks(filterOptions: any, parentObjectId: number, parentObjectServiceType: number) {
      // console.log(`TasksStore: getFilteredTasks: parameters: ${parentObjectId}, ${parentObjectServiceType}`);
      const callStr =
        parentObjectId > 0 && parentObjectServiceType > 0
          ? `${Constants.endPointUrl}/task-summary?parentObjectId=${parentObjectId}&parentObjectServiceType=${parentObjectServiceType}`
          : `${Constants.endPointUrl}/task-summary`;
      try {
        const response = await axios.get(callStr);
        let filteredSummaries = response.data;

        //Search String
        if (filterOptions.filterString) {
          filteredSummaries = filteredSummaries.filter((task: taskSummary) => {
            return task.subject.toLowerCase().includes(filterOptions.filterString.toLowerCase());
          });
        }
        // Owner=Me
        if (filterOptions.ownedByMeFilter) {
          filteredSummaries = filteredSummaries.filter((task: taskSummary) => {
            return task.taskOwner === filterOptions.userName;
          });
        }
        // Assignee=me
        if (filterOptions.assignedToMeFilter) {
          filteredSummaries = filteredSummaries.filter((task: taskSummary) => {
            return task.assignee.includes(filterOptions.userName);
          });
        }

        // Status Filter
        if (filterOptions.statusValue) {
          filteredSummaries = filteredSummaries.filter((task: taskSummary) => {
            return task.taskStatusId === filterOptions.statusValue;
          });
        }

        // Priority Filter
        if (filterOptions.priorityValue) {
          filteredSummaries = filteredSummaries.filter((task: taskSummary) => {
            return task.taskPriorityId === filterOptions.priorityValue;
          });
        }
        // Task Type
        if (filterOptions.taskTypeValue) {
          filteredSummaries = filteredSummaries.filter((task: taskSummary) => {
            return task.taskTypeId === filterOptions.taskTypeValue;
          });
        }
        // Assigned To
        if (filterOptions.assignedTo) {
          filteredSummaries = filteredSummaries.filter((task: taskSummary) => {
            return task.assignee.includes(filterOptions.assignedTo);
          });
        }
        // Owned by
        if (filterOptions.ownedBy) {
          filteredSummaries = filteredSummaries.filter((task: taskSummary) => {
            return task.taskOwner.includes(filterOptions.ownedBy);
          });
        }

        // Due Date
        if (filterOptions.dueDateOption) {
          filteredSummaries = filteredSummaries.filter((task: taskSummary) => {
            const taskDueDate = new Date(task.dueDate);
            const filterDueDate = new Date(filterOptions.dueDateValue);

            switch (filterOptions.dueDateOption) {
              case 'EqualTo':
                return taskDueDate.getDate() === filterDueDate.getDate() &&
                  taskDueDate.getMonth() === filterDueDate.getMonth() &&
                  taskDueDate.getFullYear() === filterDueDate.getFullYear();
              case 'NotEqualTo':
                return taskDueDate.getDate() !== filterDueDate.getDate() ||
                  taskDueDate.getMonth() !== filterDueDate.getMonth() ||
                  taskDueDate.getFullYear() !== filterDueDate.getFullYear();
              case 'GreaterThan':
                return taskDueDate > filterDueDate;
              case 'LessThan':
                return taskDueDate < filterDueDate;
              case 'GreaterOrEqual':
                return taskDueDate >= filterDueDate;
              case 'LessOrEqual':
                return taskDueDate <= filterDueDate;
              case 'isNull':
                return task.dueDate === null;
              case 'isNotNull':
                return task.dueDate !== null;
              default:
                return true;
            }
          });
        }

        // Modified Date
        if (filterOptions.modifiedDateOption) {
          filteredSummaries = filteredSummaries.filter((task: taskSummary) => {
            const taskModifiedDate = new Date(task.modifiedDate);
            const filterModifiedDate = new Date(filterOptions.modifiedDateValue);

            switch (filterOptions.modifiedDateOption) {
              case 'EqualTo':
                return taskModifiedDate.getDate() === filterModifiedDate.getDate() &&
                  taskModifiedDate.getMonth() === filterModifiedDate.getMonth() &&
                  taskModifiedDate.getFullYear() === filterModifiedDate.getFullYear();
              case 'NotEqualTo':
                return taskModifiedDate.getDate() !== filterModifiedDate.getDate() ||
                  taskModifiedDate.getMonth() !== filterModifiedDate.getMonth() ||
                  taskModifiedDate.getFullYear() !== filterModifiedDate.getFullYear();
              case 'GreaterThan':
                return taskModifiedDate > filterModifiedDate;
              case 'LessThan':
                return taskModifiedDate < filterModifiedDate;
              case 'GreaterOrEqual':
                return taskModifiedDate >= filterModifiedDate;
              case 'LessOrEqual':
                return taskModifiedDate <= filterModifiedDate;
              case 'isNull':
                return task.modifiedDate === null;
              case 'isNotNull':
                return task.modifiedDate !== null;
              default:
                return true;
            }
          });
        }

        this.taskSummaries = filteredSummaries;
      } catch (error) {
        console.error(error);
      }
    },

  },
});
