<template>
  <the-header :sidebarStatus="isSidebarMini" />

  <!-- Emit toggleSidebar nhận từ sidebar sang -->
  <the-sidebar
    :sidebarStatus="isSidebarMini"
    @notifyToggleSidebar="toggleSidebar"
  />

  <the-main :sidebarStatus="isSidebarMini" />

  <misa-loading v-if="$store.state.isLoading" />

  <div class="toast-wrapper">
    <misa-toast
      v-for="toast in $store.state.toast"
      :key="toast.id"
      :toastType="toast.type"
      @notyfyCloseToast="closeToast(toast.id)"
    >
      {{ toast.message }}
    </misa-toast>
  </div>

  <misa-dialog
    v-if="$store.state.dialogNotify.isShow"
    :dialogType="$store.state.dialogNotify.type"
    :dialogText="$store.state.dialogNotify.text"
    :numberOfButton="1"
    @notifyCloseDialog="handleCloseDialog"
  />
</template>

<script>
import TheHeader from "@/components/layouts/TheHeader/TheHeader.vue";
import TheSidebar from "@/components/layouts/TheSidebar/TheSidebar.vue";
import TheMain from "@/components/layouts/TheMain/TheMain.vue";

import MisaLoading from "./components/base/loading/MisaLoading.vue";
import MisaToast from "@/components/base/toast/MisaToast.vue";

export default {
  name: "App",
  components: {
    TheHeader,
    TheSidebar,
    TheMain,
    MisaLoading,
    MisaToast,
  },

  data() {
    return {
      isSidebarMini: false,
    };
  },

  created() {
    const accountRole = parseInt(localStorage.getItem("accountRole"));
    const studentCode = localStorage.getItem("studentCode");
    const userName = localStorage.getItem("userName");

    if (accountRole !== null && studentCode !== null && userName !== null) {
      this.$store.commit("updateLoginStatus", {
        accountRole,
        studentCode,
        userName,
      });
    }
  },

  methods: {
    /**
     * Author : PNNHai
     * Date :
     * Description : Hàm để ẩn hiện thanh sidebar nhận dữ liệu từ emit bên phía sidebar
     * để có thể căn chỉnh chiều rộng cho cả header và main
     */
    toggleSidebar() {
      this.isSidebarMini = !this.isSidebarMini;
    },

    closeToast(id) {
      this.$store.commit("closeToast", id);
    },

    handleCloseDialog() {
      this.$store.state.dialogNotify.isShow = false;
    },
  },
};
</script>

<style>
@import "../src/css/main.css";
</style>
