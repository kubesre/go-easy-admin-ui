import axios from "axios";

export interface ApisListRes {
    id: number;
    path: string;
    method: string;
    desc: string;
    apiGroup: string;
}
export function getApisList(params: { page: number,limit: number }) {
    return axios.get<ApisListRes[]>('/sys/apis/list', {params});
}