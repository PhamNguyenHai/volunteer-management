<template lang="">
  <div class="main-content-header">
    <h3 class="main-content-heading">SINH VIÊN</h3>
  </div>
  <div class="main-content-center">
    <div class="main-content-functions">
      <!-- <div class="content-left-functions" v-if="isAtLeastOneRowSelected">
        <span>
          Đã chọn
          <b class="selected-row-number"> {{ selectedRowIds.length }} </b>
        </span>
        <span class="unselectd-all">Bỏ chọn</span>
        <misa-button
          buttonName="Xóa tất cả"
          buttonClass="delete-button primary-button"
        />
      </div> -->

      <div class="content-right-functions">
        <misa-text-field
          textFieldClass="searching-function text-field"
          placeholder="Tìm kiếm theo tên sinh viên"
          v-model="filterParams.search"
        />
        <misa-button
          buttonClass="refresh-function"
          buttonTooltips="Nạp lại dữ liệu"
          @click.stop="loadStudents"
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
      @notifyTableCheckboxChanged="handleChangedTableCheckbox"
      @notifySortColumnClicked="handleSortColumn"
    />
  </div>

  <div class="main-content-footer">
    <span class="record-display-number"
      >{{ $_MisaResources.appText.totalCount }}
      <b class="records-number">{{ this.totalRecords }}</b>
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
</template>
<script>
import studentService from "@/js/services/student/studentService.js";
import studentResources from "@/js/resources/studentResources.js";
export default {
  name: "AdminStudentManagementPage",

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
    this.tableColumns = studentResources;
    await this.loadStudents();
  },

  watch: {
    /**
     * Author: PNNHai
     * Date:
     * Description: Theo dõi filterParams nếu có thay đổi thì gọi lại hàm getInterviews()
     */
    filterParams: {
      handler: function () {
        this.loadStudents();
      },
      deep: true,
    },
  },

  methods: {
    async getAllStudents() {
      try {
        this.$store.state.isLoading = true;
        const res = await studentService.getAll_Admin(this.filterParams);
        return res;
      } catch (error) {
        console.log(error);
      } finally {
        this.$store.state.isLoading = false;
      }
    },

    async loadStudents() {
      try {
        const res = await this.getAllStudents();

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
        this.selectedRowIds = rowIdSelecteds;
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
  },
};
</script>
<style lang="css" scoped>
@import "./admin-student-management.css";
</style>
