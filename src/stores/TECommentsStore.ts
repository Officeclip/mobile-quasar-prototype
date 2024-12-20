import { defineStore } from 'pinia';
import { Comments, DCAA, TimesheetDCAA } from 'src/models/teComments';
import { Constants } from './Constants';
import util from 'src/helpers/util';

export const useTECommentsStore = defineStore('teCommentsStore', {
  state: () => ({
    commentsList: [] as Comments[],
    timesheetDCAA: {} as TimesheetDCAA,
    tDCAA: {} as DCAA,
  }),

  getters: {
    CommentsList: (state) => state.commentsList,
    TimesheetDCAA: (state) => state.timesheetDCAA,
    DCAA: (state) => state.tDCAA,
  },

  actions: {
    async getTimesheetComments(timesheetSid: string | object) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.getEndPointUrl()}/te-comments?category=timesheet&id=${timesheetSid}`
        );
        const newData = response.data;
        this.commentsList = newData;
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async getExpenseComments(expenseSid: string | string[]) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.getEndPointUrl()}/te-comments?category=expense&id=${expenseSid}`
        );
        const newData = response.data;
        this.commentsList = newData;
      } catch (error) {
        Constants.throwError(error);
      }
    },

    // CR:Nagesh: We need to move this function to a separte file.
    async getTimesheetGroupProfile() {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.getEndPointUrl()}/timesheet-group-profile`
        );
        const newData = response.data[0];
        this.timesheetDCAA = newData;
        this.tDCAA = newData.dcaa;
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async addComment(comment: Comments) {
      try {
        this.commentsList.push(comment);
        const instance = Constants.getAxiosInstance();
        const response = await instance.post(
          `${util.getEndPointUrl()}/timesheet-comments`,
          comment
        );
        if (response.status === 200) {
          await this.getTimesheetComments(comment.id);
        } else {
          console.error(response);
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },
  },
});
