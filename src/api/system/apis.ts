import axios from "axios";
import {MenuReq, MenuRes} from "@/api/system/menu";



export interface Api {
    id: number;
    path: string;
    method: string;
    desc: string;
    apiGroup: string;
}

export interface ApiReq {
    path: string;
    method: string;
    desc: string;
    apiGroup: string;
}

export interface ApiRes{
    code: number;
    msg: string;
    data: Api[];
}

export interface ApiGroup {
    code: number;
    msg: string;
    data?: any;
}

export function getApisList() {
    return axios.get<ApiRes>('/sys/apis/list' );
}
export function createApi(data: ApiReq) {
    return axios.post<ApiRes>('/sys/apis/create', data);
}


export function editApi(id:number,data: ApiReq) {
    return axios.post<ApiRes>(`/sys/apis/update/${id}`, data);
}


export function deleteApi(id:number) {
    return axios.post<ApiRes>(`/sys/apis/delete/${id}`);
}


export function getApiGroups() {
    return axios.get<ApiGroup>('/sys/apis/get/group' );
}