<template>
  <div>
    <!-- 使用 a-switch 组件并将其绑定到 number 类型的 model-value -->
    <a-switch v-model="form.status" :checked-value="1" :unchecked-value="2"></a-switch>
    <p>当前状态: {{ form.status }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 初始化 form 对象，其中 status 是一个 number 类型
      form: {
        status: 1, // 默认值可以为 1 或 2
      },
    };
  },
};
</script>
