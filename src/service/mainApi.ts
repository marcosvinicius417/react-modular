import { createApiInstance } from "./instanceApi";

export const mainApi = createApiInstance(
  import.meta.env.VITE_MAIN_API_URL as string
);
