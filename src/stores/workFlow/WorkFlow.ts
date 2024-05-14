import { defineStore } from 'pinia';
import { workFlow, users } from '../../models/workFlow';
// import axios from 'axios';
import { Constants } from 'stores/Constants';

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
        console.log(
          'Work flow response -url',
          `${Constants.endPointUrl}/workflow-summary?entityId=${entityId}&entityType=${entityType}&stageId=1`
        );
        const response = await instance.get(
          `${Constants.endPointUrl}/workflow-summary?entityId=${entityId}&entityType=${entityType}&stageId=${stageId}`
        );
        this.workFlow = response.data[0];
        this.workFlowUsers = response.data[0].users;
        console.log('Work flow response -data', response.data[0]);
      } catch (error) {
        console.error(error);
      }
    },

    async submitWorkFlow(workFlow: workFlow) {
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
        console.error(`editExpense Error: ${error}`);
      }
    },
  },
});
