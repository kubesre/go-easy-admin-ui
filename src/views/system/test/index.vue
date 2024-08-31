<template>
  <a-tree
      :default-selected-keys="['0-0-1']"
      :field-names="{
      key: 'path',
      title: 'name',
    }"
      :data="treeData"
  />
</template>
<script>
import { h } from 'vue';
import { IconStar, IconDriveFile } from '@arco-design/web-vue/es/icon';

export default {
  data() {
    return {
      // eslint-disable-next-line no-use-before-define
      treeData,
    };
  },
};
const treeData = [
  {
    id: 22,
    name: '1',
    children: [
      {
        id: 23,
        name: '2',
        children: [
          {
            id: 24,
            name: '3',
            children: []
          }
        ]
      }
    ]
  }
];


</script>
