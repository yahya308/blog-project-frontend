import { getRequestURL, proxyRequest } from "h3";

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  const url = getRequestURL(event);

  const target = `${config.backendOrigin}${url.pathname}${url.search}`;

  return proxyRequest(event, target);
});
