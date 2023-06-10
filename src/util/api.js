import urlJoin from "url-join";
import { backendApiBaseUrl } from "./constants";

async function fetchFromBackendApi(path) {
  const fullUrl = urlJoin(backendApiBaseUrl, path);
  const response = await fetch(fullUrl);
  const data = await response.json();
  return data;
}

export { fetchFromBackendApi };
