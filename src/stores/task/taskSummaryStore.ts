import { defineStore } from 'pinia';
import { taskSummary } from 'src/models/task/taskSummary';
import { Constants } from 'stores/Constants';
import { searchFilter } from 'src/models/task/searchFilter';
import { linkHeader } from 'src/models/general/linkHeader';

export const useTaskSummaryStore = defineStore('taskSummaryStore', {
  state: () => ({
    taskSummaries: [] as taskSummary[],
    taskSummary: undefined as taskSummary | undefined,
    url: '' as string,
    pageSize: 5,
    pageNum: 1,
    filter: {} as searchFilter,
    parentObjectId: 0,
    parentObjectServiceType: 0,
    links: {} as linkHeader,
  }),

  getters: {
    TaskSummaries: (state) => state.taskSummaries,
    TaskSummary: (state) => state.taskSummary,
    IsParentPresent: (state) =>
      state.parentObjectId > 0 && state.parentObjectServiceType > 0,
    IsEmptyLinkHeader: (state) => Object.keys(state.links).length == 0, // https://stackoverflow.com/a/52742880
  },

  actions: {
    constructBaseURL() {
      let baseUrl = `${Constants.endPointUrl}/task-summary`;
      if (this.IsParentPresent) {
        baseUrl += `?parentObjectId=${this.parentObjectId}&parentObjectServiceType=${this.parentObjectServiceType}`;
      }
      return baseUrl;
    },

    constructQueryParams() {
      const queryParams = new URLSearchParams();
      const params: searchFilter = this.filter;
      const filterKeys = Object.keys(params);
      //TODO: CR: 2024-05-17: nk: Fix the below type error?
      filterKeys.forEach((key) => {
        if (this.filter[key]) {
          queryParams.append(key, String(this.filter[key]));
        }
      });
      return queryParams;
    },

    getUrl() {
      if (this.IsParentPresent) {
        return this.constructBaseURL();
      }
      let callStr = '';
      if (!this.IsEmptyLinkHeader) {
        callStr = `${this.links}`;
      } else {
        callStr = this.constructBaseURL();
        const queryParams = this.constructQueryParams();
        const queryString = queryParams.toString();
        callStr += queryString ? `?${queryString}` : '';
      }
      this.url = callStr;
    },

    setFilter(searchFilter: searchFilter) {
      this.filter = searchFilter;
    },

    resetPageNumber() {
      this.pageNum = 1;
      this.links = {} as linkHeader; // https://stackoverflow.com/a/45339463
    },

    async getTasksUpdated(isFilter: boolean): Promise<boolean> {
      this.getUrl();
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(this.url);
        const summaries = response.data.data;
        if (isFilter) {
          await this.resetTaskSummaryList();
        }
        this.taskSummaries.push(...summaries);
        this.links = response.data.pagination.next || '{}';
        this.url = this.links ? `${this.links}` : '';
      } catch (error) {
        Constants.throwError(error);
      }
      return this.url === 'null';
    },

    async getTasks(parentObjectId: number, parentObjectServiceType: number) {
      const callStr =
        parentObjectId > 0 && parentObjectServiceType > 0
          ? `${Constants.endPointUrl}/task-summary?parentObjectId=${parentObjectId}&parentObjectServiceType=${parentObjectServiceType}`
          : `${Constants.endPointUrl}/task-summary`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(callStr);
        this.taskSummaries = response.data;
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async getTask(id: number | string) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${Constants.endPointUrl}/task-summary?id=${id}`
        );
        this.taskSummary = response.data[0];
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async getTasksByParent(parentObjectId: string) {
      const callStr = `${Constants.endPointUrl}/task-summary?parentSid=${parentObjectId}`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(callStr);
        this.taskSummaries = response.data.data;
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async addTask(taskSummary: taskSummary) {
      try {
        this.taskSummaries.push(taskSummary);
        const instance = Constants.getAxiosInstance();
        const response = await instance.post(
          `${Constants.endPointUrl}/task-summary`,
          taskSummary
        );
        if (response.status === 200) {
          await this.getTask(taskSummary.id);
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async editTask(taskSummary: taskSummary) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.put(
          `${Constants.endPointUrl}/task-summary/${taskSummary.id}`,
          taskSummary
        );
        if (response.status === 200) {
          this.taskSummary = response.data;
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async deleteTask(id: any) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.delete(
          `${Constants.endPointUrl}/task-summary/${id}`
        );
        if (response.status === 200) {
          this.taskSummary = response.data;
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async resetTaskSummaryList() {
      this.taskSummaries = [];
    },
  },
});
