import type {RouteRecordNormalized, RouteRecordRaw} from 'vue-router';
import {getUserMenuList} from "@/api/system/user";
import {Message} from "@arco-design/web-vue";
import {DEFAULT_LAYOUT} from "@/router/routes/base";
import {AppRouteRecordRaw} from "@/router/routes/types";
import {defineAsyncComponent} from "vue";

const modules = import.meta.glob('./modules/*.ts', { eager: true });
const externalModules = import.meta.glob('./externalModules/*.ts', {
  eager: false,
});

function formatModules(_modules: any, result: RouteRecordNormalized[]) {
  Object.keys(_modules).forEach((key) => {
    const defaultModule = _modules[key].default;
    if (!defaultModule) return;
    const moduleList = Array.isArray(defaultModule)
      ? [...defaultModule]
      : [defaultModule];
    result.push(...moduleList);
  });
  return result;
}


export const appRoutes: RouteRecordNormalized[] = formatModules(modules, []);
export const appExternalRoutes: RouteRecordNormalized[] = formatModules(
  externalModules,
  []
);


// 动态导入函数，根据组件名导入组件
// 转换函数：将源数据转换为 RouteRecordRaw 格式
const convertToRouteRecordRaw = (data: any): AppRouteRecordRaw  => {
  return {
    path: data.path,
    name: data.name_code,
    component:  () => import('@/views/system/user/index.vue'),
// 动态加载组件
    meta: {
      locale: data.name,
      requiresAuth: true, // 默认都需要认证
      roles: ['*'], // 默认所有角色都有权限
      icon: data.icon,
      order: data.sort,
    },
    children: data.children ? data.children.map(convertToRouteRecordRaw) : undefined, // 递归处理子节点
  };
};
export const GetRouterList = () => {
  getUserMenuList().then(res => {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of res.data.menus) {
      const routes: AppRouteRecordRaw = convertToRouteRecordRaw(item);
      // @ts-ignore
      appRoutes.push(routes as AppRouteRecordRaw);
        console.log(routes);
    }
  })}