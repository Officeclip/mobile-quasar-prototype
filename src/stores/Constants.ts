export class Constants {
  static readonly endPointUrl =
    import.meta.env.VITE_API_ENDPOINT === undefined
      ? 'http://localhost:4000' // using the json-server
      : import.meta.env.VITE_API_ENDPOINT;
}
