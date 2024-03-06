import { defineStore } from 'pinia';
import axios from 'axios';
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

      filterKeys.forEach((key) => {
        if (this.filter[key]) {
          queryParams.append(key, String(this.filter[key]));
        }
      });

      // queryParams.append('pagesize', String(this.pageSize));
      // queryParams.append('pagenumber', String(this.pageNum));

      return queryParams;
    },

    getUrl(isFilter: boolean) {
      //if (this.url) return;

      if (this.IsParentPresent) {
        // parent does not need paging
        return this.constructBaseURL();
      }

      let callStr = '';
      //if (this.links?.next) {
      if (!this.IsEmptyLinkHeader) {
        callStr = `${Constants.endPointUrl}/${this.links.next}`;
      } else {
        callStr = this.constructBaseURL();
        const queryParams = this.constructQueryParams();
        const queryString = queryParams.toString();
        callStr += queryString ? `?${queryString}` : '';
      }

      this.url = callStr;
      // if (isFilter) {
      //   //const queryParams = this.constructQueryParams();
      //   this.url += '&' + queryParams;
      // }
    },

    setFilter(searchFilter: searchFilter) {
      this.filter = searchFilter;
    },

    resetPageNumber() {
      this.pageNum = 1;
      this.links = {} as linkHeader; // https://stackoverflow.com/a/45339463
    },

    async getTasksUpdated(isFilter: boolean): Promise<boolean> {
      this.getUrl(isFilter);
      console.log(
        `taskSummaryStore: getTasksUpdated: Url: ${
          this.url
        }, QueryParam: ${this.constructQueryParams()}, isFilter: ${isFilter}, Filter: ${JSON.stringify(
          this.filter
        )}`
      );

      try {
        // console.log("URL called", this.url);
        const res = await axios.get(this.url);
        const summaries = res.data;
        this.taskSummaries.push(...summaries);

        this.links = JSON.parse(res.headers.get('Links') || '{}');
        this.url = this.links.next
          ? `${Constants.endPointUrl}${this.links.next}`
          : '';
        // console.log("next url from header", this.url);
      } catch (error) {
        console.error(error);
      }
      return this.url === '';
    },

    async getTasks(parentObjectId: number, parentObjectServiceType: number) {
      // console.log(`TasksStore: getTasks: parameters: ${parentObjectId}, ${parentObjectServiceType}`);
      const callStr =
        parentObjectId > 0 && parentObjectServiceType > 0
          ? `${Constants.endPointUrl}/task-summary?parentObjectId=${parentObjectId}&parentObjectServiceType=${parentObjectServiceType}`
          : `${Constants.endPointUrl}/task-summary`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(callStr);
        this.taskSummaries = response.data;
      } catch (error) {
        console.error(error);
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
        console.error(error);
      }
    },

    async addTask(taskSummary: taskSummary) {
      this.taskSummaries.push(taskSummary);

      const res = await axios.post(
        `${Constants.endPointUrl}/task-summary`,
        taskSummary
      );

      if (res.status === 200) {
        await this.getTask(taskSummary.id);
      } else {
        console.error(res);
      }
    },

    async editTask(taskSummary: taskSummary) {
      console.log(`editTask: ${this.taskSummary?.id}`);
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
        console.error(`editTask Error: ${error}`);
      }
    },

    async deleteTask(id: any) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.delete(
          `${Constants.endPointUrl}/task-summary/${id}`
        );
        if (response.status === 200) {
          //debugger;
          this.taskSummary = response.data;
          //  console.log(`editNote 3: ${this.note?.title}`);
        }
      } catch (error) {
        console.error(`deleteNote Error: ${error}`);
      }
    },

    async resetTaskSummaryList() {
      this.taskSummaries = [];
    },
  },
});
