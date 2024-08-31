<template>
  <div class="container">
    <Breadcrumb :items="['系统管理', '接口管理']" />
    <a-card class="general-card" title="接口管理">
      <a-divider style="margin-top: 0" />
      <a-row>
        <a-col :flex="1" style="margin-bottom: 16px">
          <a-button type="primary" @click="CreateApiOpen">
            <template #icon>
              <icon-plus />
            </template>
            新建</a-button
          >
          <a-button
              type="outline"
              style="margin-left: 15px"
              @click="GetApisList"
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

        <template #action="{ record }">
          <a-button type="text" @click="EditApiOpen(record)">
            <template #icon>
              <icon-edit />
            </template>
            编辑</a-button>
          <a-button type="text" status="danger" @click="DeleteApi(record.id)">
            <template #icon>
              <icon-delete />
            </template>
            删除</a-button>
        </template>
      </a-table>
      <a-modal
          v-model:visible="visible"
          draggable="true"
          width="40%"
          @ok="Confirm"
          @cancel="formReset"
         >
        <template #title> {{ title }}</template>
        <a-form :model="form">
          <a-form-item label="接口路径" prop="path" :rules="[{ required: true, message: '请输入接口路径' }]">
            <a-input v-model="form.path" placeholder="请输入接口路径" />
          </a-form-item>
          <a-form-item  label="接口分组" prop="apiGroup" :rules="[{ required: true, message: '请输入接口分组' }]">
            <a-select v-model="form.apiGroup" placeholder="请输入接口分组" allow-create>
              <a-option v-for="item in groups" :key="item">{{ item }}</a-option>
            </a-select>
          </a-form-item>
          <a-form-item label="请求方式" prop="method" :rules="[{ required: true, message: '请输入请求方式' }]">
            <a-select v-model="form.method" placeholder="请输入请求方式">
              <a-option>GET</a-option>
              <a-option>POST</a-option>
              <a-option>PUT</a-option>
              <a-option>DELETE</a-option>
            </a-select>
          </a-form-item>
          <a-form-item label="接口描述" prop="desc" :rules="[{ required: true, message: '请输入接口描述' }]">
            <a-input v-model="form.desc" placeholder="请输入接口描述" />
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import useLoading from '@/hooks/loading';
import { ref } from 'vue';
import { Message } from '@arco-design/web-vue';
import {Api, ApiReq, createApi, deleteApi, editApi, getApiGroups, getApisList} from "@/api/system/apis";

const chooseId = ref(0);
const { setLoading, loading } = useLoading(true);
const visible = ref(false);
const title = ref('');
const tables = ref<Api[]>([]);
const groups = ref<any[]>([]);

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

// 表单
const form = ref<ApiReq>({
  path: '',
  apiGroup: '',
  method: '',
  desc: '',
});


const formReset = () => {
  form.value = {
    path: '',
    apiGroup: '',
    method: '',
    desc: '',
  };
}

const GetApisList = async () => {
  setLoading(true);
  try {
    const data= await getApisList();
    tables.value = data.data as any;
  //  Message.success('获取成功');
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const GetApiGroups = async () => {
  setLoading(true);
  try {
    const data = await getApiGroups();
    groups.value = data.data as any;
    //  Message.success('获取成功');
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

GetApiGroups();
const CreateApi = async () => {
  setLoading(true);
  try {
     await createApi(form.value);
      Message.success('创建成功');
      formReset();
      await GetApisList();
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const EditApi = async () => {
  setLoading(true);
  try {
    await editApi(chooseId.value,form.value);
    Message.success('编辑成功');
    formReset();
    await GetApisList();
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const DeleteApi = async (id:number) => {
  setLoading(true);
  try {
    await deleteApi(id);
    Message.success('删除成功');
    await GetApisList();
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

GetApisList();

const CreateApiOpen = () => {
  visible.value = true;
  title.value = '创建接口';
};

const EditApiOpen = (row:any) => {
  visible.value = true;
  title.value = '编辑接口';
  form.value.apiGroup = row.apiGroup;
  form.value.desc = row.desc;
  form.value.method = row.method;
  form.value.path = row.path;
  chooseId.value = row.id;
};


const Confirm = () => {
  if (title.value === '创建接口') {
    CreateApi();
  }
  if (title.value === '编辑接口') {
    EditApi();
  }
};

</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}
.text-container {
  white-space: pre-line;
}
</style>