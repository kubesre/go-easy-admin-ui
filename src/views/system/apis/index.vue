<template>
  <div class="container">
    <Breadcrumb :items="['系统管理', '接口管理']" />
    <a-card class="general-card" title="接口管理">
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
              @click="GetHostsList"
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
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import useLoading from '@/hooks/loading';
import { ref } from 'vue';
import { Message } from '@arco-design/web-vue';
import {getUserList, UserListRes} from "@/api/system/user";
import {getRoleList, RoleListRes} from "@/api/system/role";
import {ApisListRes, getApisList} from "@/api/system/apis";

const { setLoading, loading } = useLoading(true);
const visible = ref(false);
const Title = ref('');
const tables = ref<ApisListRes[]>([]);
const page = ref(1);
const pageSize = ref(10);

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '接口路径',
    dataIndex: 'path',
  },
  {
    title: '接口分组',
    dataIndex: 'apiGroup',
  },
  {
    title: '接口描述',
    dataIndex: 'desc',
  },
  {
    title: '请求方式',
    dataIndex: 'method',
  },
  {
    title: '操作',
    slotName: 'action',
  },
];
const GetApisList = async () => {
  setLoading(true);
  try {
    const { data } = await getApisList({page:1, limit: 10});
    tables.value = data.Items;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

GetApisList();

</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}
.text-container {
  white-space: pre-line;
}
</style>