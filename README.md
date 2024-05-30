# OfficeClip Mobile (mobile)

### How to create your own endpointUrl

1. Create a file on the root called .env.local (note the initial dot)
2. Add a line there as: VITE_API_ENDPOINT=http://localhost:4000
3. This will be the default endpoint url, you can change this to your liking. It will be changed on your machine.

Quasar Prototype of OfficeClip Mobile

## Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

### How to create default login

1. add a property VITE_DEFAULT_LOGIN in env.local and set it to to default login you want
