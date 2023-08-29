import { defineStore } from 'pinia';
import { Task } from '../models/task';
import axios from 'axios';

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
      console.log(
        `TasksStore: getTasks: parameters: ${parentObjectId}, ${parentObjectServiceType}`
      );
      const callStr =
        parentObjectId > 0 && parentObjectServiceType > 0
          ? `http://localhost:4000/tasks?parentObjectId=${parentObjectId}&parentObjectServiceType=${parentObjectServiceType}`
          : 'http://localhost:4000/tasks';
      try {
        const response = await axios.get(callStr);
        this.tasks = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    async getTask(id: number) {
      try {
        const response = await axios.get(
          `http://localhost:4000/tasks?id=${id}`
        );
        this.task = response.data[0];
      } catch (error) {
        console.error(error);
      }
    },

    async addTask(task: Task) {
      this.tasks.push(task);

      const res = await axios.post('http://localhost:4000/tasks', task);

      if (res.status === 200) {
        this.getTask(task.id);
      } else {
        console.error(res);
      }
    },

    async editTask(task: Task) {
      console.log(`editNote 1: ${this.task?.id}`);
      // not added yet
      try {
        const response = await axios.put(
          `http://localhost:4000/tasks/${task.id}`,
          task
        );
        if (response.status === 200) {
          //debugger;
          this.task = response.data;
        }
      } catch (error) {
        console.error(`editTask Error: ${error}`);
      }
    },

    async deleteTask(id: number | undefined) {
      try {
        const response = await axios.delete(
          `http://localhost:4000/tasks/${id}`
        );
        if (response.status === 200) {
          //debugger;
          this.task = response.data;
          //  console.log(`editNote 3: ${this.note?.title}`);
        }
      } catch (error) {
        console.error(`deleteNote Error: ${error}`);
      }
    },
  },
});
