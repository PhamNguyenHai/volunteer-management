<template lang="">
  <div class="main-content-header">
    <h3 class="main-content-heading">TÌNH NGUYỆN VIÊN</h3>
  </div>
  <div class="main-content-center">
    <div class="main-content-functions">
      <div class="content-left-functions" v-if="isAtLeastOneRowSelected">
        <span>
          Đã chọn
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
          placeholder="Tìm kiếm theo tên ..."
          v-model="filterParams.search"
        />
        <misa-button
          buttonClass="refresh-function"
          buttonTooltips="Nạp lại dữ liệu"
          @click.stop="loadVolunteersTable"
        />
        <div class="excel-area">
          <misa-button
            buttonClass="excel-function"
            @click.stop="handleExportVolunteers"
          />
        </div>
      </div>
    </div>

    <misa-table
      :tableColumns="tableColumns"
      :tableData="tableData"
      :tableSelectionType="tableRowSelectionType"
      @notifyTableCheckboxChanged="handleChangedTableCheckbox"
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
        :pageSize="filterParams.limit"
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
</template>
<script>
import volunteerResources from "@/js/resources/volunteerResources.js";
import volunteerService from "@/js/services/volunteer/volunteerService";
export default {
  name: "AdminVolunteerManagementPage",

  data() {
    return {
      // Column các cột của table. Đc gán vào từ TableResources
      tableColumns: {},

      // Dữ liệu của bảng sẽ được đọc từ API về và gán vào
      tableData: [],

      tableRowSelectionType: this.$_MisaEnums.TABLE_TYPE.MANY_ROW_SELECTION,

      selectedRowIds: [],

      totalPage: 1,
      totalRecords: 0,

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
    this.tableColumns = volunteerResources;
    await this.loadVolunteersTable();
  },

  watch: {
    /**
     * Author: PNNHai
     * Date:
     * Description: Theo dõi filterParams nếu có thay đổi thì gọi lại hàm getInterviews()
     */
    filterParams: {
      handler: function () {
        this.loadVolunteersTable();
      },
      deep: true,
    },
  },

  methods: {
    async getAllVolunteers() {
      try {
        this.$store.state.isLoading = true;
        const res = await volunteerService.getAllVolunteers_Admin(
          this.filterParams
        );
        return res;
      } catch (error) {
        console.log(error);
      } finally {
        this.$store.state.isLoading = false;
      }
    },

    async loadVolunteersTable() {
      try {
        const res = await this.getAllVolunteers();

        if (res?.success) {
          const data = res.data.data;
          this.tableData = data.listData;

          this.totalPage = Math.ceil(data.totalCount / this.filterParams.limit);
          this.totalRecords = data.totalCount;
        }
      } catch (error) {
        console.log(error);
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
      } catch (error) {
        console.log(error);
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

    onClickDeleteMany() {
      try {
        this.confirmAction = this.$_MisaEnums.CONFIRM_ACTION.DELETE_MANY;

        this.dialog.isShow = true;
        this.dialog.type = "warning";
        this.dialog.numberOfButton =
          this.$_MisaEnums.DIALOG_TYPE_BUTTON.TWO_BUTTONS;
        this.dialog.text = "Bạn có chắc chắn muốn xóa tình nguyện viên không ?";
      } catch (err) {
        console.error(err);
      }
    },

    async deleteManyVolunteers(ids) {
      try {
        this.$store.state.isLoading = true;
        const res = await volunteerService.deleteMany_Admin(ids);

        return res;
      } catch (error) {
        console.log(error);
      } finally {
        this.$store.state.isLoading = false;
      }
    },

    async handleConfirmDeleteMany(response) {
      try {
        console.log(this.selectedRowIds);
        if (response === this.$_MisaEnums.DIALOG_RESPONSE.YES) {
          const res = await this.deleteManyVolunteers(this.selectedRowIds);
          if (res.success) {
            this.$store.commit("addToast", {
              type: "success",
              message: "Xóa thành công nhiều bản ghi",
            });

            this.loadVolunteersTable();
          }
        }
        this.selectedRowIds = [];
      } catch (error) {
        console.error(error);
      }
    },

    async handleDialogResponded(responseStatus) {
      try {
        if (
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

    handleCloseDialog() {
      try {
        this.dialog.isShow = false;
      } catch (error) {
        console.log(error);
      }
    },

    async handleExportVolunteers() {
      try {
        this.$store.state.isLoading = true;
        const res = await volunteerService.exportExcel_Admin();
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
<style lang="css">
@import "./admin-volunteer-management.css";
</style>
