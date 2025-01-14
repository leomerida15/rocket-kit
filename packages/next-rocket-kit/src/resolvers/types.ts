import { StatusCodes } from "http-status-codes";
import { resolverObj } from "./resolverObj";
export * from "./zod/types";
export * from "./yup/types";

export type ResolverKeys = keyof typeof resolverObj;

export interface ReplyInit extends Omit<ResponseInit, "status"> {
	status?: StatusCodes;
}

export interface reqState {
  method: string;
  localURLsOnly: boolean;
  unsafeRequest: boolean;
  body?: any;
  client: Client;
  reservedClient?: any;
  replacesClientId: string;
  window: string;
  keepalive: boolean;
  serviceWorkers: string;
  initiator: string;
  destination: string;
  priority?: any;
  origin: string;
  policyContainer: string;
  referrer: string;
  referrerPolicy: string;
  mode: string;
  useCORSPreflightFlag: boolean;
  credentials: string;
  useCredentials: boolean;
  cache: string;
  redirect: string;
  integrity: string;
  cryptoGraphicsNonceMetadata: string;
  parserMetadata: string;
  reloadNavigation: boolean;
  historyNavigation: boolean;
  userActivation: boolean;
  taintedOrigin: boolean;
  redirectCount: number;
  responseTainting: string;
  preventNoCacheCacheControlHeaderModification: boolean;
  done: boolean;
  timingAllowFailed: boolean;
  headersList: HeadersList;
  urlList: string[];
  url: string;
}
interface HeadersList {
  cookies?: any;
}
interface Client {
  policyContainer: PolicyContainer;
}
interface PolicyContainer {
  referrerPolicy: string;
}