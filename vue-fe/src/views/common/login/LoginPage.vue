<template lang="">
  <div class="login-area">
    <form action="" class="login-form">
      <h3 class="login-form-heading">ĐĂNG NHẬP</h3>
      <div class="login-infor">
        <misa-text-field
          label="Tên đăng nhập"
          fieldClass="login-field"
          textFieldId="username"
          textFieldClass="size-xl"
          v-model="account.username"
        />
        <misa-text-field
          label="Mật khẩu"
          fieldClass="login-field"
          textFieldId="password"
          textFieldClass="size-xl"
          :textType="isShowPassword ? 'text' : 'password'"
          v-model="account.password"
        />
      </div>

      <misa-checkbox-field
        label="Hiển thị mật khẩu"
        checkboxId="displayPassword"
        fieldClass="display-password"
        v-model="isShowPassword"
      />

      <div class="login-form-footer">
        <router-link to="/volunteer-register" class="registering"
          >Đăng ký phỏng vấn</router-link
        >
        <misa-button
          buttonName="Đăng nhập"
          buttonClass="button primary-button"
          @click.stop="handleLogin"
        />
      </div>
    </form>
  </div>
</template>

<script>
import AuthServices from "@/js/services/auth/AuthenServices.js";
export default {
  name: "LoginPage",
  data() {
    return {
      account: {
        username: null,
        password: null,
      },
      isShowPassword: false,
    };
  },

  methods: {
    async handleLogin() {
      try {
        this.$store.state.isLoading = true;
        const res = await AuthServices.login(
          this.account.username,
          this.account.password
        );
        if (res.success) {
          this.$store.commit("addToast", {
            type: "success",
            message: "Đăng nhập thành công !",
          });
          const accountInfor = res.data.data;
          if (accountInfor) {
            // set accessToken vaof localStorage
            localStorage.setItem("accessToken", accountInfor.accessToken);

            const role = accountInfor.account.role
              ? this.$_MisaEnums.LOGIN_ROLE.ADMIN
              : this.$_MisaEnums.LOGIN_ROLE.VOLUNTEER;

            this.$store.commit("updateLoginStatus", {
              accountRole: role,
              studentCode: accountInfor.account.studentCode,
              userName: accountInfor.account.name,
            });

            localStorage.setItem("accountRole", role);
            localStorage.setItem("userName", accountInfor.account.name);
            localStorage.setItem(
              "studentCode",
              accountInfor.account.studentCode
            );

            if (role === this.$_MisaEnums.LOGIN_ROLE.ADMIN) {
              // Chuyển sang trang admin
              this.$router.push("/admin");
            } else {
              // Chuyển sang trang volunteer
              this.$router.push("/volunteer");
            }
          }
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

<style lang="css">
@import "./log-in.css";
</style>
