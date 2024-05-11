import { defineStore } from 'pinia';
import { workFlow, users } from '../../models/workFlow';
import axios from 'axios';
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

    // async submitWorkFlow(workFlow: workFlow) {
    //   try {
    //     const instance = Constants.getAxiosInstance();
    //    const response = await instance.put(
    //       `${Constants.endPointUrl}/workflow/${workFlow.id}`,
    //       workFlow
    //     );
    //     if (response.status === 200) {
    //       //debugger;
    //       this.workFlow = response.data;
    //     }
    //   } catch (error) {
    //     console.error(`workFlow Error: ${error}`);
    //   }
    // },

    async submitWorkFlow(workFlow: workFlow) {
      console.log('new workFlow Object', workFlow);

      const callStr = `${Constants.endPointUrl}/workflow-summary`;
      await fetch(callStr, {
        method: 'POST',
        body: JSON.stringify(workFlow),
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('new workFlow Object', this.workFlow);
    },
  },
});
