import axios from "axios";
import {MenuReq, MenuRes} from "@/api/system/menu";



export interface Api {
    id: number;
    path: string;
    method: string;
    desc: string;
    apiGroup: string;
}

export interface ApisListRes {
    Items: Api[];
    Total: number;
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
}

export function getApisList(params: { page: number,limit: number }) {
    return axios.get<ApisListRes>('/sys/apis/list', {params});
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