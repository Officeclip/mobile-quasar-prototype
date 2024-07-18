import { SessionStorage } from 'quasar';
import { Session } from 'src/models/session';
import logger from './logger';

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

function getEndPointUrlFromUri() {
  const urlObject = new URL(window.location.href);
  urlObject.search = '';
  const endPointUrl = urlObject.toString().replace('/m/', '/api');
  console.log(`endpoint url is: ${endPointUrl}`);
  return endPointUrl;
}

export default {
  waitInSecs,
  ocSession,
  getEndPointUrlFromUri,
};
