import axios from "axios";

export interface Role {
    name: string;
    desc: string;
    status: string;
}

export interface RoleListRes {
    code: number;
    msg: string;
    Items: Role[];
}


export function getRoleList(params: { page: number,limit: number }) {
    return axios.get<RoleListRes>('/sys/role/list', {params});
}