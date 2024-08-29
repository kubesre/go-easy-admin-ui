import axios from "axios";

export interface Role {
    name: string;
    desc: string;
    status: number;
}

export interface RoleListRes {
    code: number;
    msg: string;
}


export function getRoleList() {
    return axios.get<Role[]>('/sys/role/list');
}