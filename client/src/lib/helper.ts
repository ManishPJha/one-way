export const API_URI: string = import.meta.env.VITE_API_URI?.concat(
  "/api/" + import.meta.env.VITE_API_VERSION
);
