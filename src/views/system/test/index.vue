<script setup lang="ts">

</script>

<template>
1111
</template>

<script lang="ts" setup>
// 定义源数据类型
// 定义目标路由的类型，使用 Vue Router 的 RouteRecordRaw 类型
import { RouteRecordRaw } from 'vue-router';

interface SourceData {
  id: number;
  name: string;
  name_code: string;
  icon: string;
  path: string;
  component: string;
  children: SourceData[] | null;
}

// 转换函数：将源数据转换为 RouteRecordRaw 格式
const convertToRouteRecordRaw = (data: SourceData): RouteRecordRaw => {
  return {
    path: data.path,
    name: data.name_code,
    component: () => import(`@/${data.component}`), // 动态加载组件
    meta: {
      locale: data.name,
      requiresAuth: true, // 默认都需要认证
      roles: ['*'], // 默认所有角色都有权限
      icon: data.icon,
    },
    children: data.children ? data.children.map(convertToRouteRecordRaw) : undefined, // 递归处理子节点
  };
};

// 示例源数据
const sourceData: SourceData = {
  id: 32,
  name: "系统管理",
  name_code: "system",
  icon: "icon-settings",
  path: "/system",
  component: "views/system/index.vue",
  children: [
    {
      id: 33,
      name: "用户管理",
      name_code: "user",
      icon: "icon-user",
      path: "/user",
      component: "views/system/user/index.vue",
      children: null,
    },
    {
      id: 34,
      name: "角色管理",
      name_code: "role",
      icon: "icon-stamp",
      path: "/role",
      component: "views/system/role/index.vue",
      children: null,
    },
    {
      id: 35,
      name: "菜单管理",
      name_code: "menu",
      icon: "icon-menu",
      path: "/menu",
      component: "views/system/menu/index.vue",
      children: null,
    },
    {
      id: 36,
      name: "接口管理",
      name_code: "apis",
      icon: "icon-desktop",
      path: "/apis",
      component: "views/system/apis/index.vue",
      children: null,
    }
  ]
};

// 调用转换函数，将源数据转换为 Vue Router 需要的格式
const routes: RouteRecordRaw = convertToRouteRecordRaw(sourceData);

console.log(routes); // 输出结果

</script>