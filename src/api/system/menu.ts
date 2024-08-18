import axios from "axios";



export interface Menu {
    id: number;
    name: string;
    name_code: string;
    is_show: string;
    icon: string;
    path: string;
    sort: number;
    parent_id: number;
    component: string;
}

export interface MenuReq {
    name: string;
    name_code: string;
    is_show: number;
    icon: string;
    path: string;
    sort: number;
    parent_id: number;
    component: string;
}
export interface MenuRes{
    code: number;
    msg: string;
}

export function getMenuList() {
    return axios.get<Menu[]>('/sys/menu/list', );
}


export function createMenu(data: any) {
    return axios.post<MenuRes>('/sys/menu/create', data);
}