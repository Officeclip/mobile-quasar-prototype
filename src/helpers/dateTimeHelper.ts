import { format } from 'date-fns';
import { parse } from 'date-fns';
import { addHours } from 'date-fns';
import { is } from 'quasar';

const dateTimeMask = 'EEE, MMM dd, yyyy hh:mm a';
const dateMask = 'EEE, MMM dd, yyyy';
const genericDateFormat = 'yyyy-MM-dd';
const calendarDateFormat = 'yyyy/MM/dd';

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
  isAllDayEvent = false
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

const extractTimeFromUtcForQTime = (utcDateTime: string) => {
  const utcDate = new Date(utcDateTime);
  const formattedTime = format(utcDate, 'HH:mm');
  console.log(`extractTimeFromUtc - formattedTime: ${formattedTime}`);

  return formattedTime;
};

const extractMonthFromUtc = (utcDateTime: string) => {
  const utcDate = new Date(utcDateTime);
  const formattedDate = format(utcDate, 'MMM dd, yyyy');
  console.log(`extractTimeFromUtc - formattedTime: ${formattedDate}`);

  return formattedDate;
};

const convertGeneralToUtc = (generalDateTime: string | null) => {
  // Converts "2023-07-27 12:00 am" to 2023-07-27T00:00:00Z
  if (generalDateTime === null) {
    return '';
  }
  const dateTime = parse(generalDateTime, 'yyyy-MM-dd p', new Date());
  return format(dateTime, "yyyy-MM-dd'T'HH:mm:ss'Z'");
};

const convertDateToUtc = (generalDate: string | null) => {
  // Converts "2023-07-27 12:00 am" to 2023-07-27T00:00:00Z
  if (generalDate === null) {
    return '';
  }
  const dateTime = parse(generalDate, 'yyyy-MM-dd', new Date());
  return format(dateTime, "yyyy-MM-dd'T'00:00:00'Z'");
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convertLocalDateToUTC = (dateTime: any) => {
  return new Date(dateTime).toISOString();
};
const convertDateTimeUTCtoLocal = (
  dateTime: string,
  optionalParameter: any = false
) => {
  const endDateUTCValue = dateTime;
  if (endDateUTCValue) {
    const endDate = new Date(endDateUTCValue);
    if (optionalParameter) {
      return endDate.toLocaleDateString();
    }
    return endDate.toLocaleDateString() + ' ' + endDate.toLocaleTimeString();
  }
  return null;
};

// populate dates between the start and end dates
const populateDates = (startDate: Date, endDate: Date) => {
  const newStartDate = new Date(startDate);
  const newEndDate = new Date(endDate);
  const dates = [];
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

const formatFullDateTime = (date: Date) => {
  return format(date, 'EEE, MMM dd, yyyy hh:mm a');
};

const removeLastZ = (dateString: string | undefined) => {
  if (dateString) {
    if (dateString.endsWith('Z')) {
      return dateString.slice(0, -1);
    }
  }
  return dateString;
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
  const dt = getDateTimeFromRestAPI(input, isDateOnly);
  if (dt === null) return '';
  return formatDateTimeForUI(dt, isDateOnly);
};

const convertCalendarDateForUI = (input: string) => {
  const date = parse(input, calendarDateFormat, new Date());
  return formatDateTimeForUI(date, true);
};

export default {
  extractDateFromUtc,
  extractTimeFromUtc,
  formatDateandTimeFromUtc,
  extractTimeFromUtcForQTime,
  extractMonthFromUtc,
  convertGeneralToUtc,
  convertDateToUtc,
  convertLocalDateToUTC,
  convertDateTimeUTCtoLocal,
  populateDates,
  addHoursToDate,
  formatFullDateTime,
  removeLastZ,
  getDateTimeFromRestAPI,
  formatDateTimeFromUIForRestAPI,
  formatDateTimeFromRestAPIForUI,
  formatDateTimeForUI,
  formatDateForCalendar,
  formatDateForGeneric,
  convertCalendarDateForUI,
};
