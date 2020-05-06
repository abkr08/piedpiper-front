import axios from 'axios';

const BASE_URL_DEV = 'http://localhost:8081';
const BASE_URL_PROD = 'https://piedpiperchat.herokuapp.com/';

const instance = axios.create({
    baseURL: BASE_URL_DEV
});


export default instance;