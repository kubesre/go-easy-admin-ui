import axios from 'axios';
export function login(data) {
    return axios.post('/api/base/login', data);
}
export function logout() {
    return axios.post('/api/base/logout');
}
export function getUserInfo() {
    return axios.get('/api/base/login/info');
}
export function getMenuList() {
    return axios.post('/api/user/menu');
}
//# sourceMappingURL=user.js.map