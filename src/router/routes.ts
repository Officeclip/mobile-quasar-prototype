import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  // {
  //   path: '/',
  //   component: () => import('layouts/MainLayout.vue'),
  //   children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  // },
  {
    path: '/',
    name: 'loginPage',
    component: () => import('pages/LoginPage.vue'),
  },
  {
    path: '/loginPage2',
    name: 'loginPage2',
    component: () => import('pages/LoginPage2.vue'),
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
  },
  {
    path: '/editContactDetails/:id',
    name: 'editContactDetails',
    component: () => import('pages/Contacts/EditContactDetails.vue'),
  },
  {
    path: '/editMetaDetail/:id',
    name: 'editMetaDetail',
    component: () => import('pages/Meta/EditMetaDetail.vue'),
  },
  {
    path: '/newContact',
    name: 'newContact',
    component: () => import('pages/Contacts/NewContact.vue'),
  },
  {
    path: '/eventSummary',
    name: 'eventSummary',
    component: () => import('pages/Events/eventSummary.vue'),
  },
  {
    path: '/eventDetails/:id/:appName',
    name: 'eventDetails',
    component: () => import('pages/Events/EventDetails.vue'),
  },
  {
    path: '/newEvent/:id/:objectTypeId/:objectId/:appName',
    name: 'newEvent',
    component: () => import('pages/Events/NewEvent.vue'),
  },
  {
    path: '/editEvent/:id/:appName',
    name: 'editEvent',
    component: () => import('pages/Events/EditEvent.vue'),
  },
  {
    path: '/noteDetails/:id/:objectTypeId/:objectId',
    name: 'noteDetails',
    component: () => import('../pages/Notes/NoteDetails.vue'),
  },
  {
    path: '/editNote/:id/:objectTypeId/:objectId',
    name: 'editNote',
    component: () => import('../pages/Notes/EditNotes.vue'),
  },
  {
    path: '/newNotes/:id/:objectTypeId/:objectId',
    name: 'newNotes',
    component: () => import('../pages/Notes/NewNotes.vue'),
  },
  {
    path: '/notesList',
    name: 'notesList',
    component: () => import('../pages/Notes/NotesList.vue'),
  },
  {
    path: '/tasksList',
    name: 'tasksList',
    component: () => import('../pages/Tasks/TasksList.vue'),
  },
  {
    path: '/taskDetails/:id/:appName',
    name: 'taskDetails',
    component: () => import('../pages/Tasks/TaskDetails.vue'),
  },
  {
    path: '/editTask/:id/:appName',
    name: 'editTask',
    component: () => import('../pages/Tasks/EditTask.vue'),
  },
  {
    path: '/newTask/:id/:objectTypeId/:objectId/:appName',
    name: 'newTask',
    component: () => import('../pages/Tasks/NewTask.vue'),
  },
  {
    path: '/testMe/:id',
    name: 'testMe',
    component: () => import('../pages/TestMe.vue'),
  },
  {
    path: '/loginPage',
    name: 'dTest',
    component: () => import('../pages/LoginPage.vue'),
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
    path: '/calEventsTest',
    name: 'calEventsTest',
    component: () => import('../pages/calEventsTest.vue'),
  },

  {
    path: '/timesheetsAll',
    name: 'timesheetsAll',
    component: () => import('../pages/Timesheets/TimesheetsAll.vue'),
  },
  {
    path: '/timesheetDetails/:id/:fromDate/:toDate/:stageId/:status/:mode/:employeeId',
    name: 'timesheetDetails',
    component: () => import('../pages/Timesheets/TimesheetDetails.vue'),
  },
  {
    path: '/newTimesheetPeriod',
    name: 'newTimesheetPeriod',
    component: () => import('../pages/Timesheets/NewTimesheetPeriod.vue'),
  },
  {
    path: '/newTimesheet/:timesheetSid/:fromDate/:toDate',
    name: 'newTimesheet',
    component: () => import('../pages/Timesheets/NewTimesheet.vue'),
  },
  {
    path: '/editTimesheet/:id/:fromDate/:toDate',
    name: 'editTimesheet',
    component: () => import('../pages/Timesheets/EditTimesheet.vue'),
  },
  {
    path: '/expensesAll/',
    name: 'expensesAll',
    component: () => import('../pages/Expenses/ExpensesAll.vue'),
  },
  {
    path: '/expenseDetails/:id/:fromDate/:toDate/:stageId/:status/:employeeId',
    name: 'expenseDetails',
    component: () => import('../pages/Expenses/ExpenseDetails.vue'),
  },
  {
    path: '/newExpense/:expenseSid/:fromDate/:toDate',
    name: 'newExpense',
    component: () => import('../pages/Expenses/NewExpense.vue'),
  },
  {
    path: '/newPeriodExpense',
    name: 'newPeriodExpense',
    component: () => import('../pages/Expenses/NewPeriodExpense.vue'),
  },
  {
    path: '/editExpense/:id/:expenseSid/:fromDate/:toDate',
    name: 'editExpense',
    component: () => import('../pages/Expenses/EditExpense.vue'),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
