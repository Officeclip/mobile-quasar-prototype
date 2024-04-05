import { defineStore } from 'pinia';
import {
  TimesheetComments,
  Comments,
} from 'src/models/Timesheet/timesheetComments';
import axios from 'axios';
import { Constants } from '../Constants';

export const useTimesheetCommentsStore = defineStore('timesheetCommentsStore', {
  state: () => ({
    commentsList: [] as Comments[],
  }),

  getters: {
    CommentsList: (state) => state.commentsList,
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
