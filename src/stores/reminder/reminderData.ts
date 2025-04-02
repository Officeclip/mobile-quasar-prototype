import { defineStore } from 'pinia';
import { Constants } from '../Constants';

export const useReminderDataStore = defineStore('reminderDataStore', {
  state: () => ({
    reminderOptions: [] as any,
    reminderTimes: [] as any,
  }),

  getters: {
    ReminderOptions: (state) => state.reminderOptions,
    ReminderTimes: (starte) => starte.reminderTimes,
  },

  actions: {
    getReminderObject() {
      const reminderOptions = [
        { label: 'Remind Me', value: 'Remind Me' },
        { label: 'Remind Everybody', value: 'Remind Everybody' },
      ];

      const reminderTimes = [
        { label: '5 Minutes', value: 5 },
        { label: '10 Minutes', value: 10 },
        { label: '15 Minutes', value: 15 },
        { label: '30 Minutes', value: 30 },
        { label: '45 Minutes', value: 45 },
        { label: '1 Hour', value: 60 },
        { label: '2 Hours', value: 120 },
        { label: '3 Hours', value: 180 },
        { label: '4 Hours', value: 240 },
        { label: '5 Hours', value: 300 },
        { label: '6 Hours', value: 360 },
        { label: '7 Hours', value: 420 },
        { label: '8 Hours', value: 480 },
        { label: '9 Hours', value: 540 },
        { label: '10 Hours', value: 600 },
        { label: '11 Hours', value: 660 },
        { label: '12 Hours', value: 720 },
        { label: '1 day', value: 1440 },
        { label: '2 days', value: 2880 },
        { label: '3 days', value: 4320 },
        { label: '4 days', value: 5760 },
        { label: '5 days', value: 7200 },
        { label: '1 week', value: 10080 },
        { label: '2 weeks', value: 20160 },
      ];
      try {
        this.reminderOptions = reminderOptions;
        this.reminderTimes = reminderTimes;
      } catch (error) {
        Constants.throwError(error);
      }
    },
  },
});
