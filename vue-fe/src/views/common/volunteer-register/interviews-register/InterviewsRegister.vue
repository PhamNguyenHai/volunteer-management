<template lang="">
  <div class="interview-register-overlay">
    <div class="interview-register-area">
      <h2 class="interview-register-heading">Thông tin đăng ký phỏng vấn</h2>

      <div class="student-infor">
        <span class="student-code">Mã SV: {{ studentInfor.studentCode }}</span>
        <span class="student-name">Họ Tên: {{ studentInfor.studentName }}</span>
        <span class="student-class">Lớp: {{ studentInfor.className }}</span>
      </div>

      <misa-table
        :tableColumns="tableColumns"
        :tableData="tableData"
        :tableSelectionType="tableRowSelectionType"
        @notifyTableCheckboxChanged="handleCheckboxChanged"
        @notifySortColumnClicked="handleSortColumn"
      />

      <div class="main-content-footer">
        <span class="record-display-number"
          >{{ $_MisaResources.appText.totalCount }}
          <b class="records-number">{{ this.totalRecords }}</b>
          cuộc phỏng vấn
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
          buttonName="Gửi yêu cầu"
          buttonClass="button primary-button"
          @click.stop="applyInterview"
        />
      </div>
    </div>
  </div>
</template>
<script>
import interviewRegisterResources from "@/js/resources/interviewRegisterResources";
import interviewService from "@/js/services/interview/interviewService.js";
import registerService from "@/js/services/register/registerService.js";
export default {
  name: "InterviewsRegister",

  props: {
    studentInfor: { type: Object, required: true },
  },

  data() {
    return {
      tableColumns: {},
      tableData: [],
      tableRowSelectionType: this.$_MisaEnums.TABLE_TYPE.ONE_ROW_SELECTION,
      interviewApplyInfor: {
        studentCode: this.studentInfor.studentCode,
        interviewCode: null,
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
        this.loadInterviewForApply();
      },
      deep: true,
    },
  },

  async created() {
    this.tableColumns = interviewRegisterResources;
    this.loadInterviewForApply();
  },

  methods: {
    handleCloseInterviewRegisterForm() {
      try {
        this.$emit("notifyCloseInterviewRegisterForm");
      } catch (err) {
        console.error(err);
      }
    },

    async getInterviews() {
      try {
        this.$store.state.isLoading = true;

        const res = await interviewService.get_Anonymous(this.filterParams);
        return res;
      } catch (err) {
        console.error(err);
      } finally {
        this.$store.state.isLoading = false;
      }
    },

    async loadInterviewForApply() {
      try {
        const res = await this.getInterviews();
        if (res.success) {
          const data = res.data.data;
          console.log(data.listData);
          this.tableData = data.listData;

          this.totalPage = Math.ceil(data.totalCount / this.filterParams.limit);
          this.totalRecords = data.totalCount;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async applyInterview() {
      try {
        this.$store.state.isLoading = true;
        const res = await registerService.applyForAnInterview(
          this.interviewApplyInfor
        );

        if (res?.success) {
          this.$store.commit("addToast", {
            type: "success",
            message: "Apply thành công !!!",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        this.$store.state.isLoading = false;
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
      try {
        this.filterParams.sort = sortParams.sortColumn;
        this.filterParams.order = sortParams.order;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
<style lang="css">
@import "./interview-register.css";
</style>
