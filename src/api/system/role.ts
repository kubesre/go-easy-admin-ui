import axios from "axios";
import {Menu} from "@/api/system/menu";

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
    status: number;
}

export interface ApiDetailsRes {
    code: number;
    msg: string;
    data: any;
}



export interface RoleDetailsRes {
    menus:Menu[];
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
    return axios.get<RoleDetailsRes>(`/sys/role/get/${id}`);
}

export function getApiDetails(id:number) {
    return axios.get<ApiDetailsRes>(`/sys/rbac/role/get/${id}`);
}


export function createApiDetails(id:number,data:any[]) {
    return axios.post<ApiDetailsRes>(`/sys/rbac/create/${id}`,{"apis_id":data});
}

export function editMenuDetails(id:number,data:any[]) {
    return axios.post<ApiDetailsRes>(`/sys/role/update/${id}`,{"menus":data});
}
