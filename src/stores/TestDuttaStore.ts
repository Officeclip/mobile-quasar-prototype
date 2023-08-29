import { defineStore } from 'pinia';
import axios from 'axios';
import { TestDutta } from '../models/testDutta';

export const useTestDuttaStore = defineStore('testDuttaStore', {
  state: () => ({
    testDutta: undefined as TestDutta | undefined, // for single event access
  }),
  getters: {
    TestDutta: (state) => state.testDutta,
  },
  actions: {
    async getDuttaTestById(id: number) {
      try {
        const response = await axios.get(
          `http://localhost:4000/testDuttas?id=${id}`
        );
        this.testDutta = response.data[0];
        console.log(
          `TestDuttaStore: getDuttaTestById - length - ${response.data.length}, ${this.testDutta?.startDateTime}`
        );
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
  },
});
