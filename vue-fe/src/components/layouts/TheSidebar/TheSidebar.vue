<template lang="">
  <div class="sidebar" :class="{ 'sidebar-mini': sidebarStatus }">
    <div
      class="sidebar-list"
      v-if="
        $store.state.loginStatus.loginedAccountRole ===
        $_MisaEnums.LOGIN_ROLE.ADMIN
      "
    >
      <router-link to="/admin/admin-activities-management" class="sidebar-item">
        <div class="sidebar-item-icon activities-icon"></div>
        <div class="sidebar-item-name">Hoạt động</div>
      </router-link>
      <router-link to="/admin/admin-interview-management" class="sidebar-item">
        <div class="sidebar-item-icon interview-icon"></div>
        <div class="sidebar-item-name">Phỏng vấn</div>
      </router-link>
      <router-link to="/admin/admin-volunteer-management" class="sidebar-item">
        <div class="sidebar-item-icon personnal-infor-icon"></div>
        <div class="sidebar-item-name">Tình nguyện viên</div>
      </router-link>
      <router-link to="/admin/admin-student-management" class="sidebar-item">
        <div class="sidebar-item-icon volunteer-infor-icon"></div>
        <div class="sidebar-item-name">Sinh viên</div>
      </router-link>
      <router-link to="/admin/admin-statistical" class="sidebar-item">
        <div class="sidebar-item-icon interview-list-icon"></div>
        <div class="sidebar-item-name">Thống kê</div>
      </router-link>
      <router-link to="/information" class="sidebar-item">
        <div class="sidebar-item-icon introduce-icon"></div>
        <div class="sidebar-item-name">Thông tin</div>
      </router-link>
    </div>

    <div
      class="sidebar-list"
      v-else-if="
        $store.state.loginStatus.loginedAccountRole ===
        $_MisaEnums.LOGIN_ROLE.VOLUNTEER
      "
    >
      <router-link to="/volunteer/information" class="sidebar-item">
        <div class="sidebar-item-icon personnal-infor-icon"></div>
        <div class="sidebar-item-name">Thông tin cá nhân</div>
      </router-link>
      <router-link to="/volunteer/volunteer-activities" class="sidebar-item">
        <div class="sidebar-item-icon activities-icon"></div>
        <div class="sidebar-item-name">Hoạt động tham gia</div>
      </router-link>
      <router-link to="/information" class="sidebar-item">
        <div class="sidebar-item-icon introduce-icon"></div>
        <div class="sidebar-item-name">Giới thiệu</div>
      </router-link>
    </div>

    <div class="sidebar-list" v-else>
      <router-link to="/information" class="sidebar-item">
        <div class="sidebar-item-icon introduce-icon"></div>
        <div class="sidebar-item-name">Giới thiệu</div>
      </router-link>
      <router-link to="/information" class="sidebar-item">
        <div class="sidebar-item-icon instruction-icon"></div>
        <div class="sidebar-item-name">Hướng dẫn</div>
      </router-link>
      <router-link to="/information" class="sidebar-item">
        <div class="sidebar-item-icon featured-page"></div>
        <div class="sidebar-item-name">Nổi bật</div>
      </router-link>
    </div>

    <div class="sidebar-shrink" @click="onClickSidebarShrink">
      <div class="sidebar-shrink-icon"></div>
      <span class="sidebar-shrink-title">Thu gọn</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "TheSidebar",

  props: {
    // Prop được đẩy vào từ App cho các components: TheSidebar, TheHeader, TheMain thể hiện trạng thái của sidebar (thu gọn / đầy đủ)
    sidebarStatus: { type: Boolean },
  },

  computed: {},

  // Các emit truyền ra ngoài
  emits: ["notifyToggleSidebar"],

  methods: {
    /**
     * Author : PNNHai
     * Date :
     * Description : Hàm sẽ truyền emit ra bên ngoài báo hiệu thay đổi sidebar khi click vào nút thu gọn
     */
    onClickSidebarShrink() {
      this.$emit("notifyToggleSidebar");
    },
  },
};
</script>
<style lang="css">
@import "./sidebar.css";
</style>
