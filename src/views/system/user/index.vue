<template>
  <div class="container">
    <Breadcrumb :items="['系统管理', '用户管理']" />
    <a-card class="general-card" title="用户管理">
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
          <a-tag v-if="record.status == 1" color="#00b42a">正常</a-tag>
          <a-tag v-if="record.status == 0" color="#f53f3f">禁用</a-tag>
        </template>

        <template #action>
          <a-button type="text">编辑</a-button>
          <a-button type="text">删除</a-button>
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

const { setLoading, loading } = useLoading(true);
const visible = ref(false);
const Title = ref('');
const tables = ref<UserListRes[]>([]);
const page = ref(1);
const pageSize = ref(10);

const columns = [
  {
    title: '用户名',
    dataIndex: 'userName',
  },
  {
    title: '昵称',
    dataIndex: 'nickName',
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    slotName: 'avatar',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
  },
  {
    title: '手机',
    dataIndex: 'phone',
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
const GetUserList = async () => {
  setLoading(true);
  try {
    const { data } = await getUserList({page:1, limit: 10});
    tables.value = data.Items;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

GetUserList();

</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}
.text-container {
  white-space: pre-line;
}
</style>