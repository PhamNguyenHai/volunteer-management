<template lang="">
  <div class="main-content" :class="{ 'max-main-content': sidebarStatus }">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: "TheMain",

  props: {
    // Prop được đẩy vào từ App cho các components: TheSidebar, TheHeader, TheMain thể hiện trạng thái của sidebar (thu gọn / đầy đủ)
    sidebarStatus: { type: Boolean },
  },
};
</script>
<style lang="css" scoped>
@import "./content.css";
</style>
