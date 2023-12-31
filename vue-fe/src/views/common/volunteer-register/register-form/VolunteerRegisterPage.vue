<template lang="">
  <div class="register-area">
    <form action="" class="register-form">
      <h3 class="register-form-heading">ĐĂNG KÝ PHỎNG VẤN</h3>
      <div class="register-infor">
        <misa-text-field
          label="Mã SV"
          fieldClass="register-field"
          textFieldId="username"
          textFieldClass="size-xl"
          v-model="studentInforChecking.studentCode"
        />
        <misa-text-field
          label="Họ và tên"
          fieldClass="register-field"
          textFieldId="username"
          textFieldClass="size-xl"
          v-model="studentInforChecking.studentName"
        />
        <misa-text-field
          label="Lớp"
          fieldClass="register-field"
          textFieldId="username"
          textFieldClass="size-xl"
          v-model="studentInforChecking.className"
        />
      </div>

      <div class="register-form-footer">
        <misa-button
          buttonName="Kiểm tra"
          buttonClass="button primary-button"
          @click.stop="handleCheckStudentInfor"
        />
      </div>
    </form>
  </div>

  <interviews-register
    v-if="isShowInterviewRegisterForm"
    :studentInfor="studentInforChecking"
    @notifyCloseInterviewRegisterForm="handleCloseInterviewRegisterForm"
  />
</template>
<script>
import InterviewsRegister from "../interviews-register/InterviewsRegister.vue";
import StudentService from "@/js/services/student/studentService.js";
export default {
  name: "VolunteerRegisterPage",
  components: {
    InterviewsRegister,
  },

  data() {
    return {
      // show form đăng ký nếu tên thỏa mã
      isShowInterviewRegisterForm: false,

      // Thông tin sinh viên cần check
      studentInforChecking: {
        studentCode: null,
        studentName: null,
        className: null,
      },
    };
  },

  methods: {
    async checkStudentInfor({ studentCode, studentName, className }) {
      try {
        const res = await StudentService.search({
          studentCode,
          studentName,
          className,
        });
        return res;
      } catch (err) {
        console.error(err);
      }
    },

    handleCloseInterviewRegisterForm() {
      try {
        this.isShowInterviewRegisterForm = false;
      } catch (err) {
        console.error(err);
      }
    },

    async handleCheckStudentInfor() {
      try {
        const res = await this.checkStudentInfor(this.studentInforChecking);
        if (res?.success) {
          this.isShowInterviewRegisterForm = true;
        }
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>
<style lang="css">
@import "./volunteer-register.css";
</style>
