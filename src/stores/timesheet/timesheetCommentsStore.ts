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
    async getTimesheetComments(timesheetId: string | string[]) {
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}/timesheet-comments/${timesheetId}`
        );
        const newData = response.data;
        const commentsList = newData.comments;
        this.commentsList = commentsList;
      } catch (error) {
        console.error(error);
      }
    },
  },
});
