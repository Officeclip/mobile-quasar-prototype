import { defineStore } from 'pinia';
import { workFlow, users } from '../../models/workFlow';
import { Constants } from '../../stores/Constants';
import util from 'src/helpers/util';

export const useWorkFlowStore = defineStore('workFlowStore', {
  state: () => ({
    workFlow: {} as workFlow,
    workFlowUsers: [] as users[],
  }),

  getters: {
    WorkFlow: (state) => state.workFlow,
    WorkFlowUsers: (state) => state.workFlowUsers,
  },

  actions: {
    async getWorkFlow(entityId: string, entityType: string, stageId: number) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.getEndPointUrl()}/workflow-summary?entityId=${entityId}&entityType=${entityType}&stageId=${stageId}`,
        );
        this.workFlow = response.data[0];
        this.workFlowUsers = response.data[0].users;
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async submitWorkFlow(workFlow: workFlow) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.post(
          `${util.getEndPointUrl()}/workflow-summary`,
          workFlow,
        );
        if (response.status === 200) {
          this.workFlow = response.data;
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },
  },
});
