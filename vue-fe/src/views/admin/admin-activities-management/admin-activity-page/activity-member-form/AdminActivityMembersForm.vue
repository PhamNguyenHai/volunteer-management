<template lang="">
  <div class="activity-members-overlay">
    <div class="activity-members-area">
      <h2 class="activity-members-heading">Thành viên hoạt động</h2>

      <div class="activity-infor">
        <div class="activity-infor-left">
          <span class="activity-code">
            Mã họat động: {{ activityInfor.activityCode }}
          </span>
          <span class="activity-name">
            Tên hoạt động: {{ activityInfor.activityName }}
          </span>
          <span class="activity-begining-date">
            Ngày bắt đầu: {{ activityInfor.beginingDate }}
          </span>
        </div>
        <div class="activity-infor-right">
          <span class="activity-manager">
            Người quản lý: {{ activityInfor.manager }}
          </span>
          <span class="activity-support-money">
            Kinh phí hỗ trợ: {{ activityInfor.supportMoney }}
          </span>
          <span class="activity-description">
            Mô tả: {{ activityInfor.description }}
          </span>
        </div>
      </div>
      <h3>Số lượng thành viên tham gia: {{ inActivityMembersNumber }}</h3>
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
          @click.stop="handleCloseActivityMembersForm"
        />
        <misa-button
          buttonName="Lưu thành viên"
          buttonClass="button primary-button"
          @click.stop="handleSaveMembers"
        />
      </div>
    </div>
  </div>
</template>
<script>
import volunteerMembersActivityResources from "@/js/resources/volunteerMembersActivityResouces";
import activityService from "@/js/services/acitvity/activityServices";
import volunteerService from "@/js/services/volunteer/volunteerService";
import registerService from "@/js/services/register/registerService.js";
export default {
  name: "AdminActivityMembersForm",

  props: {
    activityInfor: { type: Object, required: true },
  },

  data() {
    return {
      tableColumns: {},
      tableData: [],
      tableRowSelectionType: this.$_MisaEnums.TABLE_TYPE.MANY_ROW_SELECTION,
      memberCodes: [],

      totalPage: 1,
      totalRecords: 0,

      filterParams: {
        page: 1,
        limit: 10,
        search: "",
        sort: "updatedAt",
        order: "desc",
      },

      inActivityMembersNumber: 0,
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
        this.loadVolunteerWithInActivity();
      },
      deep: true,
    },
  },

  async created() {
    this.tableColumns = volunteerMembersActivityResources;
    this.loadVolunteerWithInActivity();
  },

  methods: {
    handleCloseActivityMembersForm() {
      try {
        this.$emit("notifyCloseAdminActivityMembersForm");
      } catch (err) {
        console.error(err);
      }
    },

    async getVolunteers() {
      try {
        this.$store.state.isLoading = true;

        const res = await volunteerService.getAllVolunteers_Admin(
          this.filterParams
        );
        return res;
      } catch (err) {
        console.error(err);
      } finally {
        this.$store.state.isLoading = false;
      }
    },

    async getInActivityVolunteersByActivityId(activityId) {
      try {
        this.$store.state.isLoading = true;

        const res = await activityService.getMembersOfAnActivityById_Admin(
          activityId
        );
        return res;
      } catch (err) {
        console.error(err);
      } finally {
        this.$store.state.isLoading = false;
      }
    },

    async loadVolunteerWithInActivity() {
      try {
        const volunteersRes = await this.getVolunteers();
        if (volunteersRes.success) {
          const data = volunteersRes.data.data;
          let volunteers = data.listData;

          const inActivityVolunteersRes =
            await this.getInActivityVolunteersByActivityId(
              this.activityInfor.activityCode
            );
          if (inActivityVolunteersRes.success) {
            const inActivityVolunteersData = inActivityVolunteersRes.data.data;
            const inActivityVolunteers = inActivityVolunteersData.listData;

            this.inActivityMembersNumber = inActivityVolunteersData.totalCount;
            if (this.inActivityMembersNumber > 0) {
              volunteers = volunteers.map((volunteer) => {
                const volunteerSelected = inActivityVolunteers.find(
                  (obj) => obj.studentCode === volunteer.studentCode
                );
                if (volunteerSelected) {
                  return {
                    ...volunteer,
                    isSelected: true,
                  };
                } else {
                  return volunteer;
                }
              });
            }
          }

          this.tableData = volunteers;

          this.totalPage = Math.ceil(data.totalCount / this.filterParams.limit);
          this.totalRecords = data.totalCount;
        }
      } catch (err) {
        console.error(err);
      }
    },

    handleCheckboxChanged(selectedRowIds) {
      try {
        this.memberCodes = selectedRowIds;
      } catch (err) {
        console.error(err);
      }
    },

    handleSortColumn(sortParams) {
      try {
        this.filterParams.sort = sortParams.sortColumn;
        this.filterParams.order = sortParams.order;
      } catch (err) {
        console.error(err);
      }
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
        this.$store.state.isLoading = true;
        const res = await this.respondInterviewResult(studentId, {
          resultInterview,
        });
        if (res.success) {
          this.$store.commit("addToast", {
            type: "success",
            message: "Cập nhật thành công !",
          });
          await this.loadVolunteerWithInActivity();
          return res;
        }
      } catch (err) {
        console.error(err);
      } finally {
        this.$store.state.isLoading = false;
      }
    },

    async chooseMembersForActivity(activityId, memberCode) {
      try {
        this.$store.state.isLoading = true;
        const res = await activityService.chooseMembersForAnActivity_Admin(
          activityId,
          { studentCode: memberCode }
        );
        return res;
      } catch (err) {
        console.error(err);
      } finally {
        this.$store.state.isLoading = false;
      }
    },

    async handleSaveMembers() {
      try {
        const res = await this.chooseMembersForActivity(
          this.activityInfor.activityCode,
          this.memberCodes
        );
        if (res.success) {
          this.$store.commit("addToast", {
            type: "success",
            message: "Cập nhật thành viên thành công !",
          });
          this.loadVolunteerWithInActivity();
          this.$emit("notifyChangedMembersOfActivity");
        }
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>
<style lang="css" scoped>
@import "./admin-activity-members-form.css";
</style>
