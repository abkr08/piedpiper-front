const baseUrl = "api/v1/";

export const REGISTRATION_URL = baseUrl + "auth/register";
export const LOGIN_URL = baseUrl + "auth/login";

export const GET_MESSAGES_URL = roomId => baseUrl + "rooms/" + roomId + "/messages";
export const UPDATE_PROFILE_URL = username => baseUrl + "users/" + username + "/display-image";

export const WS_SERVER_URL = 'http://localhost:8081/socket'; 

export const PUBLIC = "PUBLIC";
export const PRIVATE = "PRIVATE";
export const CHANNEL = "CHANNEL";