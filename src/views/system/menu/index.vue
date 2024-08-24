<template>
  <div class="container">
    <Breadcrumb :items="['系统管理', '接口管理']" />
    <a-card class="general-card" title="接口管理">
      <a-divider style="margin-top: 0" />
      <a-row>
        <a-col :flex="1" style="margin-bottom: 16px">
          <a-button type="primary" @click="CreateRootMenu">
            <template #icon>
              <icon-plus />
            </template>
            添加根菜单</a-button
          >
          <a-button
              type="outline"
              style="margin-left: 15px"
              @click="GetMenuList"
          >
            <template #icon>
              <icon-refresh />
            </template>
            刷新</a-button
          >
        </a-col>
      </a-row>
      <a-table :loading="loading" :columns="columns" :data="tables">
        <template #is_show="{ record }">
          <div v-if="record.is_show === 2">显示</div>
          <div v-if="record.is_show === 1">隐藏</div>
        </template>
        <template #icon="{ record }">
          <span v-if="record.icon === 'icon-settings' "><icon-settings /> {{record?.icon}}</span>
          <span v-if="record.icon === 'icon-home' "><icon-home/> {{record?.icon}}</span>
          <span v-if="record.icon === 'icon-user' "><icon-user/> {{record?.icon}}</span>
          <span v-if="record.icon === 'icon-menu' "><icon-menu/> {{record?.icon}}</span>
          <span v-if="record.icon === 'icon-stamp' "><icon-stamp/> {{record?.icon}}</span>
          <span v-if="record.icon === 'icon-desktop' "><icon-desktop/> {{record?.icon}}</span>
        </template>
        <template #action="{ record }">
          <a-button type="text" @click="CreateChildrenMenu(record.id,record.name)">
            <template #icon>
              <icon-plus />
            </template>
            添加子菜单</a-button>
          <a-button type="text" @click="EditMenuOpen(record)">
            <template #icon>
              <icon-edit />
            </template>
            编辑</a-button>
          <a-button type="text" status="danger" @click="DeleteMenu(record.id)">
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
          <a-form-item label="菜单名称" :rules="[{ required: true, message: '请输入菜单名称' }]">
            <a-input v-if="title != '编辑菜单'" v-model="form.name" placeholder="请输入菜单名称"></a-input>
            <a-input v-if="title === '编辑菜单'" v-model="form.name" placeholder="请输入菜单名称" disabled></a-input>
          </a-form-item>
          <a-form-item label="菜单图标" :rules="[{ required: true, message: '请选择菜单图标' }]">
            <a-select v-model="form.icon" placeholder="请选择菜单图标">
              <template #label="{ data }">
                <span v-if="data.label === 'icon-home' "><icon-home/> {{data?.label}}</span>
                <span v-if="data.label === 'icon-user' "><icon-user/> {{data?.label}}</span>
                <span v-if="data.label === 'icon-settings' "><icon-settings/> {{data?.label}}</span>
                <span v-if="data.label === 'icon-menu' "><icon-menu/> {{data?.label}}</span>
                <span v-if="data.label === 'icon-stamp' "><icon-stamp/> {{data?.label}}</span>
                <span v-if="data.label === 'icon-desktop' "><icon-desktop/> {{data?.label}}</span>
              </template>
              <a-option value="icon-home" label="icon-home"><icon-home ></icon-home>  icon-home</a-option>
              <a-option value="icon-user" label="icon-user"><icon-user ></icon-user>  icon-user</a-option>
              <a-option value="icon-settings" label="icon-settings"><icon-settings /> icon-settings</a-option>
              <a-option value="icon-menu" label="icon-menu"><icon-menu />  icon-menu</a-option>
              <a-option value="icon-stamp" label="icon-stamp"><icon-stamp />  icon-stamp</a-option>
              <a-option value="icon-desktop" label="icon-desktop"><icon-desktop /> icon-desktop</a-option>
            </a-select>
          </a-form-item>
          <a-form-item label="路由名称" :rules="[{ required: true, message: '请输入路由名称' }]">
            <a-input v-model="form.name_code" placeholder="请输入路由名称"></a-input>
          </a-form-item>
          <a-form-item label="路由路径" :rules="[{ required: true, message: '请输入路由路径' }]">
            <a-input v-model="form.path" placeholder="请输入路由路径"></a-input>
          </a-form-item>
          <a-form-item label="是否隐藏" :rules="[{ required: true, message: '是否隐藏' }]">
            <a-select v-model="form.is_show"  placeholder="请选择是否隐藏">
              <a-option :value=2 label="显示">显示</a-option>
              <a-option :value=1 label="隐藏">隐藏</a-option>
            </a-select>
          </a-form-item>
          <a-form-item label="父节点" :rules="[{ required: true, message: '请选择父节点' }]">
            <a-input v-if="title === '添加根菜单'" default-value="根菜单"  placeholder="请选择父节点" disabled></a-input>
            <a-input v-if="title === '添加子菜单'" :default-value="parentName"  placeholder="请选择父节点" disabled></a-input>
            <a-input v-if="title === '编辑菜单'" :default-value="parentName"  placeholder="请选择父节点" disabled></a-input>
          </a-form-item>
          <a-form-item label="菜单排序" :rules="[{ required: true, message: '请选择父节点' }]">
            <a-input v-model="form.sort" placeholder="请选择父节点"></a-input>
          </a-form-item>
          <a-form-item label="组件路径" :rules="[{ required: true, message: '请输入组件路径' }]">
            <a-input v-model="form.component" placeholder="请输入组件路径"></a-input>
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
import {getUserList, UserListRes} from "@/api/system/user";
import {getRoleList, RoleListRes} from "@/api/system/role";
import {Api, ApisListRes, getApisList} from "@/api/system/apis";
import {createMenu, deleteMenu, editMenu, getMenuList, Menu, MenuReq} from "@/api/system/menu";
import {onClickOutside} from "@vueuse/core";

const { setLoading, loading } = useLoading(true);
const visible = ref(false);
const chooseId = ref(0);
const title = ref('');
const tables = ref<Menu[]>([]);

const parentName = ref('');
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '菜单名称',
    dataIndex: 'name',
  },
  {
    title: '图标',
    dataIndex: 'icon',
    slotName: 'icon'
  },
  {
    title: '路由名称',
    dataIndex: 'name_code',
  },
  {
    title: '路由路径',
    dataIndex: 'path',
  },
  {
    title: '是否隐藏',
    dataIndex: 'is_show',
    slotName: 'is_show',
  },
  {
    title: '父节点',
    dataIndex: 'parent_id',
  },
  {
    title: '排序',
    dataIndex: 'sort',
  },
  {
    title: '组件路径',
    dataIndex: 'component',
  },
  {
    title: '操作',
    slotName: 'action',
  },
];
const GetMenuList = async () => {
  setLoading(true);
  try {
    const { data } = await getMenuList();
    tables.value = data;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const form = ref<MenuReq>({
  name: '',
  name_code: '',
  is_show: 1,
  icon: '',
  path: '',
  sort: 0,
  parent_id: 0,
  component: ''
});

GetMenuList();

const formReset = () => {
  form.value = {
    name: '',
    name_code: '',
    is_show: 0,
    icon: '',
    path: '',
    sort: 0,
    parent_id: 0,
    component: ''
  };
  parentName.value = ''
}
const CreateRootMenu = () => {
  visible.value = true;
  title.value = '添加根菜单';
};


const CreateChildrenMenu = (id:number,name:string) => {
  visible.value = true;
  title.value = '添加子菜单';
  form.value.parent_id = id;
  parentName.value = name;
};

const EditMenuOpen = (row:any) => {
  visible.value = true;
  title.value = '编辑菜单';
  form.value.name = row.name;
  form.value.name_code = row.name_code;
  form.value.is_show = row.is_show;
  form.value.icon = row.icon;
  form.value.path = row.path;
  form.value.sort = row.sort;
  form.value.component = row.component;
  if (row.parent_id === 0) {
    parentName.value = '根菜单';
  }
  chooseId.value = row.id;
};


const CreateMenu = () => {
  setLoading(true);
  try {
    createMenu(form.value).then((response) => {
      if (response.data.code === 20000) {
        Message.success('添加成功');
        GetMenuList();
        formReset();
      }
    });
  } catch (err) {
    formReset();
  } finally {
    formReset();
    setLoading(false);
  }
};

const EditMenu = () => {
  setLoading(true);
  try {
    editMenu(chooseId.value,form.value).then((response) => {
      if (response.data.code === 20000) {
        Message.success('编辑成功');
        GetMenuList();
        formReset();
      }
    });
  } catch (err) {
    formReset();
  } finally {
    formReset();
    setLoading(false);
  }
};

const DeleteMenu = (id:number) => {
  setLoading(true);
  try {
    deleteMenu(id).then((response) => {
      if (response.data.code === 20000) {
        Message.success('删除成功');
        GetMenuList();
        formReset();
      }
    });
  } catch (err) {
    formReset();
  } finally {
    formReset();
    setLoading(false);
  }
};

const Confirm = () => {
  if (title.value === '添加根菜单') {
    form.value.parent_id = 0;
    CreateMenu();
  }
  if (title.value === '添加子菜单') {
    CreateMenu();
  }
  if (title.value === '编辑菜单') {
    EditMenu();
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