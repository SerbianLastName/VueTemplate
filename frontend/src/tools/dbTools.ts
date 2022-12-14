import { getAccessToken, URI_BASE } from "./jwtTools";

// process a get request, and send a bearer token if necessary/available
export const databaseGet = async (URI: String, jwt: boolean) => {
  let headers: HeadersInit = [];
  // check for bearer token and send it with request
  if (jwt) {
    let token: string | undefined = await getAccessToken();
    if (token == undefined || token == "undefined")
      return { success: false, error: "no token" };
    headers = makeHeaders(true, token);
  }
  // if no bearer token is needed, send request without one
  if (!jwt) headers = makeHeaders(false, "");
  let requestOptions: RequestInit = {
    headers: headers,
    method: "GET",
  };
  return await databaseExecute(URI, requestOptions);
};

export const databaseMutate = async (
  URI: String,
  body: BodyInit,
  method: string,
  jwt: boolean
) => {
  let headers: HeadersInit = [];
  if (jwt) {
    let token: string = await getAccessToken();
    if (token == "fail") return { success: false, error: "no token" };
    headers = makeHeaders(true, token);
    if (method == "DELETE") {
      let requestOptions: RequestInit = {
        method: method,
        headers: headers,
      };
      return await databaseExecute(URI, requestOptions);
    }
  }
  if (!jwt) headers = makeHeaders(false, "");
  let requestOptions: RequestInit = {
    headers: headers,
    method: method,
    body: body,
  };
  if (method == "DELETE") {
    return { success: false, error: "No delete without token" };
  }
  return await databaseExecute(URI, requestOptions);
};

export const databaseExecute = async (
  URI: String,
  requestOptions: RequestInit
) => {
  try {
    let r: Response = await fetch(`${URI_BASE}${URI}`, requestOptions);
    let rJson: JSON = await r.json();
    if (r?.status == 200) {
      return rJson;
    }
    return { success: false, error: "Request Error" };
  } catch (e) {
    return { success: false, error: String(e) };
  }
};

export const makeHeaders = (hasToken: boolean, token: string = "") => {
  if (hasToken) {
    let headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: token,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": String(true),
      "Access-Control-Allow-Methods": "*",
    };
    return headers;
  }
  let headers: HeadersInit = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": String(true),
    "Access-Control-Allow-Methods": "*",
  };
  return headers;
};
