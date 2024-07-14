import { format } from 'date-fns';
import { parse } from 'date-fns';
import { addHours } from 'date-fns';

const extractDateFromUtc = (
  utcDateTime: string | undefined,
  isAllDayEvent = true
) => {
  if (utcDateTime === undefined) {
    return null;
  }

  if (isAllDayEvent) {
    const helper = utcDateTime?.substring(0, 10);
    return helper;
  } else {
    const date = new Date(utcDateTime);
    return format(date, 'yyyy-MM-dd');
  }
};

const extractTimeFromUtc = (utcDateTime: string) => {
  const utcDate = new Date(utcDateTime);
  const formattedTime = format(utcDate, 'hh:mm aaa');
  return formattedTime;
};

const formatDateandTimeFromUtc = (
  utcDateTimeStr: string,
  isDateFormat = false
) => {
  //const data = utcDateTimeStr;
  if (utcDateTimeStr) {
    const utcDate = new Date(utcDateTimeStr);
    if (isDateFormat) {
      const formattedTime = format(utcDate, 'EEE, MMM dd, yyyy');
      return formattedTime;
    }
    return format(utcDate, 'EEE, MMM dd, yyyy hh:mm a');
  }
  return null;
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
};
