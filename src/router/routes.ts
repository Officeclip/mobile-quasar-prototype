import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  // {
  //   path: '/',
  //   component: () => import('layouts/MainLayout.vue'),
  //   children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  // },
  {
    path: '/',
    name: 'LoginPage',
    component: () => import('pages/LoginPage.vue'),
  },
  {
    path: '/homePage',
    name: 'homePage',
    component: () => import('pages/HomePage.vue'),
  },
  {
    path: '/contactSummary',
    name: 'contactSummary',
    component: () => import('pages/Contacts/ContactSummary.vue'),
  },
  {
    path: '/contactDetails/:id',
    name: 'contactDetails',
    component: () => import('pages/Contacts/ContactDetails.vue'),
    //params: true,
  },
  {
    path: '/editContactDetails/:id',
    name: 'editContactDetails',
    component: () => import('pages/Contacts/EditContactDetails.vue'),
    //params: true,
  },
  {
    path: '/editMetaDetail/:id',
    name: 'editMetaDetail',
    component: () => import('pages/Meta/EditMetaDetail.vue'),
    //params: true,
  },
  {
    path: '/newContact',
    name: 'newContact',
    component: () => import('pages/Contacts/NewContact.vue'),
    //params: true,
  },
  {
    path: '/eventSummary',
    name: 'eventSummary',
    component: () => import('pages/Events/eventSummary.vue'),
  },
  {
    path: '/eventDetails/:id',
    name: 'eventDetails',
    component: () => import('pages/Events/EventDetails.vue'),
  },
  {
    path: '/newEvent/:id',
    name: 'newEvent',
    component: () => import('pages/Events/NewEvent.vue'),
  },
  {
    path: '/editEvent/:id',
    name: 'editEvent',
    component: () => import('pages/Events/EditEvent.vue'),
  },
  {
    path: '/noteDetails/:id',
    name: 'noteDetails', //FIXME: change this to noteDetails
    component: () => import('../pages/Notes/NoteDetails.vue'),
    // params: true,
  },
  {
    path: '/editNote/:id',
    name: 'editNote',
    component: () => import('../pages/Notes/EditNotes.vue'),
    // params: true,
  },
  {
    path: '/newNotes/:id',
    name: 'newNotes',
    component: () => import('../pages/Notes/NewNotes.vue'),
    // params: true,
  },
  {
    path: '/notesList',
    name: 'notesList',
    component: () => import('../pages/Notes/NotesList.vue'),
    // params: true,
  },
  {
    path: '/tasksList',
    name: 'tasksList',
    component: () => import('../pages/Tasks/TasksList.vue'),
    // params: true,
  },
  {
    path: '/taskDetails/:id',
    name: 'taskDetails',
    component: () => import('../pages/Tasks/TaskDetails.vue'),
    // params: true,
  },
  {
    path: '/editTask/:id',
    name: 'editTask',
    component: () => import('../pages/Tasks/EditTask.vue'),
    // params: true,
  },
  {
    path: '/newTask/:id',
    name: 'newTask',
    component: () => import('../pages/Tasks/NewTask.vue'),
    // params: true,
  },
  {
    path: '/testMe/:id',
    name: 'testMe',
    component: () => import('../pages/TestMe.vue'),
  },
  {
    path: '/timesheetL/:id',
    name: 'timesheetL',
    component: () => import('../pages/CustomerProjectList.vue'),
  },
  {
    path: '/formData',
    name: 'formData',
    component: () => import('../pages/ParentComponent.vue'),
  },
  {
    path: '/kRegarding',
    name: 'kRegarding',
    component: () => import('../pages/kRegarding.vue'),
  },
  {
    path: '/coloredDdOptions',
    name: 'coloredDdOptions',
    component: () => import('../pages/coloredDdOptions.vue'),
  },
  {
    path: '/attachmentsTest',
    name: 'attachmentsTest',
    component: () => import('../pages/attachmentsTest.vue'),
  },
  {
    path: '/timesheetsAll',
    name: 'timesheetsAll',
    component: () => import('../pages/Timesheets/TimesheetsAll.vue'),
    // params: true,
  },
  // {
  //   path: '/timesheetsList/:id/:status',
  //   name: 'timesheetsList',
  //   component: () => import('../pages/Timesheets/TimesheetsList.vue'),
  //   // params: true,
  // },
  {
    path: '/timesheetDetails/:id',
    name: 'timesheetDetails',
    component: () => import('../pages/Timesheets/TimesheetDetails.vue'),
    // params: true,
  },
  {
    path: '/newTimesheetPeriod',
    name: 'newTimesheetPeriod',
    component: () => import('../pages/Timesheets/NewTimesheetPeriod.vue'),
    // params: true,
  },
  {
    path: '/newTimesheet',
    name: 'newTimesheet',
    component: () => import('../pages/Timesheets/NewTimesheet.vue'),
    // params: true,
  },
  {
    path: '/editTimesheet/:id',
    name: 'editTimesheet',
    component: () => import('../pages/Timesheets/EditTimesheet.vue'),
    // params: true,
  },
  {
    path: '/expenseSummary',
    name: 'expenseSummary',
    component: () => import('../pages/Expenses/expenseSummary.vue'),
    // params: true,
  },
  {
    path: '/expenseSummaryFiltered/:id/:status',
    name: 'expenseSummaryFiltered',
    component: () => import('../pages/Expenses/expenseSummaryFiltered.vue'),
    // params: true,
  },
  {
    path: '/expenseDetails/:id',
    name: 'expenseDetails',
    component: () => import('../pages/Expenses/ExpenseDetails.vue'),
    // params: true,
  },
  {
    path: '/newExpense/:period',
    name: 'newExpense',
    component: () => import('../pages/Expenses/NewExpense.vue'),
    // params: true,
  },
  {
    path: '/newPeriodExpense',
    name: 'newPeriodExpense',
    component: () => import('../pages/Expenses/NewPeriodExpense.vue'),
    // params: true,
  },
  {
    path: '/editExpense/:id/:expenseSid',
    name: 'editExpense',
    component: () => import('../pages/Expenses/EditExpense.vue'),
    // params: true,
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
