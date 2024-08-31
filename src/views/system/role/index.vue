<template>
  <div class="container">
    <Breadcrumb :items="['系统管理', '角色管理']" />
    <a-card class="general-card" title="角色管理">
      <a-divider style="margin-top: 0" />
      <a-row>
        <a-col :flex="1" style="margin-bottom: 16px">
          <a-button type="primary" @click="Create">
            <template #icon>
              <icon-plus />
            </template>
            新建</a-button
          >
          <a-button
              type="outline"
              style="margin-left: 15px"
              @click="GetRoleList"
          >
            <template #icon>
              <icon-refresh />
            </template>
            刷新</a-button
          >
        </a-col>
      </a-row>
      <a-table :loading="loading" :columns="columns" :data="tables">
        <template #avatar="{ record }">
          <a-avatar :src="record.avatar">
            <img
                alt="avatar"
                :src="record.avatar"
            />
          </a-avatar>
        </template>
        <template #status="{record}">
          <a-switch v-if="record.status == 1" :default-checked="true"/>
          <a-switch v-if="record.status == 0" :default-checked="false"/>
        </template>

        <template #action>
          <a-button type="text" @click="MenuRoleSettings">
            <template #icon>
              <icon-settings />
            </template>
            设置菜单权限</a-button>
          <a-button type="text" @click="ApiRoleSettings">
            <template #icon>
              <icon-settings />
            </template>
            设置接口权限</a-button>
          <a-button type="text">
            <template #icon>
              <icon-edit />
            </template>
            编辑</a-button>
          <a-button type="text" status="danger">
            <template #icon>
              <icon-delete />
            </template>
            删除</a-button>
        </template>
      </a-table>
      <a-drawer  width="20%" :visible="settingsRoleVisible"  unmount-on-close @ok="handleOk" @cancel="handleCancel">
        <template #title>{{title}}</template>
        <a-tree
            :data="dataTree"
            :default-selected-keys="[1, 2]"
            :block-node="true"
            :checkable="true"
            size="large"
        />
      </a-drawer>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import useLoading from '@/hooks/loading';
import { ref } from 'vue';
import {getRoleList, Role, RoleListRes} from "@/api/system/role";
import {getMenuList, Menu, MenuReq} from "@/api/system/menu";
import {getApisList} from "@/api/system/apis";

const { setLoading, loading } = useLoading(true);
const tables = ref<Role[]>([]);
const dataTree = ref<any[]>([]);
const settingsRoleVisible = ref(false);
const title = ref('');

const columns = [
  {
    title: '角色名称',
    dataIndex: 'name',
  },
  {
    title: '角色备注',
    dataIndex: 'desc',
  },
  {
    title: '状态',
    dataIndex: 'status',
    slotName: 'status',
  },
  {
    title: '操作',
    slotName: 'action',
  },
];

interface ApiData {
  id: number;
  path: string;
  method: string;
  desc: string;
  apiGroup: string;
  [key: string]: any; // 允许其他未列出的字段
}
interface TreeNode {
  title: string;
  key: string;
  children?: TreeNode[];
}

const groupByApiGroup = (data: any[]): TreeNode[] => {
  const grouped = data.reduce((acc, item) => {
    if (!acc[item.apiGroup]) {
      acc[item.apiGroup] = [];
    }
    acc[item.apiGroup].push({
      title: `${item.desc}`, // 这里将 method 和 path 组合作为 title
      key: String(item.id),
    });
    return acc;
  }, {} as Record<string, TreeNode[]>);

  return Object.keys(grouped).map(group => ({
    title: group,
    key: group,
    children: grouped[group],
  }));
};

const GetRoleList = async () => {
  setLoading(true);
  try {
    const { data } = await getRoleList();
    tables.value = data;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const transformMenuTree = (data: any[]): any[] => {
  return data.map(item => ({
    title: item.name,
    key: String(item.id),
    children: item.children ? transformMenuTree(item.children) : [],
    // 如果需要添加 icon，可以根据 item 的某个属性来动态生成
    // icon: item.icon ? () => h(IconComponent) : undefined,
  }));
};

const GetMenuTree = async () => {
  setLoading(true);
  try {
    const { data } = await getMenuList();
    dataTree.value = transformMenuTree(data);
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const GetApiTree = async () => {
  setLoading(true);
  try {
    const { data } = await getApisList();
    dataTree.value = groupByApiGroup(data);
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const handleOk = () => {
  if (title.value === '设置菜单权限'){
    settingsRoleVisible.value = false;
  }
  if (title.value === '设置接口权限'){
    settingsRoleVisible.value = false;
  }
};
const handleCancel = () => {
  if (title.value === '设置菜单权限'){
    settingsRoleVisible.value = false;
    dataTree.value = [];
  }
  if (title.value === '设置接口权限'){
    settingsRoleVisible.value = false;
    dataTree.value = [];
  }
}
const MenuRoleSettings = () => {
  GetMenuTree();
  settingsRoleVisible.value = true;
  title.value = '设置菜单权限';
};

const ApiRoleSettings = () => {
  GetApiTree();
  settingsRoleVisible.value = true;
  title.value = '设置接口权限';
};

GetRoleList();

</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}
.text-container {
  white-space: pre-line;
}
</style>