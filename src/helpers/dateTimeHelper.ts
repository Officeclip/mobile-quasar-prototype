import { format } from 'date-fns';
import { parse } from 'date-fns';

const extractDateFromUtc = (utcDateTime: string) =>
  utcDateTime.substring(0, 10);

const extractTimeFromUtc = (utcDateTime: string) => {
  //console.log(`extractTimeFromUtc - utcDateTime: ${utcDateTime}`)
  const utcDate = new Date(utcDateTime);
  //console.log(`extractTimeFromUtc - utcDate: ${utcDate}`)
  const formattedTime = format(utcDate, 'hh:mm aaa');
  //console.log(`extractTimeFromUtc - formattedTime: ${formattedTime}`)
  return formattedTime;
};
const extractDateandTimeFromUtc = (utcDateTime: string) => {
  const utcDate = new Date(utcDateTime);
  const formattedTime = format(utcDate, 'MMM dd, yyyy hh:mm aaa');
  return formattedTime;
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

const convertGeneralToUtc = (generalDateTime: string) => {
  // Converts "2023-07-27 12:00 am" to 2023-07-27T00:00:00Z
  const dateTime = parse(generalDateTime, 'yyyy-MM-dd p', new Date());
  return format(dateTime, "yyyy-MM-dd'T'HH:mm:ss'Z'");
};

const convertDateToUtc = (generalDate: string) => {
  // Converts "2023-07-27 12:00 am" to 2023-07-27T00:00:00Z
  const dateTime = parse(generalDate, 'yyyy-MM-dd', new Date());
  return format(dateTime, "yyyy-MM-dd'T'00:00:00'Z'");
};

export default {
  extractDateFromUtc,
  extractTimeFromUtc,
  extractDateandTimeFromUtc,
  extractTimeFromUtcForQTime,
  extractMonthFromUtc,
  convertGeneralToUtc,
  convertDateToUtc,
};
