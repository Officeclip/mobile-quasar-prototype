import { LocalStorage, SessionStorage } from 'quasar';
import { Session } from 'src/models/session';
import logger from './logger';
import { get } from 'http';

// sometimes useful if we get into infinite loop and have to rewind the loop
const waitInSecs = async (seconds: number) =>
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));

const ocSession = () => SessionStorage.getItem('oc-session') as Session;

export enum ObjectType {
  Task = 1,
  Contact = 14,
  Event = 4,
  Note = 20,
  ActivityTabForCrm = 35,
}

function getEndPointUrlFromUri(url: string) {
  // Define the pattern to match "/m/#/""
  const pattern = /m\/#\/(.*)$/;
  // Use replace method with a callback function
  const endPointUrl = `${url.replace(pattern, '')}api`;
  return endPointUrl;
}

function isValidEmail(email: string, isRequired: boolean) {
  if (email === '' && isRequired === false) return true;
  const regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;
  return regex.test(email);
}

function isValidNumber(value: string, isEmptyAllowed: boolean): boolean {
  // From Google Gemini
  const isValid = value === 'number';
  return isEmptyAllowed
    ? isValid || value === null || value === undefined || value === ''
    : isValid;
}

function isDurationValid(input: string): boolean {
  // Using Google Gemini: https://g.co/gemini/share/535ec7f1b4e9, fixed the regex expression
  const timeRegex = /^([0-1][0-9]|[1-9]):[0-5][0-9]$/;
  const durationRegex = /^\d+(\.\d+)?$/;

  if (timeRegex.test(input)) {
    const [hours, minutes] = input.split(':');
    return +hours >= 0 && +hours <= 23 && +minutes >= 0 && +minutes <= 59;
  } else if (durationRegex.test(input)) {
    const duration = parseFloat(input);
    return duration >= 0;
  } else {
    return false;
  }
}

function colonToDecimal(timeString: string): string {
  // From Google Gemini: https://g.co/gemini/share/f9499846694b
  const [hours, minutes] = timeString.split(':');
  const decimalHours = parseFloat(hours) + parseFloat(minutes) / 60;
  return decimalHours.toFixed(2);
}

function isHideLogger() {
  const isHideLogger =
    import.meta.env.VITE_HIDE_LOGGER && import.meta.env.VITE_HIDE_LOGGER == 1;
  // && process.env.NODE_ENV == 'production';
  return isHideLogger;
}

function isHideTestPage() {
  const isHideTestPage =
    import.meta.env.VITE_HIDE_TESTPAGE &&
    import.meta.env.VITE_HIDE_TESTPAGE == 1;
  return isHideTestPage;
}

function endPointUrl() {
  if (import.meta.env.VITE_API_ENDPOINT) {
    return import.meta.env.VITE_API_ENDPOINT;
  } else {
    return String(LocalStorage.getItem('endPointUrl'));
  }
}

function isObjectNullOrEmpty(obj: object) {
  return !obj || Object.keys(obj).length == 0; // see: https://stackoverflow.com/a/65028055
}

// This is used because iphone is giving error like: json.stringify cannot serialize cyclic structures
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function decycle(obj: any, stack: any[] = []): any {
  // see: https://stackoverflow.com/a/9382383
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (stack.includes(obj)) {
    return null;
  }

  const s = stack.concat([obj]);

  return Array.isArray(obj)
    ? obj.map((x) => decycle(x, s))
    : Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, decycle(v, s)])
      );
}

export default {
  waitInSecs,
  ocSession,
  getEndPointUrlFromUri,
  isValidEmail,
  isHideLogger,
  isHideTestPage,
  isValidNumber,
  colonToDecimal,
  isDurationValid,
  endPointUrl,
  isObjectNullOrEmpty,
  decycle,
};
