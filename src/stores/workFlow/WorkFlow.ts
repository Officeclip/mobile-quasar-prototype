import { defineStore } from 'pinia';
import { workFlow, users } from '../../models/workFlow';
// import axios from 'axios';
import { Constants } from 'stores/Constants';
import logger from 'src/helpers/logger';

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
        logger.log(
          'Work flow response -url' +
            `${Constants.endPointUrl}/workflow-summary?entityId=${entityId}&entityType=${entityType}&stageId=1`
        );
        const response = await instance.get(
          `${Constants.endPointUrl}/workflow-summary?entityId=${entityId}&entityType=${entityType}&stageId=${stageId}`
        );
        this.workFlow = response.data[0];
        this.workFlowUsers = response.data[0].users;
        logger.log('Work flow response -data', response.data[0]);
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async submitWorkFlow(workFlow: workFlow) {
      logger.log('CHECKING THE WORKFLOW POSTING DATA::::', workFlow);
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.post(
          `${Constants.endPointUrl}/workflow-summary`,
          workFlow
        );
        if (response.status === 200) {
          //debugger;
          this.workFlow = response.data;
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },
  },
});
