import Pusher from 'pusher-js';
import { store } from './index';

const user = localStorage.getItem('userId');
const token = localStorage.getItem('token');
const pusher = new Pusher('f790521ed52ae6aaf77e', {
    cluster: 'eu',
    forceTLS: true,
    authEndpoint: 'https://piedpiperchat.herokuapp.com/pusher/auth', //'http://localHost:8080/pusher/auth', //'https://192.168.1.39:8080/pusher/auth'
    auth: {
      params: {
        user: user
      },
      headers: {
          'x-auth-token': token
      }
    }
  });

  export default pusher; 