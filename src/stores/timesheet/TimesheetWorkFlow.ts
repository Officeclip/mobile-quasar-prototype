import { defineStore } from 'pinia';
import { workFlow, users } from '../../models/workFlow';
import axios from 'axios';
import { Constants } from 'stores/Constants';

export const useTimesheetWorkFlowStore = defineStore('timesheetWorkFlowStore', {
  state: () => ({
    workFlow: {} as workFlow,
    workFlowUsers: [] as users[],
  }),

  getters: {
    TimesheetWorkFlow: (state) => state.workFlow,
    WorkFlowUsers: (state) => state.workFlowUsers,
  },

  actions: {
    async getTimesheetWorkFlow(entityId: string, entityType: string) {
      try {
        const response = await axios.get(
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
    //     const response = await axios.put(
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
