import { format } from 'date-fns';

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

export default {
  extractDateFromUtc,
  extractTimeFromUtc,
  extractTimeFromUtcForQTime,
  extractMonthFromUtc,
};
