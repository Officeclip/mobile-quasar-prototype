/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js

import { configure } from 'quasar/wrappers';
import { resolve } from 'path';
// const dotenv = require('dotenv').config({
//   path: resolve(__dirname, '.env.local'),
// });
// const { Notify } = require('quasar'); // Usually not needed here, unless explicitly used by config

import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'; // NEW IMPORT

export default configure(function (/* ctx */) {
  return {
    // REMOVED ESLINT BLOCK - Configure ESLint separately in `eslint.config.js` or `.eslintrc.cjs`

    // https://v2.quasar.dev/quasar-cli-vite/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli-vite/boot-files
    boot: ['i18n', 'axios'],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#css
    css: ['app.scss'],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      'roboto-font', // optional, you are not bound to it
      'material-icons', // optional, you are not bound to it
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#build
    build: {
      target: {
        browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node20', // UPDATED to reflect Node.js 20
      },
      // env: dotenv.parsed, // Use the parsed environment variables

      vueRouterMode: 'hash', // available values: 'hash', 'history'
      publicPath: '',

      extendViteConf(viteConf, {}) {
        viteConf.base = ''; // Keep this if you need to set an empty base
      },

      vitePlugins: [
        [
          VueI18nPlugin, // USING NEW PLUGIN
          {
            include: resolve(__dirname, './src/i18n/**'),
            // Any other options you need for unplugin-vue-i18n
            // compositionOnly: false, // if you want legacy API
            // runtimeOnly: false, // if you want named tokens
          },
        ],
      ],
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#devServer
    devServer: {
      open: true, // opens browser window automatically
    },

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#framework
    framework: {
      config: {
        loading: {
          delay: 200,
          message: 'Please wait...',
          messageColor: 'black',
          spinnerColor: 'primary',
          backgroundColor: 'white',
        },
        dark: 'auto',
      },
      plugins: ['Notify', 'SessionStorage', 'Dialog', 'Loading'],
    },

    animations: [],

    ssr: {
      pwa: false,
      prodPort: 3000,
      middlewares: ['render'],
    },

    pwa: {
      workboxMode: 'generateSW', // or 'injectManifest'
      injectPwaMetaTags: true,
      swFilename: 'sw.js',
      manifestFilename: 'manifest.json',
      useCredentialsForManifestTag: false,
    },

    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    capacitor: {
      hideSplashscreen: true,
    },

    electron: {
      inspectPort: 5858,
      bundler: 'packager', // 'packager' or 'builder'
      packager: {},
      builder: {
        appId: 'mobile',
      },
    },

    bex: {
      contentScripts: ['my-content-script'],
    },
  };
});
