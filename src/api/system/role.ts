import axios from "axios";

export interface Role {
    id: number;
    name: string;
    desc: string;
    status: number;
}

export interface RoleListRes {
    code: number;
    msg: string;
}

export interface RoleReq {
    name: string;
    desc: string;
}


export function getRoleList() {
    return axios.get<Role[]>('/sys/role/list');
}


export function createRole(data: RoleReq) {
    return axios.post<Role[]>('/sys/role/create',data);
}


export function editRole(id:number,data: RoleReq) {
    return axios.post<Role[]>(`/sys/role/update/${id}`,data);
}


export function deleteRole(id:number) {
    return axios.post<Role[]>(`/sys/role/delete/${id}`);
}


export function getRoleDetails(id:number) {
    return axios.get<any[]>(`/sys/role/get/${id}`);
}


