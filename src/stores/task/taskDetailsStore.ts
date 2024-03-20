import { defineStore } from 'pinia';
import axios from 'axios';
import { taskDetails } from 'src/models/task/taskDetails';
import { Constants } from 'stores/Constants';
import { subTask } from 'src/models/task/subtask';

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
    async addTask(taskDetail: taskDetails) {
      this.taskDetails.push(taskDetail);
      const instance = Constants.getAxiosInstance();
      const response = await instance.post(
        `${Constants.endPointUrl}/task-detail`,
        taskDetail
      );

      if (response.status === 200) {
        await this.getTask(taskDetail.id);
      } else {
        console.error(response);
      }
    },

    async deleteTask(id: any) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.delete(
          `${Constants.endPointUrl}/task-detail/${id}`
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

    async editTask(taskDetail: taskDetails) {
      console.log(`editNote 1: ${this.taskDetail?.id}`);
      // not added yet
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.put(
          `${Constants.endPointUrl}/task-detail/${taskDetail.id}`,
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

    async getTask(id: string) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${Constants.endPointUrl}/task-detail/${id}`
        );
        console.log(response);
        this.taskDetail = response.data;
      } catch (error) {
        this.taskDetail = undefined;
        console.error(error);
      }
    },

    async getTasks(parentObjectId: number, parentObjectServiceType: number) {
      console.log(
        `TasksStore: getTasks: parameters: ${parentObjectId}, ${parentObjectServiceType}`
      );
      const callStr =
        parentObjectId > 0 && parentObjectServiceType > 0
          ? `${Constants.endPointUrl}/task-detail?parentObjectId=${parentObjectId}&parentObjectServiceType=${parentObjectServiceType}`
          : `${Constants.endPointUrl}/task-detail`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(callStr);
        this.taskDetails = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    async addSubtask(subtask: subTask) {
      this.taskDetail?.subTasks.push(subtask);
      await this.editTask(<taskDetails>this.taskDetail);
    },

    async editSubtask(editedSubtask: subTask) {
      let subtask: subTask | undefined = this.taskDetail?.subTasks.find(
        (subtask: subTask) => {
          return subtask.id === editedSubtask.id;
        }
      );

      if (subtask) subtask = editedSubtask;
      console.log(subtask);
      console.log(editedSubtask);
      await this.editTask(<taskDetails>this.taskDetail);
    },

    async toggleSubtaskCompletion(subtaskId: string) {
      const subtask: subTask | undefined = this.taskDetail?.subTasks.find(
        (subtask: subTask) => {
          return subtask.id === subtaskId;
        }
      );
      if (subtask) subtask.isCompleted = !subtask.isCompleted;
      await this.editTask(<taskDetails>this.taskDetail);
    },

    async deleteSubtask(subtaskId: string) {
      const modifiedSubtasks = this.taskDetail?.subTasks.filter((s) => {
        return s.id != subtaskId;
      });
      if (this.taskDetail) this.taskDetail.subTasks = modifiedSubtasks ?? [];
      await this.editTask(<taskDetails>this.taskDetail);
    },
  },
});
