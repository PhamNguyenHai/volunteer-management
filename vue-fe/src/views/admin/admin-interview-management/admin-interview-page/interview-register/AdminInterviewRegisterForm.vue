<template lang="">
  <div class="interview-register-overlay">
    <div class="interview-register-area">
      <h2 class="interview-register-heading">Thông tin đơn đăng ký</h2>

      <div class="interview-infor">
        <span class="interview-code">
          Mã phỏng vấn: {{ interviewInfor.interviewCode }}
        </span>
        <span class="interview-name">
          Ngày phỏng vấn: {{ interviewInfor.interviewDate }}
        </span>
        <span class="interview-class">
          Phòng phỏng vấn: {{ interviewInfor.interviewRoom }}
        </span>
      </div>

      <misa-table
        :tableColumns="tableColumns"
        :tableData="tableData"
        :tableSelectionType="tableRowSelectionType"
        @notifyTableCheckboxChanged="handleCheckboxChanged"
        @notifySortColumnClicked="handleSortColumn"
        @notifyResponsedInterviewResult="handleResponsedInterviewResult"
      />

      <div class="main-content-footer">
        <span class="record-display-number"
          >{{ $_MisaResources.appText.totalCount }}
          <b class="records-number">{{ this.totalRecords }}</b>
          đơn đăng ký
        </span>
        <div class="paging-navigation-area">
          <select class="record-number-chooser" v-model="filterParams.limit">
            <option value="5">5 bản ghi / trang</option>
            <option value="10">10 bản ghi / trang</option>
            <option value="20">20 bản ghi / trang</option>
            <option value="30">30 bản ghi / trang</option>
          </select>

          <misa-paging-navigation
            v-model:currentPage="filterParams.page"
            :pageSize="filterParams.limit"
            :totalPage="totalPage"
          />
        </div>
      </div>

      <div class="interview-register-footer">
        <misa-button
          buttonName="Hủy"
          buttonClass="button normal-button"
          @click.stop="handleCloseInterviewRegisterForm"
        />
        <misa-button
          buttonName="Lưu"
          buttonClass="button primary-button"
          @click.stop="applyInterview"
        />
      </div>
    </div>
  </div>
</template>
<script>
import interviewApplyedStudent from "@/js/resources/interviewApplyedStudent";
import registerService from "@/js/services/register/registerService.js";
export default {
  name: "AdminInterviewsRegisterForm",

  props: {
    interviewInfor: { type: Object, required: true },
  },

  data() {
    return {
      tableColumns: {},
      tableData: [],
      tableRowSelectionType: this.$_MisaEnums.TABLE_TYPE.CUSTOM,
      interviewApplyInfor: {
        studentCode: this.interviewInfor.interviewCode,
      },

      totalPage: 1,
      totalRecords: 0,

      filterParams: {
        page: 1,
        limit: 10,
        search: "",
        sort: "updatedAt",
        order: "desc",
      },
    };
  },

  watch: {
    /**
     * Author: PNNHai
     * Date:
     * Description: Theo dõi filterParams nếu có thay đổi thì gọi lại hàm getInterviews()
     */
    filterParams: {
      handler: function () {
        this.loadStudentsApplyed();
      },
      deep: true,
    },
  },

  async created() {
    this.tableColumns = interviewApplyedStudent;
    this.loadStudentsApplyed();
  },

  methods: {
    handleCloseInterviewRegisterForm() {
      try {
        this.$emit("notifyCloseAdminInterviewRegisterForm");
      } catch (err) {
        console.error(err);
      }
    },

    async getStudentsApplyed() {
      try {
        this.$store.state.isLoading = true;

        const res = await registerService.geStudentsApplyedByInterviewId_Admin(
          this.interviewInfor.interviewCode,
          this.filterParams
        );
        return res;
      } catch (err) {
        console.error(err);
      } finally {
        this.$store.state.isLoading = false;
      }
    },

    async loadStudentsApplyed() {
      try {
        const res = await this.getStudentsApplyed();
        if (res.success) {
          const data = res.data.data;
          this.tableData = data.listData;
          console.log(this.tableData);

          this.totalPage = Math.ceil(data.totalCount / this.filterParams.limit);
          this.totalRecords = data.totalCount;
        }
      } catch (error) {
        console.log(error);
      }
    },

    handleCheckboxChanged(selectedRowId) {
      try {
        console.log(" MA PV: ", selectedRowId);
        this.interviewApplyInfor.interviewCode = selectedRowId;
      } catch (err) {
        console.error(err);
      }
    },

    handleSortColumn(sortParams) {
      this.filterParams.sort = sortParams.sortColumn;
      this.filterParams.order = sortParams.order;
    },

    async respondInterviewResult(studentId, { resultInterview }) {
      try {
        this.$store.state.isLoading = true;

        const res = await registerService.updateInterviewResult_Admin(
          studentId,
          { resultInterview }
        );
        return res;
      } catch (err) {
        console.error(err);
      } finally {
        this.$store.state.isLoading = false;
      }
    },

    async handleResponsedInterviewResult(studentId, resultInterview) {
      try {
        const res = await this.respondInterviewResult(studentId, {
          resultInterview,
        });
        if (res.success) {
          alert("Cập nhật thành công !");
          await this.loadStudentsApplyed();
          return res;
        }
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>
<style lang="css" scoped>
@import "./admin-interview-register.css";
</style>
