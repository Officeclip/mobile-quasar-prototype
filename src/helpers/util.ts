import { SessionStorage } from 'quasar';
import { Session } from 'src/models/session';

// sometimes useful if we get into infinite loop and have to rewind the loop
const waitInSecs = async (seconds: number) =>
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));

const ocSession = () => SessionStorage.getItem('oc-session') as Session;

export default {
  waitInSecs,
  ocSession,
};
