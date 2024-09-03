import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
    path: '/system',
    name: 'system',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: '系统管理',
        requiresAuth: true,
        icon: 'icon-settings',
        order: 2,
    },
    children: [
        {
            path: 'user',
            name: 'user',
            component: () => import('@/views/system/user/index.vue'),
            meta: {
                locale: '用户管理',
                requiresAuth: true,
                roles: ['*'],
                order: 1,
                icon: 'icon-user',
            },
        },{
            path: 'role',
            name: 'role',
            component: () => import('@/views/system/role/index.vue'),
            meta: {
                locale: '角色管理',
                requiresAuth: true,
                roles: ['*'],
                order: 2,
                icon: 'icon-user-group',
            },
        },
        {
            path: 'menu',
            name: 'menu',
            component: () => import('@/views/system/menu/index.vue'),
            meta: {
                locale: '菜单管理',
                requiresAuth: true,
                roles: ['*'],
                order: 3,
                icon: 'icon-apps',
            },
        },
        {
            path: 'apis',
            name: 'apis',
            component: () => import('@/views/system/apis/index.vue'),
            meta: {
                locale: '接口管理',
                requiresAuth: true,
                roles: ['*'],
                order: 2,
                icon: 'icon-desktop',
            },
        },
    ],
};

export default DASHBOARD;