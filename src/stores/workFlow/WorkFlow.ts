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
    async getWorkFlow(entityId: string, entityType: string) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${Constants.endPointUrl}/workflow?entityId=${entityId}&&entityType=${entityType}`
        );
        this.workFlow = response.data[0];
        this.workFlowUsers = response.data[0].users;
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
      const callStr = `${Constants.endPointUrl}/workflow`;
      await fetch(callStr, {
        method: 'POST',
        body: JSON.stringify(workFlow),
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('new workFlow Object', this.workFlow);
    },
  },
});
