import { createApiInstance } from "./instanceApi";

export const serviceApi = createApiInstance(
  import.meta.env.VITE_SERVICE_API_URL as string
);
