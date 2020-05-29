import axios from 'axios';
import * as constants from './shared/constants'
const instance = axios.create({
    baseURL: constants.BASE_URL
});


export default instance;