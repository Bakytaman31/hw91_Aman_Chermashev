import axios from 'axios';
import {api} from "./constants";
import store from "./store/configureStore";

const axiosApp = axios.create({
    baseURL: api
});

axiosApp.interceptors.request.use(config => {
    try {
        config.headers['Authorization'] = 'Token ' + store.getState().users.user.token;
    } catch (e) {

    }
    return config;
});

export default axiosApp;