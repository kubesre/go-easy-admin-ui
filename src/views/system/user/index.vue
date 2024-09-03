<template>
  <div class="container">
    <Breadcrumb :items="['系统管理', '用户管理']" />
    <a-card class="general-card" title="用户管理">
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
              @click="GetUserList"
          >
            <template #icon>
              <icon-refresh />
            </template>
            刷新</a-button
          >
        </a-col>
      </a-row>
      <a-table :loading="loading" :columns="columns" :data="tables" :pagination="pagination" @page-change="onPageChange">
        <template #avatar="{ record }">
          <a-avatar :src="record.avatar">
            <img
                alt="avatar"
                :src="record.avatar"
            />
          </a-avatar>
        </template>
        <template #status="{record}">
          <a-switch v-model="record.status" :checked-value="1" :unchecked-value="2" @change="UserStatusChange(record)"></a-switch>
        </template>
        <template #roles="{record}">
          <a-space>
            <a-tag v-for="item in record.roles" :key="item">{{ item.name }}</a-tag>
          </a-space>

        </template>
        <template #action="{ record }">
          <a-button type="text" @click="EditApiOpen(record)">
            <template #icon>
              <icon-edit />
            </template>
            编辑</a-button>
          <a-button type="text" status="danger" @click="DeleteUser(record.id)">
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
          @cancel="formReset"
          @ok="Confirm"
      >
        <template #title> {{ title }}</template>
        <a-form :model="form">
          <a-form-item label="用户名称" prop="userName" :rules="[{ required: true, message: '请输入用户名' }]">
            <a-input v-model="form.userName" placeholder="请输入用户名" />
          </a-form-item>
          <a-form-item label="用户昵称" prop="nickName" :rules="[{ required: true, message: '请输入用户昵称' }]">
            <a-input v-model="form.nickName" placeholder="请输入用户昵称" />
          </a-form-item>
          <a-form-item field="email"  label="邮箱地址" prop="email" :rules="[{ required: true, message: '请输入邮箱地址',type:'email' }]">
            <a-input v-model="form.email" placeholder="请输入邮箱地址" />
          </a-form-item>
          <a-form-item label="电话号码" prop="phone" :rules="[{ required: true, message: '请输入电话号码'}]">
            <a-input v-model="form.phone" :default-value="form.phone" placeholder="请输入电话号码" />
          </a-form-item>
          <a-form-item label="用户状态" prop="status" :rules="[{ required: true, message: '请输入用户状态' }]">
            <a-switch v-model="form.status" :checked-value="1" :unchecked-value="2"></a-switch>
          </a-form-item>
          <a-form-item label="用户角色" prop="role" :rules="[{ required: true, message: '请输入用户角色' }]">
            <a-select v-model="form.roles" placeholder="请选择用户角色" multiple>
                <a-option v-for="item in roleList" :key="item.id" :value="item.id">{{ item.name }}</a-option>
            </a-select>
          </a-form-item>
          <a-form-item label="用户头像" prop="avatar" :rules="[{ required: true, message: '请输入用户角色' }]">
            <a-upload
                action="/"
                :file-list="file ? [file] : []"
                :show-file-list="false"
                @change="onChange"
                @progress="onProgress"
            >
              <template #upload-button>
                <div
                    :class="`arco-upload-list-item${
            file && file.status === 'error' ? ' arco-upload-list-item-error' : ''
          }`"
                >
                  <div
                      v-if="file && file.url"
                      class="arco-upload-list-picture custom-upload-avatar"
                  >
                    <img :src="file.url" />
                    <div class="arco-upload-list-picture-mask">
                      <IconEdit />
                    </div>
                    <a-progress
                        v-if="file.status === 'uploading' && file.percent < 100"
                        :percent="file.percent"
                        type="circle"
                        size="mini"
                        :style="{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translateX(-50%) translateY(-50%)',
              }"
                    />
                  </div>
                  <div v-else class="arco-upload-picture-card">
                    <div class="arco-upload-picture-card-text">
                      <IconPlus />
                    </div>
                  </div>
                </div>
              </template>
            </a-upload>
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
import {createUser, deleteUser, editUser, getUserList, User, UserListRes, UserReq} from "@/api/system/user";
import {IconEdit, IconPlus} from "@arco-design/web-vue/es/icon";
import {createApi, deleteApi, editApi} from "@/api/system/apis";
import {getRoleList, Role} from "@/api/system/role";

const { setLoading, loading } = useLoading(true);
const avatarSrc = ref<string | null>(null);
const visible = ref(false);
const title = ref('');
const tables = ref<User[]>([]);
const file = ref();
const chooseId = ref(0);
const roleList = ref<Role[]>([]);

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
    title: '角色',
    dataIndex: 'roles',
    slotName: 'roles',
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
const changeSwitch  = (value:number) => {
  // eslint-disable-next-line no-use-before-define
  form.value.status = value
};


// 分页
const pagination = ref({
  total: 0,
  pageSize: 10,
  current: 1,
});


// 表单
const form = ref<UserReq>({
  userName: '',
  nickName: '',
  avatar: '',
  email: '',
  phone: '',
  password: '12345678',
  roles:[],
  status: 1,
});
const formReset = () => {
  form.value = {
    userName: '',
    nickName: '',
    avatar: '',
    status: 1,
    email: '',
    phone: '',
    password: '12345678',
    roles:[]
  };
  file.value = '';
}

const GetUserList = async () => {
  setLoading(true);
  try {
    const { data } = await getUserList({page:pagination.value.current, limit: pagination.value.pageSize});
    tables.value = data.Items;
    pagination.value.total = data.Total;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};
const GetRoleList = async () => {
  setLoading(true);
  try {
    const { data } = await getRoleList();
    roleList.value = data;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};
const onPageChange = (page: number) => {
  pagination.value.current = page;
  GetUserList();
};
GetUserList();
GetRoleList();
const CreateApiOpen = () => {
  visible.value = true;
  title.value = '创建用户';
};

const UserStatusChange = async (row:any) => {
  setLoading(true);
  try {
    form.value.userName = row.userName;
    form.value.nickName = row.nickName;
    form.value.email = row.email;
    form.value.phone = row.phone;
    form.value.status = row.status;
    form.value.roles = row.roles.map((role: any) => role.id);
    form.value.avatar = row.avatar;
    await editUser(row.id,form.value);
    if (row.status === 2) {
      Message.success('已禁用');
    } else {
      Message.success('已启用');}
    await GetUserList();
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};


const EditApiOpen = (row:any) => {
  visible.value = true;
  title.value = '编辑用户';
  form.value.userName = row.userName;
  form.value.nickName = row.nickName;
  form.value.email = row.email;
  form.value.phone = row.phone;
  form.value.status = row.status;
  form.value.roles = row.roles.map((role: any) => role.id);
  file.value = {url:row.avatar};
  chooseId.value = row.id;
};



const CreateUser = async () => {
  setLoading(true);
  try {
    await createUser(form.value);
    Message.success('创建成功');
    formReset();
    await GetUserList();
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const DeleteUser = async (id:number) => {
  setLoading(true);
  try {
    await deleteUser(id);
    Message.success('删除成功');
    await GetUserList();
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const EditUser = async () => {
  setLoading(true);
  try {
    await editUser(chooseId.value,form.value);
    Message.success('编辑成功');
    formReset();
    await GetUserList();
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};
const Confirm = () => {
  if (title.value === '创建用户') {
    form.value.avatar = file.value?.url;
    CreateUser();
  }
  if (title.value === '编辑用户') {
    form.value.avatar = file.value?.url;
    EditUser();
  }
};

const onChange = (_:any, currentFile:any) => {
  const reader = new FileReader();
  reader.onload = () => {
    file.value = {
      ...currentFile,
      url: reader.result, // 将文件转换后的 Base64 数据赋值给 url
    };
  };
  if (currentFile.file) {
    reader.readAsDataURL(currentFile.file); // 读取文件并转换为 Base64
  }
};
const onProgress = (currentFile:any) => {
  file.value = currentFile;
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