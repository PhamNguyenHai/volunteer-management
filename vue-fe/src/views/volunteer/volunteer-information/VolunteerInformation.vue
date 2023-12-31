<template lang="">
  <div class="user-infor-area"></div>
  <div class="user-infor">
    <h2 class="user-infor-heading">Thẻ sinh viên điện tử</h2>
    <div class="user-combo">
      <div class="user-avatar-icon"></div>
      <div class="user-informain">
        <div class="item-group">
          <h3 class="student-code infor-item">Mã SV:</h3>
          <span>{{ studentInfor?.StudentCode }}</span>
        </div>
        <div class="item-group">
          <h3 class="student-name infor-item">Họ tên:</h3>
          <span>{{ studentInfor?.StudentName }}</span>
        </div>
        <div class="item-group">
          <h3 class="class-name infor-item">Lớp:</h3>
          <span>{{ studentInfor?.ClassName }}</span>
        </div>
        <div class="item-group">
          <h3 class="phone-number infor-item">SĐT:</h3>
          <span>{{ studentInfor?.PhoneNumber }}</span>
        </div>
        <div class="item-group">
          <h3 class="email infor-item">Email:</h3>
          <span>{{ studentInfor?.Email }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import studentService from "@/js/services/student/studentService";
export default {
  name: "VolunteerInformation",

  data() {
    return {
      studentInfor: {
        StudentCode: "",
        StudentName: "",
        ClassName: "",
        PhoneNumber: "",
        Email: "",
      },

      studentCode: this.$store.state.loginStatus.loginedStudentCode,
    };
  },

  async created() {
    try {
      this.studentInfor = await this.getStudentInfor();
    } catch (err) {
      console.error(err);
    }
  },

  methods: {
    async getStudentInfor() {
      try {
        this.$store.state.isLoading = true;
        console.log(this.studentCode);
        const res = await studentService.getById(this.studentCode);
        console.log(res.data.data);
        return res.data.data;
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
@import "./volunteer-information.css";
</style>
