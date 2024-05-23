import { defineStore } from 'pinia';
import { Task } from '../models/task';
import { Constants } from 'stores/Constants';

export const useTasksStore = defineStore('tasksStore', {
  state: () => ({
    tasks: [] as Task[],
    task: undefined as Task | undefined,
  }),

  getters: {
    Tasks: (state) => state.tasks,
    Task: (state) => state.task,
  },

  actions: {
    async getTasks(parentObjectId: number, parentObjectServiceType: number) {
      const callStr =
        parentObjectId > 0 && parentObjectServiceType > 0
          ? `${Constants.endPointUrl}tasks?parentObjectId=${parentObjectId}&parentObjectServiceType=${parentObjectServiceType}`
          : `${Constants.endPointUrl}/tasks`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(callStr);
        this.tasks = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    async getTask(id: number) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${Constants.endPointUrl}/tasks?id=${id}`
        );
        this.task = response.data[0];
      } catch (error) {
        console.error(error);
      }
    },

    async addTask(task: Task) {
      this.tasks.push(task);

      const instance = Constants.getAxiosInstance();
      const response = await instance.post(
        `${Constants.endPointUrl}/tasks`,
        task
      );

      if (response.status === 200) {
        this.getTask(task.id);
      } else {
        console.error(response);
      }
    },

    async editTask(task: Task) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.put(
          `${Constants.endPointUrl}/tasks/${task.id}`,
          task
        );
        if (response.status === 200) {
          this.task = response.data;
        }
      } catch (error) {
        console.error(`editTask Error: ${error}`);
      }
    },

    async deleteTask(id: number | undefined) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.delete(
          `${Constants.endPointUrl}/tasks/${id}`
        );
        if (response.status === 200) {
          this.task = response.data;
        }
      } catch (error) {
        console.error(`deleteNote Error: ${error}`);
      }
    },
  },
});
