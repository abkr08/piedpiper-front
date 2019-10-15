import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://piedpiperchat.herokuapp.com/',
});


export default instance;