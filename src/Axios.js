import axios from 'axios';

// const BASE_URL_DEV = 'http://localhost:8081';
// const BASE_URL_PROD = 'https://piedpiperchat.herokuapp.com/';
const BASE_URL_PROD = 'http://piperchatbackend-env.eba-mzpxtdkp.eu-west-2.elasticbeanstalk.com/'
const instance = axios.create({
    baseURL: BASE_URL_PROD
});


export default instance;