import util from './util';

function log(message: string, level?: 'info' | 'warn' | 'error') {
  // WHEN RUNNING WEBPACK WITH `PRODUCTION` build,
  // IT WILL REMOVE THE FOLLOWING CODE.

  if (!util.isHideLogger()) {
    if (level === 'error') {
      console.error(message);
    } else if (level === 'warn') {
      console.warn(message);
    } else {
      console.log(message);
    }
  }
}

export default {
  log,
};
