import axios from 'axios';


export interface UserListRes {
    userName: string;
    nickName: string;
    avatar: string;
    email: string;
    phone: string;
    status: string;
}
export function getUserList(params: { page: number,limit: number }) {
    return axios.get<UserListRes[]>('/sys/user/list', {params});
}