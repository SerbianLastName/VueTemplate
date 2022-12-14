import { makeHeaders, databaseGet } from "./dbTools";
import { global } from "./global";

export const URI_BASE = "http://localhost:5000";

export const loginUser = async (username: string, password: string) => {
  let body: FormData = new FormData();
  body.append("username", username);
  body.append("password", password);
  let r = await fetch(`${URI_BASE}/login`, {
    method: "POST",
    body: body,
  });
  let rJson = await r.json();
  if (rJson?.success) {
    setCookies(rJson?.resp?.token, username, rJson?.resp?.id);
    return { success: true };
  }
  return { success: false, message: rJson };
};

export const getUser = async () => {
  global.setName();
  let r: { success: boolean; resp: any } = await databaseGet("/getuser", true);
  if (r?.success) {
    global.user.email = r?.resp?.email;
    global.user.username = r?.resp?.username;
    global.setName();
    return r;
  }
};

export const setCookies = (token: String, username: String, id: String) => {
  let hours: number = 120;
  let expires: String = new Date(
    Date.now() + hours * 60 * 60 * 1000
  ).toUTCString();
  document.cookie = `Authorization= Bearer ${token}; path=/; expires=${expires}`;
  document.cookie = `Expires=${expires}; path=/; expires=${expires}`;
  document.cookie = `Username=${username}; path=/; expires=${expires}`;
  document.cookie = `ID=${id}; path=/; expires=${expires}`;
};

export const getAccessToken = async () => {
  let expires = document.cookie
    .split("; ")
    .find((row) => row.startsWith("Expires="))
    ?.split("=")[1];
  if (expires == undefined) {
    return "fail";
  }
  let tomorrow: String = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  ).toUTCString();
  let accessToken: string =
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("Authorization="))
      ?.split("=")[1] || "fail";
  if (accessToken == "fail") return "fail";
  if (expires <= tomorrow) {
    return accessToken;
  }
  let token: string | undefined = await refreshToken(accessToken);
  if (token == undefined) return "fail";
  return token;
};

export const refreshToken = async (token: string | undefined) => {
  if (token == undefined) return "FAIL";
  let headers: HeadersInit = makeHeaders(true, token);
  let requestOptions: RequestInit = {
    headers: headers,
    method: "GET",
  };
  try {
    let r: Response = await fetch(`${URI_BASE}refresh`, requestOptions);
    let rJson = await r.json();
    if (r?.status == 200) {
      setCookies(rJson?.token, rJson?.username, rJson?.id);
      let token: string = rJson?.token;
      if (token == undefined || token == "") {
        return "fail";
      }
      return `Bearer ${rJson?.token}`;
    }
  } catch (e) {
    console.error(e);
    return "fail";
  }
};
