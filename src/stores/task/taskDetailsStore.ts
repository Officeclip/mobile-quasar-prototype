import {defineStore} from 'pinia';
import axios from 'axios';
import {taskDetails} from 'src/models/task/taskDetails';
import {Constants} from 'stores/Constants';

export const useTaskDetailsStore = defineStore('taskDetailsStore', {
  state: () => ({
    taskDetails: [] as taskDetails[],
    taskDetail: undefined as taskDetails | undefined,
  }),

  getters: {
    TaskDetails: (state) => state.taskDetails,
    TaskDetail: (state) => state.taskDetail,
  },

  actions: {
    async getTasks(parentObjectId: number, parentObjectServiceType: number) {
      console.log(
        `TasksStore: getTasks: parameters: ${parentObjectId}, ${parentObjectServiceType}`
      );
      const callStr =
        parentObjectId > 0 && parentObjectServiceType > 0
          ? `${Constants.endPointUrl}/task-details?parentObjectId=${parentObjectId}&parentObjectServiceType=${parentObjectServiceType}`
          : `${Constants.endPointUrl}/task-details`;
      try {
        const response = await axios.get(callStr);
        this.taskDetails = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    async getTask(id: number) {
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}/task-details?id=${id}`
        );
        this.taskDetail = response.data[0];
      } catch (error) {
        console.error(error);
      }
    },

    async addTask(taskDetail: taskDetails) {
      this.taskDetails.push(taskDetail);
      const res = await axios.post(
        `${Constants.endPointUrl}/task-details`,
        taskDetail
      );

      if (res.status === 200) {
        await this.getTask(taskDetail.id);
      } else {
        console.error(res);
      }
    },

    async editTask(taskDetail: taskDetails) {
      console.log(`editNote 1: ${this.taskDetail?.id}`);
      // not added yet
      try {
        const response = await axios.put(
          `${Constants.endPointUrl}/task-details/${taskDetail.id}`,
          taskDetail
        );
        if (response.status === 200) {
          //debugger;
          this.taskDetail = response.data;
        }
      } catch (error) {
        console.error(`editTask Error: ${error}`);
      }
    },

    async deleteTask(id: number | string|undefined) {
      try {
        const response = await axios.delete(
          `${Constants.endPointUrl}/task-details/${id}`
        );
        if (response.status === 200) {
          //debugger;
          this.taskDetail = response.data;
          //  console.log(`editNote 3: ${this.note?.title}`);
        }
      } catch (error) {
        console.error(`deleteNote Error: ${error}`);
      }
    },
  },
});
