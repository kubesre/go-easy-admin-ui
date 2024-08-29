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
          <a-button type="text" @click="RoleSettings">
            <template #icon>
              <icon-settings />
            </template>
            设置权限</a-button>
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


      <a-drawer  width="30%" :visible="roleVisible">
        <template #title>角色权限设置</template>
<!--          <a-radio-group type='button' size="large" style="width: 100%" fill="true">-->
<!--            <a-radio value="mini">菜单权限</a-radio>-->
<!--            <a-radio value="small">接口权限</a-radio>-->
<!--          </a-radio-group>-->
<!--        <a-tree-->
<!--          :default-selected-keys="['1']"-->
<!--          :field-names="{title: 'name', key: 'path', children: 'children'}"-->
<!--          :data="menuList"-->
<!--        />-->
        <template>
          <a-tree
              :default-selected-keys="['0-0-1']"
              :fieldNames="{
      key: 'path',
      title: 'name',
      children: 'children',
      icon: 'icon',
    }"
              :data="menuList"
          />
        </template>
      </a-drawer>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import useLoading from '@/hooks/loading';
import { ref } from 'vue';
import {getRoleList, Role, RoleListRes} from "@/api/system/role";
import {getMenuList, Menu} from "@/api/system/menu";

const { setLoading, loading } = useLoading(true);
const tables = ref<Role[]>([]);
const menuList = ref<Menu[]>([]);
const roleVisible = ref(false);
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



const GetMenuList = async () => {
  setLoading(true);
  try {
    const { data } = await getMenuList();
    menuList.value = data

  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};
GetMenuList();
const RoleSettings = () => {
  roleVisible.value = true;
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