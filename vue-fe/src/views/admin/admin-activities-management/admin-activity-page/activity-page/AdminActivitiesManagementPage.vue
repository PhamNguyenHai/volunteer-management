<template lang="">
  <div class="main-content-header">
    <h3 class="main-content-heading">HOẠT ĐỘNG</h3>
    <misa-button
      buttonName="Thêm hoạt động"
      buttonClass="add-button primary-button"
      @click.stop="onClickAddActivity"
    />
  </div>
  <div class="main-content-center">
    <div class="main-content-functions">
      <div class="content-left-functions" v-if="isAtLeastOneRowSelected">
        <span>
          Đã chọn:
          <b class="selected-row-number"> {{ selectedRowIds.length }} </b>
        </span>
        <span class="unselectd-all">Bỏ chọn</span>
        <misa-button
          buttonName="Xóa tất cả"
          buttonClass="delete-button primary-button"
          @click.stop="onClickDeleteMany"
        />
      </div>

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
          <misa-button
            buttonClass="excel-function"
            @click.stop="handleExportActivity"
          />
        </div>
      </div>
    </div>

    <misa-table
      :tableColumns="tableColumns"
      :tableData="tableData"
      :tableSelectionType="tableRowSelectionType"
      :isShowRowFunction="true"
      :showRowHyperlink="showRowHyperlink"
      :hiddenFunction="isShowRatingInfor"
      @notifyWorkWithRecord="handleWorkWithRow"
      @notifyTableCheckboxChanged="handleChangedTableCheckbox"
      @notifyClickedHyperLink="handleClickedHyperlink"
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

  <admin-activity-form
    v-if="form.isShow"
    :formDataType="form.formMode"
    :activityInfor="form.activityInfor"
    @notifySubmittedForm="handleSubmittedForm"
    @notifyHideForm="handleHideForm"
  />

  <admin-activity-members-form
    :activityInfor="activityInforHyperLink"
    v-if="isShowActivityMembersForm"
    @notifyCloseAdminActivityMembersForm="handleCloseAdminActivityMembersForm"
    @notifyChangedMembersOfActivity="loadActivities"
  />

  <admin-activity-rating-infor-form
    v-if="isShowRatingInfor.isShow"
    :activityInfor="activityInforRating"
    @notifyCloseAdminRatingInfor="handleCloseAdminRatingInfor"
  />

  <misa-dialog
    v-if="dialog.isShow"
    :dialogType="dialog.type"
    :dialogText="dialog.text"
    :numberOfButton="dialog.numberOfButton"
    @notifyCloseDialog="handleCloseDialog"
    @notifyDialogResponded="handleDialogResponded"
  />
</template>
<script>
import activityResources from "@/js/resources/activityResources.js";
import activityService from "@/js/services/acitvity/activityServices.js";
import AdminActivityForm from "@/views/admin/admin-activities-management/admin-activity-form/AdminActivityForm.vue";
import AdminActivityMembersForm from "../activity-member-form/AdminActivityMembersForm.vue";
import AdminActivityRatingInforForm from "@/views/admin/admin-activities-management/admin-activity-page/activity-rating-infor/ActivityRatingInfor.vue";

export default {
  name: "AdminActivitiesManagementPage",
  components: {
    AdminActivityForm,
    AdminActivityMembersForm,
    AdminActivityRatingInforForm,
  },

  data() {
    return {
      // Column các cột của table. Đc gán vào từ TableResources
      tableColumns: {},

      // Dữ liệu của bảng sẽ được đọc từ API về và gán vào
      tableData: [],

      showRowHyperlink: {
        title: "Thành viên tham gia",
        hyperlinkName: "Xem thành viên",
      },

      tableRowSelectionType: this.$_MisaEnums.TABLE_TYPE.MANY_ROW_SELECTION,

      selectedRowIds: [],

      activityIdToDelete: null,

      totalPage: 1,
      totalRecords: 0,

      isShowActivityMembersForm: false,
      activityInforHyperLink: {},

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

      isShowRatingInfor: {
        isShow: false,
        title: "Xem đánh giá",
      },

      activityInforRating: {},
    };
  },

  computed: {
    /**
     * Author : PNNHai
     * Date :
     * Description : Kiểm tra có ít nhất một bản ghi được chọn không
     * Nếu có thì hiển thị thao tác hàng loạt còn không thì bị ẩn
     */
    isAtLeastOneRowSelected() {
      return this.selectedRowIds.length >= 1;
    },
  },

  async created() {
    try {
      this.tableColumns = activityResources;
      await this.loadActivities();
    } catch (error) {
      console.log(error);
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
        this.loadActivities();
      },
      deep: true,
    },
  },

  methods: {
    handleCloseAdminRatingInfor() {
      this.isShowRatingInfor.isShow = false;
    },
    handleCloseAdminActivityMembersForm() {
      this.isShowActivityMembersForm = false;
    },
    // Ẩn form
    handleHideForm() {
      try {
        this.form.isShow = false;
      } catch (error) {
        console.log(error);
      }
    },

    // xử lý show form
    handleShowForm(activity) {
      try {
        this.form.activityInfor = activity;
        this.form.isShow = true;
      } catch (error) {
        console.log(error);
      }
    },

    // show form
    onClickAddActivity() {
      try {
        this.form.formMode = this.$_MisaEnums.FORM_MODE.ADD;
        this.handleShowForm(null);
      } catch (err) {
        console.error(err);
      }
    },

    /**
     * @param {Number} rowFunctionType : loại chức năng muốn thực hiện
     * +/ rowFunctionType = EDIT => gán formMode = EDIT + showForm với id là rowId
     * +/ rowFunctionType = DUPLICATE => gán formMode = DUPLICATE + showForm
     * +/ rowFunctionType = DELETE => thực hiện xóa với id là id của dòng đang tương tác
     *
     * @param {String(Guid)} rowId : Id của dòng đang thực hiện
     *
     * Description: Hàm để xử lý làm việc với bản ghi (edit, duplicate, delete)
     */
    async handleWorkWithRow(rowFunctionType, row) {
      try {
        // Trường hợp cập nhật bản ghi
        switch (rowFunctionType) {
          case this.$_MisaEnums.ROW_MODE.EDIT:
            this.form.formMode = this.$_MisaEnums.FORM_MODE.EDIT;
            this.handleShowForm(row);
            break;
          case this.$_MisaEnums.ROW_MODE.DUPLICATE: {
            this.form.formMode = this.$_MisaEnums.FORM_MODE.DUPLICATE;
            this.handleShowForm(row);
            break;
          }
          case this.$_MisaEnums.ROW_MODE.DELETE:
            this.activityIdToDelete = row.activityCode;

            this.confirmAction = this.$_MisaEnums.CONFIRM_ACTION.DELETE;

            this.dialog.isShow = true;
            this.dialog.type = "warning";
            this.dialog.numberOfButton =
              this.$_MisaEnums.DIALOG_TYPE_BUTTON.TWO_BUTTONS;
            this.dialog.text = "Bạn có chắc chắn muốn xóa 1 hoạt động không ?";

            break;
          case this.$_MisaEnums.ROW_MODE.RATING:
            this.isShowRatingInfor.isShow = true;
            this.activityInforRating = row;
            break;
          default:
            alert("Có lỗi");
        }
      } catch (err) {
        console.error(err);
      }
    },

    onClickDeleteMany() {
      try {
        this.confirmAction = this.$_MisaEnums.CONFIRM_ACTION.DELETE_MANY;

        this.dialog.isShow = true;
        this.dialog.type = "warning";
        this.dialog.numberOfButton =
          this.$_MisaEnums.DIALOG_TYPE_BUTTON.TWO_BUTTONS;
        this.dialog.text = "Bạn có chắc chắn muốn xóa nhiều hoạt động không ?";
      } catch (err) {
        console.error(err);
      }
    },

    async getActivities() {
      try {
        this.$store.state.isLoading = true;
        const res = await activityService.getAll_Admin(this.filterParams);
        return res;
      } catch (error) {
        console.log(error);
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

    /**
     * Author : PNNHai
     * Date :
     * @param {Array[String(Guid)]} rowIdSelecteds : arr các id của phần tử đang được checked trong bảng
     * Description :Hàm xử lý khi nhận tín hiệu từ component table khi checkbox trong table thay đổi
     */
    handleChangedTableCheckbox(rowIdSelecteds) {
      try {
        this.selectedRowIds = rowIdSelecteds.map((rowId) => rowId.toString());
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
        this.$store.state.isLoading = true;
        const res = await activityService.delete_Admin(activityId);

        return res;
      } catch (error) {
        console.log(error);
      } finally {
        this.$store.state.isLoading = false;
      }
    },

    async deleteManyActivities(ids) {
      try {
        this.$store.state.isLoading = true;
        const res = await activityService.deleteMany_Admin(ids);

        return res;
      } catch (error) {
        console.log(error);
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

            this.loadActivities();
          }
        }
        this.activityIdToDelete = null;
      } catch (error) {
        console.log(error);
      }
    },

    async handleConfirmDeleteMany(response) {
      try {
        console.log(this.selectedRowIds);
        if (response === this.$_MisaEnums.DIALOG_RESPONSE.YES) {
          const res = await this.deleteManyActivities(this.selectedRowIds);
          if (res.success) {
            this.$store.commit("addToast", {
              type: "success",
              message: "Xóa thành công nhiều bản ghi",
            });

            this.loadActivities();
          }
        }
        this.selectedRowIds = [];
      } catch (error) {
        console.error(error);
      }
    },

    handleCloseDialog() {
      try {
        this.dialog.isShow = false;
      } catch (error) {
        console.log(error);
      }
    },

    async handleSubmittedForm(submitMode) {
      try {
        await this.loadActivities();
        if (submitMode === this.$_MisaEnums.FORM_SUBMIT_MODE.SAVE) {
          this.handleHideForm();
        }
      } catch (error) {
        console.log(error);
      }
    },

    handleClickedHyperlink(activityInfor) {
      try {
        this.isShowActivityMembersForm = true;
        this.activityInforHyperLink = activityInfor;
      } catch (error) {
        console.log(error);
      }
    },

    async handleExportActivity() {
      try {
        this.$store.state.isLoading = true;
        const res = await activityService.exportExcel_Admin();
        if (res.success) {
          const blob = new Blob([res.data], {
            type: "application/vnd.ms-excel",
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "file.xls");
          link.style.display = "none";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          this.$store.commit("addToast", {
            type: "success",
            message: "Xuất thành công họat động ra file excel !",
          });

          console.log(res);
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.$store.state.isLoading = false;
      }
    },
  },
};
</script>
<style lang="css" scoped>
@import "./admin-activities-management.css";
</style>
