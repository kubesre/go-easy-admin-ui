<template>
  <div class="container">
    <Breadcrumb :items="['系统管理', '角色管理']" />
    <a-card class="general-card" title="角色管理">
      <a-divider style="margin-top: 0" />
      <a-row>
        <a-col :flex="1" style="margin-bottom: 16px">
          <a-button type="primary" @click="CreateRoleOpen">
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
          <a-switch v-model="record.status" :checked-value="1" :unchecked-value="2"></a-switch>
        </template>

        <template #action="{record}">
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
          <a-button type="text" @click="EditRoleOpen(record)">
            <template #icon>
              <icon-edit />
            </template>
            编辑</a-button>
          <a-button type="text" status="danger" @click="DeleteRole(record.id)">
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

      <a-modal
          v-model:visible="RoleVisible"
          draggable="true"
          width="40%"
          @ok="Confirm"
          @cancel="formReset"
      >
        <template #title> {{ title }}</template>
        <a-form :model="form">
          <a-form-item label="角色名称" name="name" :rules="[{ required: true, message: '请输入角色名称' }]">
            <a-input  v-model="form.name" placeholder="请输入角色名称" />
          </a-form-item>
          <a-form-item label="角色备注" name="name" :rules="[{ required: true, message: '请输入角色备注' }]">
            <a-input  v-model="form.desc" placeholder="请输入角色备注" />
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import useLoading from '@/hooks/loading';
import { ref } from 'vue';
import {createRole, deleteRole, editRole, getRoleList, Role, RoleListRes, RoleReq} from "@/api/system/role";
import {createMenu, deleteMenu, getMenuList, Menu, MenuReq} from "@/api/system/menu";
import {getApisList} from "@/api/system/apis";
import {Message} from "@arco-design/web-vue";

const { setLoading, loading } = useLoading(true);
const tables = ref<Role[]>([]);
const dataTree = ref<any[]>([]);
const settingsRoleVisible = ref(false);
const RoleVisible = ref(false);
const title = ref('');
const chooseId = ref(0);

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


const form = ref<RoleReq>({
  name: '',
  desc: '',
});

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
    dataTree.value = groupByApiGroup(data as any);
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


const CreateRoleOpen = () => {
  RoleVisible.value = true;
  title.value = '创建角色';
};


const EditRoleOpen = (row:any) => {
  RoleVisible.value = true;
  title.value = '编辑角色';
  form.value.desc = row.desc;
  form.value.name = row.name;
  chooseId.value = row.id;
};
const formReset = () =>{

}

const CreateRole = async () => {
  setLoading(true);
  try {
    await createRole(form.value);
    Message.success('添加成功');
    await GetRoleList();
    formReset()
  } catch (err) {
    formReset();
  } finally {
    formReset();
    setLoading(false);
  }
};


const EditRole = async () => {
  setLoading(true);
  try {
    await editRole(chooseId.value,form.value);
    Message.success('编辑成功');
    await GetRoleList();
    formReset()
  } catch (err) {
    formReset();
  } finally {
    formReset();
    setLoading(false);
  }
};


const DeleteRole = async (id:number) => {
  setLoading(true);
  try {
    await deleteRole(id);
    Message.success('删除成功');
    await GetRoleList();
    formReset();

  } catch (err) {
    formReset();
  } finally {
    formReset();
    setLoading(false);
  }
};
const Confirm = () => {
  if (title.value === '创建角色'){
    RoleVisible.value = false;
    CreateRole();
  }
  if (title.value === '编辑角色'){
    RoleVisible.value = false;
    EditRole();
  }
}



</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}
.text-container {
  white-space: pre-line;
}
</style>