import axios from 'axios';

let config = {
    apiUrl: 'http://127.0.0.1:4242',
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
    },
    getAllUsers: () => {
        return axios.get(`${config.apiUrl}/all`, {
            headers: { token: config.token }
        });
    },
    sendSnap: (contactEmail, picture) => {

    }
}
