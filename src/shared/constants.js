const env = 'dev';
const BASE_URL_DEV = 'http://localhost:8081/';
const BASE_URL_PROD = 'http://piperchat-env.eba-fuup6m9m.eu-west-2.elasticbeanstalk.com/';

export const BASE_URL = env == 'dev' ? BASE_URL_DEV : BASE_URL_PROD;
 
const API_URL = "api/v1/";

export const REGISTRATION_URL = API_URL + "auth/register";
export const LOGIN_URL = API_URL + "auth/login";

export const GET_MESSAGES_URL = roomId => API_URL + "rooms/" + roomId + "/messages";
export const UPDATE_PROFILE_URL = username => API_URL + "users/" + username + "/display-image";
export const NEW_ROOM_URL = BASE_URL + API_URL + "rooms/new-room";

export const WS_SERVER_URL = BASE_URL + 'socket'

export const PUBLIC = "PUBLIC";
export const PRIVATE = "PRIVATE";
export const CHANNEL = "CHANNEL";