import axios from 'axios';

// 用户列表
export interface User{
    userName: string;
    nickName: string;
    avatar: string;
    email: string;
    phone: string;
    status: string;
}
export interface UserListRes {
    Items: User[];
    Total: number;
}

export function getUserList(params: { page: number,limit: number }) {
    return axios.get<UserListRes>('/sys/user/list', {params});
}