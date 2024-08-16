import axios from "axios";



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
export function getApisList(params: { page: number,limit: number }) {
    return axios.get<ApisListRes>('/sys/apis/list', {params});
}