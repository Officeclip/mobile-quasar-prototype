import { LocalStorage, SessionStorage } from 'quasar';
import { Session } from 'src/models/session';
import validator from 'validator'; // Import validator.js
import logger from './logger';

// Helper functions
const waitInSecs = (seconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));

const ocSession = (): Session | null =>
  SessionStorage.getItem('oc-session') as Session | null; // Handle potential null

const isValidEmail = (email: string, isRequired = false) => {
  if (!isRequired && email === '') return true;
  return validator.isEmail(email); // Use validator.js's isEmail function
};

const isValidNumber = (
  value: string | null | undefined,
  isEmptyAllowed = false
): boolean =>
  isEmptyAllowed
    ? value === null ||
      value === undefined ||
      value === '' ||
      typeof value === 'number'
    : typeof value === 'number';

const isDurationValid = (input: string): boolean => {
  const timeRegex = /^([0-1][0-9]|[1-9]):[0-5][0-9]$/;
  const durationRegex = /^\d+(\.\d+)?$/;

  if (timeRegex.test(input)) {
    const [hours, minutes] = input.split(':');
    return (
      parseInt(hours, 10) >= 0 &&
      parseInt(hours, 10) <= 23 &&
      parseInt(minutes, 10) >= 0 &&
      parseInt(minutes, 10) <= 59
    );
  }
  return durationRegex.test(input) && parseFloat(input) >= 0;
};

const colonToDecimal = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':');
  return (parseFloat(hours) + parseFloat(minutes) / 60).toFixed(2);
};

const isObjectNullOrEmpty = (obj: object | null | undefined): boolean =>
  !obj || Object.keys(obj).length === 0;

const decycle = (obj: any, stack: any[] = []): any => {
  if (!obj || typeof obj !== 'object') return obj;
  if (stack.includes(obj)) return null;
  const s = stack.concat([obj]);
  return Array.isArray(obj)
    ? obj.map((x) => decycle(x, s))
    : Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, decycle(v, s)])
      );
};

// Configuration and environment related functions
const endPointUrlsObj = {
  testUrl: import.meta.env.VITE_API_ENDPOINT_TEST,
  onlineUrl: import.meta.env.VITE_API_ENDPOINT_ONLINE,
};

const getEndPointUrlFromUri = (url: string): string =>
  `${url.replace(/m\/#\/(.*)$/, '')}api`;

const endPointUrl = (): string | undefined =>
  endPointUrlsObj.testUrl || LocalStorage.getItem('endPointUrl') || undefined;

const isHideLogger = (): boolean => import.meta.env.VITE_HIDE_LOGGER === '1';

const isHideTestPage = (): boolean =>
  import.meta.env.VITE_HIDE_TESTPAGE === '1';

// Enums
export enum ObjectType {
  Task = 1,
  Contact = 14,
  Event = 4,
  Note = 20,
  ActivityTabForCrm = 35,
  Issues = 10,
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
  endPointUrlsObj,
  ObjectType,
};
