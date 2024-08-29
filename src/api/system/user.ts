import axios from 'axios';

// 用户列表
export interface User{
    userName: string;
    nickName: string;
    avatar: string;
    email: string;
    phone: string;
    status: number;
}
export interface UserListRes {
    Items: User[];
    Total: number;
}

export interface UserReq {
    userName: string;
    nickName: string;
    avatar: string;
    email: string;
    phone: string;
    password: string;
    status: number;
    roles: number[];
}

export interface UserRes{
    code: number;
    msg: string;
}

export function getUserList(params: { page: number,limit: number }) {
    return axios.get<UserListRes>('/sys/user/list', {params});
}


export function createUser(data: UserReq) {
    return axios.post<UserRes>('/sys/user/create', data);
}