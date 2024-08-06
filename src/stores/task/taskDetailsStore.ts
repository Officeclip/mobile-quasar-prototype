import { defineStore } from 'pinia';
import { taskDetails } from 'src/models/task/taskDetails';
import { Constants } from 'stores/Constants';
import { subTask } from 'src/models/task/subtask';
import logger from 'src/helpers/logger';

export const useTaskDetailsStore = defineStore('taskDetailsStore', {
  state: () => ({
    taskDetails: [] as taskDetails[],
    taskDetail: undefined as taskDetails | undefined,
    subTask: undefined as subTask | undefined,
  }),

  getters: {
    TaskDetails: (state) => state.taskDetails,
    TaskDetail: (state) => state.taskDetail,
    SubTask: (state) => state.subTask,
  },

  actions: {
    async addTask(taskDetail: taskDetails) {
      console.log('*** taskDetailStore:addTask(...) ***');
      try {
        this.taskDetails.push(taskDetail);
        const instance = Constants.getAxiosInstance();
        const response = await instance.post(
          `${Constants.endPointUrl}/task-detail`,
          taskDetail
        );

        if (response.status === 200) {
          this.taskDetail = response.data;
        }
      } catch (error) {
        console.log(`*** taskDetailStore:addTask(...):catch: ${error} ***`);
        Constants.throwError(error);
      }
    },

    async deleteTask(id: any) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.delete(
          `${Constants.endPointUrl}/task-detail/${id}`
        );
        if (response.status === 200) {
          this.taskDetail = response.data;
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async editTask(taskDetail: taskDetails) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.put(
          `${Constants.endPointUrl}/task-detail/${taskDetail.id}`,
          taskDetail
        );
        if (response.status === 200) {
          this.taskDetail = response.data;
        }
      } catch (error) {
        console.log(`*** taskDetailStore:editTask(...):catch: ${error} ***`);
        Constants.throwError(error);
      }
    },

    async getTask(id: string) {
      logger.log(`*** taskDetailStore:getTask(${id}) ***`);
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${Constants.endPointUrl}/task-detail/${id}`
        );
        this.taskDetail = response.data;
      } catch (error) {
        logger.log(`*** taskDetailStore:catch(${error}) ***`, 'error');
        Constants.throwError(error);
      }
    },

    async getTasks(parentObjectId: number, parentObjectServiceType: number) {
      const callStr =
        parentObjectId > 0 && parentObjectServiceType > 0
          ? `${Constants.endPointUrl}/task-detail?parentObjectId=${parentObjectId}&parentObjectServiceType=${parentObjectServiceType}`
          : `${Constants.endPointUrl}/task-detail`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(callStr);
        this.taskDetails = response.data;
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async addSubtask(subtask: subTask) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.post(
          `${Constants.endPointUrl}/subtask`,
          subtask
        );

        if (response.status === 200) {
          this.subTask = response.data;
        }
      } catch (error) {
        console.log(`*** taskDetailStore:addSubTask(...):catch: ${error} ***`);
        Constants.throwError(error);
      }
    },

    async editSubtask(subtask: subTask) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.put(
          `${Constants.endPointUrl}/subtask/${subtask.id}`,
          subtask
        );
        if (response.status === 200) {
          this.subTask = response.data;
        }
      } catch (error) {
        console.log(`*** taskDetailStore:editSubTask(...):catch: ${error} ***`);
        Constants.throwError(error);
      }
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

    async deleteSubtask(id: string) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.delete(
          `${Constants.endPointUrl}/subtask/${id}`
        );
        if (response.status === 200) {
          this.subTask = response.data;
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },
  },
});
