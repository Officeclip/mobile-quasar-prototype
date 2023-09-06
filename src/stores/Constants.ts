export const endPointUrl =
  import.meta.env.VITE_API_ENDPOINT === undefined
    ? 'http://localhost:4000'
    : import.meta.env.VITE_API_ENDPOINT;
