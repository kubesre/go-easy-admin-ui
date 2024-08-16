import axios from "axios";

export interface RoleListRes {
    name: string;
    desc: string;
    status: string;
}
export function getRoleList(params: { page: number,limit: number }) {
    return axios.get<RoleListRes[]>('/sys/role/list', {params});
}