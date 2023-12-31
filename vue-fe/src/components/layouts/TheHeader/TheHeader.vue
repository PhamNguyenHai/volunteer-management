<template lang="">
  <header class="header" :class="{ 'logo-header-mini': sidebarStatus }">
    <div class="header-left">
      <router-link
        to="/volunteer"
        class="header-login"
        v-if="
          $store.state.loginStatus.loginedAccountRole ===
          $_MisaEnums.LOGIN_ROLE.VOLUNTEER
        "
      >
        <div class="header-software-area">
          <div class="header-logo"></div>
          <h3 class="header-software-name">
            {{ $_MisaResources.appText.softwareName }}
          </h3>
        </div>
      </router-link>
      <router-link
        to="/admin"
        class="header-login"
        v-else-if="
          $store.state.loginStatus.loginedAccountRole ===
          $_MisaEnums.LOGIN_ROLE.ADMIN
        "
      >
        <div class="header-software-area">
          <div class="header-logo"></div>
          <h3 class="header-software-name">
            {{ $_MisaResources.appText.softwareName }}
          </h3>
        </div>
      </router-link>

      <router-link to="/" class="header-login" v-else>
        <div class="header-software-area">
          <div class="header-logo"></div>
          <h3 class="header-software-name">
            {{ $_MisaResources.appText.softwareName }}
          </h3>
        </div>
      </router-link>
    </div>

    <div class="header-right">
      <div class="header-unit-current">
        <div class="header-unit-option"></div>
        <h3 class="header-unit-name">
          {{ $_MisaResources.appText.headingTitle }}
        </h3>
        <div class="header-unit-arrow"></div>
      </div>
      <div class="header-infor">
        <div
          class="header-unlogin"
          v-if="$store.state.loginStatus.loginedAccountRole === null"
        >
          <router-link to="/volunteer-register" class="header-register"
            >Đăng ký phỏng vấn</router-link
          >
          <router-link to="/login" class="header-login">Đăng nhập</router-link>
        </div>
        <div class="header-user" v-else>
          <div class="user-avatar"></div>
          <h3 class="user-name">
            {{ $store.state.loginStatus.logginedUserName }}
          </h3>
          <div class="user-name-arrow" @click.stop="toggleUserFunction">
            <ul class="user-functions" v-if="isShowUserOption">
              <li
                class="user-option"
                @click.stop="handleShowPersonalInfor"
                v-if="
                  $store.state.loginStatus.loginedAccountRole !==
                  $_MisaEnums.LOGIN_ROLE.ADMIN
                "
              >
                Thông tin cá nhân
              </li>
              <li class="user-option" @click.stop="handleLogout">Đăng xuất</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
<script>
import authenService from "@/js/services/auth/AuthenServices";
export default {
  name: "TheHeader",

  data() {
    return {
      isShowUserOption: false,
    };
  },

  props: {
    // Prop được đẩy vào từ App cho các components: TheSidebar, TheHeader, TheMain thể hiện trạng thái của sidebar (thu gọn / đầy đủ)
    sidebarStatus: { type: Boolean },
  },

  methods: {
    toggleUserFunction() {
      this.isShowUserOption = !this.isShowUserOption;
    },

    handleShowPersonalInfor() {
      this.$router.push("/volunteer/information");
      this.isShowUserOption = false;
    },

    async handleLogout() {
      try {
        this.$store.state.isLoading = true;
        const res = await authenService.logout();
        if (res.success) {
          this.$store.commit("addToast", {
            type: "success",
            message: "Đăng xuất thành công",
          });
          localStorage.removeItem("accessToken");
          localStorage.removeItem("accountRole");
          localStorage.removeItem("studentCode");
          localStorage.removeItem("userName");

          this.isShowUserOption = false;
          this.$store.commit("logout");

          this.$router.push("/");
        }
      } catch (err) {
        console.error(err);
      } finally {
        this.$store.state.isLoading = false;
      }
    },
  },
};
</script>
<style lang="css" scoped>
@import "./header.css";
</style>
