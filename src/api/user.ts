import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginRes {
  token: string;
  id: number
}
export function login(data: LoginData) {
  return axios.post<LoginRes>('/sys/login/general', data);
}

export function logout() {
  return axios.post<LoginRes>('/api/system/user/logout');
}

export function getUserInfo() {
  return axios.get<UserState>('/sys/login/info');
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/api/user/menu');
}
