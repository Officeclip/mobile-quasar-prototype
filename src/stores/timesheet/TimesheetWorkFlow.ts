import { defineStore } from 'pinia';
import { workFlow, users } from '../../models/workFlow';
import axios from 'axios';
import { Constants } from 'stores/Constants';

export const useTimesheetWorkFlowStore = defineStore('timesheetWorkFlowStore', {
  state: () => ({
    workFlow: undefined as workFlow | undefined,
    workFlowUsers: [] as users[],
  }),

  getters: {
    TimesheetWorkFlow: (state) => state.workFlow,
    WorkFlowUsers: (state) => state.workFlowUsers,
  },

  actions: {
    async getTimesheetWorkFlow() {
      try {
        const response = await axios.get(`${Constants.endPointUrl}/workflow`);
        this.workFlow = response.data[0];
        this.workFlowUsers = response.data[0].users;
      } catch (error) {
        console.error(error);
      }
    },

    async submitWorkFlow(workFlow: workFlow) {
      try {
        const response = await axios.put(
          `${Constants.endPointUrl}/workflow/${workFlow.id}`,
          workFlow
        );
        if (response.status === 200) {
          //debugger;
          this.workFlow = response.data;
        }
      } catch (error) {
        console.error(`workFlow Error: ${error}`);
      }
    },
  },
});
