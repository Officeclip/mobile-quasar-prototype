import { defineStore } from 'pinia';
import { Comments, TimesheetDCAA } from 'src/models/teComments';
import { Constants } from './Constants';

export const useTECommentsStore = defineStore('teCommentsStore', {
  state: () => ({
    commentsList: [] as Comments[],
    timesheetDCAA: [] as TimesheetDCAA[],
  }),

  getters: {
    CommentsList: (state) => state.commentsList,
    TimesheetDCAA: (state) => state.timesheetDCAA,
  },

  actions: {
    async getTimesheetComments(timesheetSid: string | string[]) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${Constants.endPointUrl}/te-comments?category=timesheet&id=${timesheetSid}`
        );
        const newData = response.data;
        this.commentsList = newData;
      } catch (error) {
        console.error(error);
      }
    },

    async getExpenseComments(expenseSid: string | string[]) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${Constants.endPointUrl}/te-comments?category=expense&id=${expenseSid}`
        );
        const newData = response.data;
        this.commentsList = newData;
      } catch (error) {
        console.error(error);
      }
    },

    async getTimesheetGroupProfile() {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${Constants.endPointUrl}/timesheet-group-profile`
        );
        const newData = response.data[0];
        this.timesheetDCAA = newData;
      } catch (error) {
        console.error(error);
      }
    },

    async addComment(comment: Comments) {
      this.commentsList.push(comment);
      const instance = Constants.getAxiosInstance();
      const response = await instance.post(
        `${Constants.endPointUrl}/timesheet-comments`,
        comment
      );

      if (response.status === 200) {
        await this.getTimesheetComments(comment.id);
      } else {
        console.error(response);
      }
    },
  },
});
