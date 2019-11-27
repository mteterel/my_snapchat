import axios from 'axios';

let config = {
    apiUrl: 'http://10.128.173.209:4242',
    token: null,
};

export default {
    setApiToken: (token) => {
        config.token = token
    },
    login: (email, password) => {
        return axios.post(`${config.apiUrl}/login`, {
            email: email, password: password
        });
    },
    register: (email, password) => {
        return axios.post(`${config.apiUrl}/register`, {
            email: email, password: password
        });
    }
}
