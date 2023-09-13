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
    path: '/contactList',
    name: 'contactList',
    component: () => import('pages/Contacts/ContactList.vue'),
  },
  {
    path: '/contactDetails/:id',
    name: 'contactDetails',
    component: () => import('pages/Contacts/ContactDetails.vue'),
    //params: true,
  },
  {
    path: '/editContactSummary/:id',
    name: 'editContactSummary',
    component: () => import('pages/Contacts/EditContactSummary.vue'),
    //params: true,
  },
  {
    path: '/newContact',
    name: 'newContact',
    component: () => import('pages/Contacts/NewContact.vue'),
    //params: true,
  },
  {
    path: '/simpleCalendar',
    name: 'simpleCalendar',
    component: () => import('pages/SimpleCalendar.vue'),
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
    path: '/incrementalLoading',
    name: 'incrementalLoading',
    component: () => import('../pages/IncrementalList.vue'),
  },
  {
    path: '/timesheetsAll',
    name: 'timesheetsAll',
    component: () => import('../pages/Timesheets/TimesheetsAll.vue'),
    // params: true,
  },
  {
    path: '/timesheetsList/:id/:status',
    name: 'timesheetsList',
    component: () => import('../pages/Timesheets/TimesheetsList.vue'),
    // params: true,
  },
  {
    path: '/timesheetDetails/:id',
    name: 'timesheetDetails',
    component: () => import('../pages/Timesheets/TimesheetDetails.vue'),
    // params: true,
  },
  {
    path: '/newTimesheet/:id',
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
    path: '/expensesAll',
    name: 'expensesAll',
    component: () => import('../pages/Expenses/ExpensesAll.vue'),
    // params: true,
  },
  {
    path: '/expenseList/:id/:status',
    name: 'expenseList',
    component: () => import('../pages/Expenses/ExpenseList.vue'),
    // params: true,
  },
  {
    path: '/newExpense/:id',
    name: 'newExpense',
    component: () => import('../pages/Expenses/NewExpense.vue'),
    // params: true,
  },
  {
    path: '/editExpense/:id',
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
