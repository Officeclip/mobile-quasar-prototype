import { format } from 'date-fns';
import { parse } from 'date-fns';
import { addHours } from 'date-fns';
import { is } from 'quasar';

const dateTimeMask = 'EEE, MMM dd, yyyy hh:mm a';
const dateMask = 'EEE, MMM dd, yyyy';
const genericDateFormat = 'yyyy-MM-dd';
const calendarDateFormat = 'yyyy/MM/dd';
const teDatemask = 'MMM dd, yyyy';

const extractDateFromUtc = (utcDateTime: string | undefined) => {
  // See: https://stackoverflow.com/a/5515349/89256
  if (!utcDateTime) {
    return null;
  }

  const date = new Date(utcDateTime);
  return format(date, genericDateFormat);
};

const extractTimeFromUtc = (utcDateTime: string) => {
  if (!utcDateTime) {
    return null;
  }
  const utcDate = new Date(utcDateTime);
  const formattedTime = format(utcDate, 'hh:mm aaa');
  return formattedTime;
};

const formatDateandTimeFromUtc = (
  utcDateTimeStr: string,
  isAllDayEvent = false,
) => {
  if (!utcDateTimeStr) {
    return null;
  }
  const utcDate = new Date(utcDateTimeStr);
  if (isAllDayEvent) {
    return format(utcDate, 'EEE, MMM dd, yyyy');
  } else {
    return format(utcDate, 'EEE, MMM dd, yyyy hh:mm a');
  }
};

// populate dates between the start and end dates
const populateDates = (startDate: string, endDate: string) => {
  const newStartDate = getDateTimeFromRestAPI(startDate, true);
  const newEndDate = getDateTimeFromRestAPI(endDate, true);
  const dates = [];
  if (newStartDate == null || newEndDate == null) return null;
  while (newStartDate <= newEndDate) {
    const formattedDate = `${newStartDate.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
    })}(${newStartDate.toLocaleString('en-US', { weekday: 'short' })})`;

    dates.push({
      name: formattedDate,
      startDate: format(newStartDate, 'yyyy-MM-dd'),
    });

    newStartDate.setDate(newStartDate.getDate() + 1);
  }
  return dates;
};

const addHoursToDate = (date: Date, hours: number) => {
  return addHours(date, hours);
};

// Reads date from what is supplied by the rest api, in this case if there is a time conponent,
// it is converted to the localtime else the date is kept as-is
const getDateTimeFromRestAPI = (input: string, isDateOnly: boolean) => {
  if (!input || input === '') {
    return null;
  }
  let dt = new Date(input);
  if (isDateOnly) {
    // ** See: https://stackoverflow.com/a/52352512
    dt = new Date(dt.valueOf() + dt.getTimezoneOffset() * 60 * 1000);
  }
  return dt;
};

const formatDateTimeFromUIForRestAPI = (input: string, isDateOnly: boolean) => {
  if (!input || input === '') {
    return '';
  }
  const dt = new Date(input);
  const strDate = isDateOnly
    ? formatDateForGeneric(dt)
    : dt.toISOString().replace(/.\d+Z$/g, 'Z'); // see: https://stackoverflow.com/a/63267652
  return strDate;
};

const formatDateTimeForUI = (input: Date, isDateOnly: boolean) => {
  return isDateOnly ? format(input, dateMask) : format(input, dateTimeMask);
};

const formatDateForCalendar = (input: Date) => {
  return format(input, calendarDateFormat);
};

const formatDateForGeneric = (input: Date) => {
  return format(input, genericDateFormat);
};

const formatDateTimeFromRestAPIForUI = (input: string, isDateOnly: boolean) => {
  if (!input || input === '') {
    return '';
  }
  const dt = getDateTimeFromRestAPI(input, isDateOnly);
  if (dt === null) return '';
  return formatDateTimeForUI(dt, isDateOnly);
};

const convertCalendarDateForUI = (input: string) => {
  const date = parse(input, calendarDateFormat, new Date());
  return formatDateTimeForUI(date, true);
};

const formatDateForTE = (input: string) => {
  const dt = new Date(input);
  return format(dt, teDatemask);
};

export default {
  extractDateFromUtc,
  extractTimeFromUtc,
  formatDateandTimeFromUtc,
  populateDates,
  addHoursToDate,
  getDateTimeFromRestAPI,
  formatDateTimeFromUIForRestAPI,
  formatDateTimeFromRestAPIForUI,
  formatDateTimeForUI,
  formatDateForCalendar,
  formatDateForGeneric,
  convertCalendarDateForUI,
  formatDateForTE,
};
