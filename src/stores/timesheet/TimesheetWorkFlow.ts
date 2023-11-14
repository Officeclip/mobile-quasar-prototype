import { defineStore } from 'pinia';
// import { Timesheet } from '../../models/Timesheet/timesheet';
// import { TimesheetDetails } from '../../models/Timesheet/timesheetDetails';
import axios from 'axios';
import { Constants } from 'stores/Constants';

export const useTimesheetWorkFlowStore = defineStore('timesheetWorkFlowStore', {
  state: () => ({
    workFlow: [],
    workFlowUsers: [],
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
        console.log('CHJCHJHCJHJCHC Workflow', this.workFlowUsers);
      } catch (error) {
        console.error(error);
      }
    },
  },
});
