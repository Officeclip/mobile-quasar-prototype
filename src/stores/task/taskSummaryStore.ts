import {defineStore} from 'pinia';
import axios from 'axios';
import {taskSummary} from "src/models/task/taskSummary";
import {Constants} from "stores/Constants";
import {searchFilter} from "src/models/task/searchFilter";
import {linkHeader} from "src/models/general/linkHeader";

export const useTaskSummaryStore = defineStore('taskSummaryStore', {
  state: () => ({
    taskSummaries: [] as taskSummary[],
    taskSummary: undefined as taskSummary | undefined,
    url: '' as string,
    pageSize: 10,
    pageNum: 1,
    filter: {} as searchFilter,
    parentObjectId: 0,
    parentObjectServiceType: 0,
    links: {} as linkHeader,

  }),

  getters: {
    TaskSummaries: (state) => state.taskSummaries,
    TaskSummary: (state) => state.taskSummary,
  },

  actions: {
    constructBaseURL() {
      let baseUrl = `${Constants.endPointUrl}/task-summary?`;
      if (this.parentObjectId > 0 && this.parentObjectServiceType > 0) {
        baseUrl += `/task-summary?parentObjectId=${this.parentObjectId}&parentObjectServiceType=${this.parentObjectServiceType}`;
      }
      return baseUrl;
    },

    constructQueryParams() {
      const queryParams = new URLSearchParams();
      const filterKeys = Object.keys(this.filter);

      filterKeys.forEach(key => {
        if (this.filter[key]) {
          queryParams.append(key, String(this.filter[key]));
        }
      });

      queryParams.append('pageSize', String(this.pageSize));
      queryParams.append('pageNum', String(this.pageNum));

      return queryParams;
    },

    getUrl() {
      if (this.url) return;

      let callStr = '';
      if (this.links?.next) {
        callStr = `${Constants.endPointUrl}/${this.links.next}`;
      } else {
        callStr = this.constructBaseURL();
        const queryParams = this.constructQueryParams();
        const queryString = queryParams.toString();
        callStr += queryString ? `&${queryString}` : '';
      }

      this.url = callStr;
    },

    setFilter(searchFilter:searchFilter){
      this.filter = searchFilter;
    },

    async getTasksUpdated(): Promise<boolean> {
      this.getUrl();

      try {
        // console.log("URL called", this.url);
        const res = await axios.get(this.url);
        const summaries = res.data;
        this.taskSummaries.push(...summaries);

        this.links = JSON.parse(res.headers.get('Links') || '{}');
        this.url = this.links.next ? `${Constants.endPointUrl}${this.links.next}` : '';
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
        const response = await axios.get(callStr);
        this.taskSummaries = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    async getTask(id: number | string) {
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}/task-summary?id=${id}`
        );
        this.taskSummary = response.data[0];
      } catch (error) {
        console.error(error);
      }
    },

    async addTask(taskSummary: taskSummary) {
      this.taskSummaries.push(taskSummary);

      const res = await axios.post(`${Constants.endPointUrl}/task-summary`, taskSummary);

      if (res.status === 200) {
        await this.getTask(taskSummary.id);
      } else {
        console.error(res);
      }
    },

    async editTask(taskSummary: taskSummary) {
      console.log(`editTask: ${this.taskSummary?.id}`);
      try {
        const response = await axios.put(
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
        const response = await axios.delete(
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

    async getFilteredTasksNew(filterOptions: searchFilter, parentObjectId: number, parentObjectServiceType: number) {
      // Base URL for the API call
      const apiUrl = `${Constants.endPointUrl}/task-summary`;

      // Parameters to be sent in the query string
      const queryParams = new URLSearchParams();

      // Check if parentObjectId and parentObjectServiceType are provided
      if (parentObjectId > 0 && parentObjectServiceType > 0) {
        queryParams.append('parentObjectId', parentObjectId.toString());
        queryParams.append('parentObjectServiceType', parentObjectServiceType.toString());
      }

      if (filterOptions.filterString) {
        queryParams.append('filterString', filterOptions.filterString);
      }
      if (filterOptions.dueDateValue) {
        queryParams.append('dueDateValue', filterOptions.dueDateValue);
      }
      if (filterOptions.dueDateOption) {
        queryParams.append('dueDateOption', filterOptions.dueDateOption);
      }
      if (filterOptions.modifiedDateValue) {
        queryParams.append('modifiedDateValue', filterOptions.modifiedDateValue);
      }
      if (filterOptions.modifiedDateOption) {
        queryParams.append('modifiedDateOption', String(filterOptions.modifiedDateOption));
      }
      if (filterOptions.statusId) {
        queryParams.append('statusId', String(filterOptions.statusId));
      }
      if (filterOptions.priorityId) {
        queryParams.append('priorityId', String(filterOptions.priorityId));
      }
      if (filterOptions.taskTypeId) {
        queryParams.append('taskTypeId', String(filterOptions.taskTypeId));
      }
      if (filterOptions.ownedById) {
        queryParams.append('ownedById', String(filterOptions.ownedById));
      }
      if (filterOptions.assignedToId) {
        queryParams.append('assignedToId', String(filterOptions.assignedToId));
      }
      if (filterOptions.regardingValueId) {
        queryParams.append('regardingValueId', String(filterOptions.regardingValueId));
      }
      if (filterOptions.regardingTypeId) {
        queryParams.append('regardingTypeId', String(filterOptions.regardingTypeId));
      }
      if (filterOptions.showCompleted) {
        queryParams.append('showCompleted', String(filterOptions.showCompleted));
      }

      // Construct the full API URL with query parameters
      const fullApiUrl = `${apiUrl}?${queryParams.toString()}`;
      console.log(fullApiUrl);

      try {
        const response = await axios.get(fullApiUrl);
        this.taskSummaries = response.data;
        console.log(this.taskSummaries);
      } catch (error) {
        console.error(error);
      }
    },

    async getTasksWithFilterString(val: string, parentObjectId: number, parentObjectServiceType: number) {
      const callStr =
        parentObjectId > 0 && parentObjectServiceType > 0
          ? `${Constants.endPointUrl}/task-summary?parentObjectId=${parentObjectId}&parentObjectServiceType=${parentObjectServiceType}&filterString=${val}`
          : `${Constants.endPointUrl}/task-summary?filterString=${val}`;
      try {
        const response = await axios.get(callStr);
        const taskSummaries = response.data;
        // const filtered = taskSummaries.filter((t: taskSummary) => {
        //   return t.subject.toLowerCase().includes(val.toLowerCase());
        // });
        this.taskSummaries = taskSummaries;
      } catch (error) {
        console.error(error);
      }
    },

    async resetTaskSummaryList() {
      this.taskSummaries = [];
    }
  },
});
