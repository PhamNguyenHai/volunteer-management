<template lang="">
  <div class="main-content-header">
    <h3 class="main-content-heading">HOẠT ĐỘNG</h3>
  </div>
  <div class="main-content-center">
    <div class="main-content-functions">
      <div class="content-right-functions">
        <misa-text-field
          textFieldClass="searching-function text-field"
          placeholder="Tìm kiếm theo code..."
          v-model="filterParams.search"
        />
        <misa-button
          buttonClass="refresh-function"
          buttonTooltips="Nạp lại dữ liệu"
          @click.stop="loadActivities"
        />
        <div class="excel-area">
          <misa-button buttonClass="excel-function" />
          <ul class="excel-option">
            <li class="excel-item">Nhập khẩu bản ghi</li>
            <li class="excel-item">Xuất khẩu tất cả bản ghi</li>
            <li class="excel-item">Xuất khẩu bản ghi đã chọn</li>
          </ul>
        </div>
      </div>
    </div>

    <misa-table
      :tableColumns="tableColumns"
      :tableData="tableData"
      :tableSelectionType="tableRowSelectionType"
      :showRowHyperlink="showRowHyperlink"
      @notifyClickedHyperLink="handleClickedRating"
      @notifySortColumnClicked="handleSortColumn"
    />
  </div>

  <div class="main-content-footer">
    <span class="record-display-number"
      >{{ $_MisaResources.appText.totalCount }}
      <b class="records-number">{{ totalRecords }}</b>
      {{ $_MisaResources.appText.records }}
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
        :pageSize="parseInt(filterParams.limit)"
        :totalPage="totalPage"
      />
    </div>
  </div>

  <misa-dialog
    v-if="dialog.isShow"
    :dialogType="dialog.type"
    :dialogText="dialog.text"
    :numberOfButton="dialog.numberOfButton"
    @notifyCloseDialog="handleCloseDialog"
    @notifyDialogResponded="handleDialogResponded"
  />

  <volunteer-rating-form
    v-if="ratingInfor.isShow"
    :activityInfor="ratingInfor.activityInfor"
    @notifyCloseRatingForm="handleCloseRatingForm"
  />
</template>
<script>
import volunteerActivityResources from "@/js/resources/volunteerActivityResources";
import activityService from "@/js/services/acitvity/activityServices.js";
import VolunteerRatingForm from "../activity-rating/VolunteerRatingForm.vue";

export default {
  name: "VolunteerActivitiesPage",
  components: {
    VolunteerRatingForm,
  },

  data() {
    return {
      // Column các cột của table. Đc gán vào từ TableResources
      tableColumns: {},

      // Dữ liệu của bảng sẽ được đọc từ API về và gán vào
      tableData: [],

      showRowHyperlink: {
        title: "Đánh giá",
        hyperlinkName: "Đánh giá",
      },

      loginStudentCode: this.$store.state.loginStatus.loginedStudentCode,

      tableRowSelectionType: this.$_MisaEnums.TABLE_TYPE.MANY_ROW_SELECTION,

      totalPage: 1,
      totalRecords: 0,

      form: {
        isShow: false,
        formMode: null,
        activityInfor: {},
      },

      filterParams: {
        page: 1,
        limit: 10,
        search: "",
        sort: "updatedAt",
        order: "desc",
      },

      dialog: {
        isShow: false,
        type: null,
        text: null,
        numberOfButton: null,
      },

      ratingInfor: {
        isShow: false,
        activityInfor: null,
      },
    };
  },

  async created() {
    try {
      this.tableColumns = volunteerActivityResources;
      await this.loadActivities();
    } catch (error) {
      console.error(error);
    }
  },

  watch: {
    /**
     * Author: PNNHai
     * Date:
     * Description: Theo dõi filterParams nếu có thay đổi thì gọi lại hàm getInterviews()
     */
    filterParams: {
      handler: function () {
        try {
          this.loadActivities();
        } catch (error) {
          console.log(error);
        }
      },
      deep: true,
    },
  },

  methods: {
    // Ẩn form
    handleHideForm() {
      try {
        this.form.isShow = false;
      } catch (error) {
        console.error(error);
      }
    },

    // xử lý show form
    handleShowForm(activity) {
      try {
        this.form.activityInfor = activity;
        this.form.isShow = true;
      } catch (error) {
        console.error(error);
      }
    },

    async getActivities() {
      try {
        this.$store.state.isLoading = true;
        const res = await activityService.getActivitiesByStudentId_Volunteer(
          this.loginStudentCode,
          this.filterParams
        );
        return res;
      } catch (error) {
        console.error(error);
      } finally {
        this.$store.state.isLoading = false;
      }
    },

    async loadActivities() {
      try {
        const res = await this.getActivities();
        if (res?.success) {
          const data = res.data.data;

          this.tableData = data.listData;
          this.totalPage = Math.ceil(data.totalCount / this.filterParams.limit);
          this.totalRecords = data.totalCount;
        }
      } catch (err) {
        console.error(err);
      }
    },

    handleSortColumn(sortParams) {
      try {
        this.filterParams.sort = sortParams.sortColumn;
        this.filterParams.order = sortParams.order;
      } catch (error) {
        console.error(error);
      }
    },

    /**
     * Author: PNNHai
     * Date:
     * @param {*} responseStatus : Trạng thái phản hồi của dialog ( NO(0) / YES(1) )
     * Description: Hàm xử lý khi nhận tín hiệu dialog đã được phản hồi
     * +/ Nếu dialog phản hồi với trường hợp xóa nhiều -> chuyển sang thực hiện với xóa nhiều
     * +/ Nếu dialog phản hồi với trường hợp xóa 1 -> chuyển sang thực hiện với xóa 1
     */
    async handleDialogResponded(responseStatus) {
      try {
        if (this.confirmAction === this.$_MisaEnums.CONFIRM_ACTION.DELETE) {
          await this.handleConfirmDelete(responseStatus);
        } else if (
          this.confirmAction === this.$_MisaEnums.CONFIRM_ACTION.DELETE_MANY
        ) {
          await this.handleConfirmDeleteMany(responseStatus);
        }

        // Close dialog
        this.handleCloseDialog();
      } catch (err) {
        console.error(err);
      }
    },

    async deleteActivity(activityId) {
      try {
        console.error(this.formData);

        this.$store.state.isLoading = true;
        const res = await activityService.delete_Admin(activityId);

        return res;
      } catch (error) {
        console.error(error);
      } finally {
        this.$store.state.isLoading = false;
      }
    },

    /**
     * Author: PNNHai
     * Date:
     * @param {*} response : Trạng thái phản hồi của dialog ( NO(0) / YES(1) )
     * Description: Hàm xử lý xác nhận xóa 1
     * Nếu response = YES -> Xóa + load lại dl + addToast
     */
    async handleConfirmDelete(response) {
      try {
        if (response === this.$_MisaEnums.DIALOG_RESPONSE.YES) {
          const res = await this.deleteActivity(this.activityIdToDelete);
          if (res.success) {
            this.$store.commit("addToast", {
              type: "success",
              message: "Xóa thành công 1 bản ghi",
            });
          }
        }
        this.activityIdToDelete = null;
      } catch (error) {
        console.error(error);
      }
    },

    handleCloseDialog() {
      try {
        this.dialog.isShow = false;
      } catch (error) {
        console.error(error);
      }
    },

    async handleSubmittedForm(submitMode) {
      try {
        await this.loadActivities();
        if (submitMode === this.$_MisaEnums.FORM_SUBMIT_MODE.SAVE) {
          this.handleHideForm();
        }
      } catch (error) {
        console.error(error);
      }
    },

    handleClickedRating(ratingInfor) {
      try {
        if (!ratingInfor.ratingCode) {
          this.ratingInfor.isShow = true;
          this.ratingInfor.activityInfor = ratingInfor;
        } else {
          this.$store.state.dialogNotify.isShow = true;
          this.$store.state.dialogNotify.text =
            "Bạn đã đánh giá họat động này rồi !";
        }
      } catch (err) {
        console.error(err);
      }
    },

    handleCloseRatingForm() {
      try {
        this.ratingInfor.isShow = false;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
<style lang="css" scoped>
@import "./volunteer-activities.css";
</style>
