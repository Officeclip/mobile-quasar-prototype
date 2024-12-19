import { format, parse, addHours } from 'date-fns';

const dateTimeMask = 'EEE, MMM dd, yyyy hh:mm a';
const dateMask = 'EEE, MMM dd, yyyy';
const genericDateFormat = 'yyyy-MM-dd';
const calendarDateFormat = 'yyyy/MM/dd';
const teDatemask = 'MMM dd, yyyy';

const extractDateFromUtc = (utcDateTime: string | undefined) => {
  if (!utcDateTime) return null;
  const date = new Date(utcDateTime);
  return format(date, genericDateFormat);
};

const extractTimeFromUtc = (utcDateTime: string) => {
  if (!utcDateTime) return null;
  const utcDate = new Date(utcDateTime);
  return format(utcDate, 'hh:mm aaa');
};

const formatDateandTimeFromUtc = (
  utcDateTimeStr: string,
  isAllDayEvent = false
) => {
  if (!utcDateTimeStr) return null;
  const utcDate = new Date(utcDateTimeStr);
  return isAllDayEvent
    ? format(utcDate, dateMask)
    : format(utcDate, dateTimeMask);
};

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
      startDate: format(newStartDate, genericDateFormat),
    });
    newStartDate.setDate(newStartDate.getDate() + 1);
  }
  return dates;
};

const addHoursToDate = (date: Date, hours: number) => addHours(date, hours);

const getDateTimeFromRestAPI = (input: string, isDateOnly: boolean) => {
  if (!input) return null;
  let dt = new Date(input);
  if (isDateOnly) {
    dt = new Date(dt.valueOf() + dt.getTimezoneOffset() * 60 * 1000);
  }
  return dt;
};

const formatDateTimeFromUIForRestAPI = (input: string, isDateOnly: boolean) => {
  if (!input) return '';
  const dt = new Date(input);
  return isDateOnly
    ? formatDateForGeneric(dt)
    : dt.toISOString().replace(/.\d+Z$/g, 'Z');
};

const formatDateTimeForUI = (input: Date, isDateOnly: boolean) => {
  return isDateOnly ? format(input, dateMask) : format(input, dateTimeMask);
};

const formatDateForCalendar = (input: Date) =>
  format(input, calendarDateFormat);

const formatDateForGeneric = (input: Date) => format(input, genericDateFormat);

const formatDateTimeFromRestAPIForUI = (input: string, isDateOnly: boolean) => {
  if (!input) return '';
  const dt = getDateTimeFromRestAPI(input, isDateOnly);
  return dt ? formatDateTimeForUI(dt, isDateOnly) : '';
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
