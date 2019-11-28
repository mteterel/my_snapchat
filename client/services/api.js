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
    loginWithToken: (token) => {
        return axios.post(`${config.apiUrl}/login`, {
            token: token
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
    sendSnap: (contactEmail, duration, picture) => {
        return axios.post(`${config.apiUrl}/snap`, {
            duration: duration,
            to: contactEmail,
            image: picture
        },{
            headers: { token: config.token }
        });
    },
    getAllSnaps: () => {
        return axios.get(`${config.apiUrl}/snaps`, {
            headers: { token: config.token }
        });
    }
}
