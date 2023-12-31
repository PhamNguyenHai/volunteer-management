<template lang="">
  <div class="main-content-table" v-if="rowsData.length > 0">
    <table>
      <thead>
        <tr>
          <th
            v-if="tableSelectionType === $_MisaEnums.TABLE_TYPE.CUSTOM"
            style="text-align: center"
          >
            Phản hồi
          </th>
          <th
            v-else-if="
              tableSelectionType === $_MisaEnums.TABLE_TYPE.MANY_ROW_SELECTION
            "
          >
            <misa-checkbox-field
              @change="onChangeTableCheckbox()"
              v-model="isSelectedAll"
            />
          </th>
          <th v-else>#</th>
          <th
            v-for="(header, index) in tableColumnData.resources"
            :key="index"
            :title="header?.tooltips"
            :style="{ width: header.width + 'px', 'text-align': header.align }"
            @click.stop="onClickColumnSort(header.columnKey)"
          >
            {{ header.title }}
            <div
              class="heading-icon"
              :class="{
                'arrow-z-a-sort': sortParams.order === 'desc',
                'arrow-a-z-sort': sortParams.order === 'asc',
              }"
              v-if="sortParams.sortColumn == header.columnKey"
            ></div>
          </th>
          <th v-if="showRowHyperlink">{{ showRowHyperlink.title }}</th>
          <th v-if="isShowRowFunction">
            {{ $_MisaResources.tableFunctions.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="tableRow in rowsData"
          :key="tableRow[tableColumnData.objectId]"
          @dblclick="
            handleNotifyWithRowFunction($_MisaEnums.ROW_MODE.EDIT, tableRow)
          "
        >
          <td>
            <div
              name="table-button-custom"
              v-if="tableSelectionType === $_MisaEnums.TABLE_TYPE.CUSTOM"
            >
              <div
                class="custom-result"
                v-if="tableRow.resultInterview !== null"
              >
                Đã phản hồi !
              </div>
              <div class="custom-result" v-else>
                <misa-button
                  buttonName="Pass"
                  buttonClass="button success-button"
                  @click.stop="
                    handleClickInterviewResult(tableRow.studentCode, true)
                  "
                />
                <misa-button
                  buttonName="Fail"
                  buttonClass="button delete-button"
                  @click.stop="
                    handleClickInterviewResult(tableRow.studentCode, false)
                  "
                />
              </div>
            </div>

            <misa-checkbox-field
              @change="
                onChangeTableCheckbox(tableRow[tableColumnData.objectId])
              "
              v-model="tableRow.isSelected"
              v-else-if="
                tableSelectionType === $_MisaEnums.TABLE_TYPE.MANY_ROW_SELECTION
              "
            />

            <misa-radio-field
              v-else
              @change="
                onChangeTableCheckbox(tableRow[tableColumnData.objectId])
              "
              radioFieldGroup="row-selection-field"
              :value="tableRow[tableColumnData.objectId]"
              v-model="tableRow.isSelected"
            />
          </td>
          <td
            v-for="(column, columnIndex) in tableColumnData.resources"
            :key="columnIndex"
          >
            {{
              column.formatType === undefined
                ? tableRow[column.columnKey]
                : formatData(column.formatType, tableRow[column.columnKey])
            }}
          </td>
          <slot name="hyperlink"></slot>
          <td
            v-if="showRowHyperlink"
            style="color: green"
            @click.stop="handleClickHyperlink(tableRow)"
          >
            {{ showRowHyperlink.hyperlinkName }}
          </td>
          <td v-if="isShowRowFunction">
            <div class="functions-area">
              <span
                class="function-name"
                @click.stop="
                  handleNotifyWithRowFunction(
                    $_MisaEnums.ROW_MODE.EDIT,
                    tableRow
                  )
                "
                >{{ $_MisaResources.tableFunctions.edit }}</span
              >
              <div
                :class="{
                  'drop-icon': true,
                  'drop-icon-active': functionalRow === tableRow,
                }"
                @click.stop="onClickDropFunctionIcon(tableRow, $event)"
              ></div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="empty-data" v-else>
    <img
      src="../../../assets/img/empty_data_icon.png"
      :alt="$_MisaResources.appText.emptyDataImage"
    />
  </div>

  <div class="drop-list-function" v-if="functionalRow" :style="styleToolEdit">
    <div
      class="function-item"
      @click.stop="
        handleNotifyWithRowFunction(
          $_MisaEnums.ROW_MODE.DUPLICATE,
          functionalRow
        )
      "
    >
      {{ $_MisaResources.tableFunctions.duplicate }}
    </div>

    <div
      class="function-item"
      v-if="functionalRow?.deletedAt"
      @click.stop="
        handleNotifyWithRowFunction($_MisaEnums.ROW_MODE.REUSING, functionalRow)
      "
    >
      Khôi phục
    </div>

    <div
      class="function-item"
      @click.stop="
        handleNotifyWithRowFunction($_MisaEnums.ROW_MODE.DELETE, functionalRow)
      "
      v-else
    >
      {{ $_MisaResources.tableFunctions.delete }}
    </div>

    <div
      class="function-item"
      v-if="hiddenFunction"
      @click.stop="
        handleNotifyWithRowFunction($_MisaEnums.ROW_MODE.RATING, functionalRow)
      "
    >
      {{ hiddenFunction.title }}
    </div>
  </div>
</template>
<script>
import {
  convertDateForFE,
  convertGender,
  converSoftDeleteStatus,
  converStudentVolunteerStatus,
  converInterviewReponsedResult,
  converRated,
} from "@/js/helpers/convert-data.js";
import { filterColumnResources } from "@/js/helpers/filterColumnResources";

export default {
  name: "MisaTable",

  props: {
    // để hiển thị chức năng ở các dòng
    isShowRowFunction: { type: Boolean, default: false },

    // loại lựa chọn cho table
    tableSelectionType: {
      type: Number,
      required: true,
    },

    // các heading cho table
    // Component sử dụng : EmployeePage
    tableColumns: { type: Object },

    // data cho table
    // Component sử dụng : EmployeePage
    tableData: { type: Array },

    showRowHyperlink: { type: Object, default: null },

    hiddenFunction: { type: Object, default: null },
  },

  emits: [
    "notifyTableCheckboxChanged",
    "notifyWorkWithRecord",
    "notifySortColumnClicked",
    "notifyClickedHyperLink",
    "notifyResponsedInterviewResult",
  ],

  data() {
    return {
      styleToolEdit: {
        left: 9,
        top: 0,
      },

      // Biến để hứng dữ liệu từ prop tableData truyền vào
      rowsData: [],

      // Biến để hứng column data từ prop truyền vào
      // tableColumnData: {},

      // Hiển thị pop-up để filter hay không ?
      filterColumnPopup: {
        columnName: null,
        isShow: false,
      },

      // Biến đánh dấu là tất cả các dòng checked hay không
      isSelectedAll: false,

      // Dòng đang được chọn hiển thị danh sách các chức năng
      functionalRow: null,

      // params để phục vụ cho việc sort data trong bảng
      sortParams: {
        sortColumn: "", // Cột thực hiện sort
        order: "desc", // Loại sort (null: none | tăng dần (false) |giảm dần (true))
      },

      filterResources: filterColumnResources,
    };
  },

  created() {
    this.rowsData = this.tableData;
  },

  watch: {
    // Update tableData từ props truyền vào và thêm
    // key isSelected để v-model giá trị true/false ứng với checked hay không
    tableData: function () {
      if (this.tableData) {
        this.rowsData = this.tableData.map((rowData) => {
          if (rowData?.isSelected) {
            return { ...rowData };
          } else {
            return {
              ...rowData,
              isSelected: false,
            };
          }
        });
      }
      this.functionalRow = null;
    },
  },

  computed: {
    /**
     * Author : PNNHai
     * Date :
     * Description : Hàm để ktra xem tất cả các dòng đã checked hết hay không
     */
    isAllRowsSelected() {
      return (
        this.rowsData.length > 0 && this.rowsData.every((row) => row.isSelected)
      );
    },

    /**
     * Author : PNNHai
     * Date :
     * Description : Hàm để trả về mảng các id của các dòng đã được chọn
     */
    getRowIdSelecteds() {
      // Từ mảng các phần tử lấy ra các phần tử checked
      const selectedRowsData = this.rowsData.filter((row) => {
        return row.isSelected === true;
      });

      //Từ mảng đã checked lấy ra các id từ đó
      const selectedRowIds = selectedRowsData.map((row) => {
        // trong tableColumn lấy từ resource. Obj resource có chứa key objectId lưu trữ trường để lấy id
        return row[this.tableColumnData.objectId];
      });

      return selectedRowIds;
    },

    /**
     * Author: PNNHai
     * Date:
     * Description: Thực hiện hứng dữ liệu từ prop tableColumns vào
     * và thêm trường filterValue để thực hiện filter với từng trường
     */
    tableColumnData() {
      return {
        objectId: this.tableColumns.objectId,
        resources: this.tableColumns.resources.map((column) => {
          return { ...column, filterString: null };
        }),
      };
      // console.log(this.tableColumnData);
    },
  },

  mounted() {
    window.addEventListener("click", this.closeMenuListFunction);
  },

  unmounted() {
    window.removeEventListener("click", this.closeMenuListFunction);
  },

  methods: {
    /**
     * Author : PNNHai
     * Date :
     * Description : Hàm để xử lý ẩn/hiện danh sách các chức năng chọn của các dòng
     */
    onClickDropFunctionIcon(row) {
      try {
        // Nếu dòng đang mở drop list function lại được click, ẩn nó.
        if (this.functionalRow === row) {
          this.functionalRow = null;
        } else {
          // Nếu không, mở nó và xác định vị trí của nó.
          this.functionalRow = row;
          const rectItem = event.target.getBoundingClientRect();
          const left = rectItem.x;
          const top = rectItem.y;

          // gán vị trí cho list function ứng với mỗi dòng
          this.styleToolEdit.left = left - 102 + "px";
          this.styleToolEdit.top = top + 20 + "px";
        }
      } catch (err) {
        console.error(err);
      }
    },
    /**
     * Author : PNNHai
     * Date :
     * Description : Hàm để format date khi hiển thị lên bảng với những trường cần format
     */
    formatData(formatType, value) {
      try {
        if (formatType === this.$_MisaEnums.FORMAT_TYPE.DATE_FOR_FE) {
          return convertDateForFE(value);
        } else if (formatType === this.$_MisaEnums.FORMAT_TYPE.GENDER) {
          return convertGender(value);
        } else if (formatType === this.$_MisaEnums.FORMAT_TYPE.SOFT_DELETE) {
          return converSoftDeleteStatus(value);
        } else if (
          formatType === this.$_MisaEnums.FORMAT_TYPE.STUDENT_VOLUNTEER_STATUS
        ) {
          return converStudentVolunteerStatus(value);
        } else if (
          formatType === this.$_MisaEnums.FORMAT_TYPE.INTERVIEW_RESULT
        ) {
          return converInterviewReponsedResult(value);
        } else if (
          formatType === this.$_MisaEnums.FORMAT_TYPE.VOLUNTEER_RATING
        ) {
          return converRated(value);
        }
        return value;
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * Author : PNNHai
     * Date :
     * Description : Hàm để bỏ hiển thị danh sách các chức năng của dòng
     */
    closeMenuListFunction() {
      this.functionalRow = null;
    },

    /**
     * Author : PNNHai
     * Date :
     * Description : Hàm để truyền emit ra ngoài khi tương tác với dòng dữ liệu
     * Truyền id của dòng ra và type (edit, duplicate, delete) ứng với dòng và lựa chọn đó
     */
    handleNotifyWithRowFunction(type, row) {
      this.$emit("notifyWorkWithRecord", type, row);
    },

    /**
     * Author : PNNHai
     * Date :
     * Description : Hàm để toggle giá trị của checkbox checked all
     * Khi checked vào checkbox ở header thì tất cả bên dưới sẽ checked theo và khi bỏ thì các ô dưới bỏ theo
     */
    toggleChangedAllTableCheckbox() {
      try {
        const isChecked = this.isSelectedAll;
        this.rowsData.forEach((row) => {
          row.isSelected = isChecked;
        });
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * Author : PNNHai
     * Date :
     * Description : Hàm bắt sự kiện changed của các checkbox ở table (gồm cả checkbox ở header)
     * Và lấy ra mảng id của các dòng được chọn truyền qua emit ra ngoài
     */
    onChangeTableCheckbox(rowId) {
      try {
        // Với table nhiều lựa chọn dòng
        if (
          this.tableSelectionType ===
          this.$_MisaEnums.TABLE_TYPE.MANY_ROW_SELECTION
        ) {
          // Trường hợp check vào header sẽ không có rowId thì là undefined
          if (!rowId) {
            this.toggleChangedAllTableCheckbox();
          } else {
            this.isSelectedAll = this.isAllRowsSelected;
          }

          // LẤY RA MẢNG CÁC RowIds và truyền qua emit sang EmployeePage
          const selectedRowIds = this.getRowIdSelecteds;
          this.$emit("notifyTableCheckboxChanged", selectedRowIds);
          console.log(selectedRowIds);
        }
        // Với table có 1 lựa chọn dòng
        else {
          this.$emit("notifyTableCheckboxChanged", rowId);
        }
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * Author: PNNHai
     * Date:
     * @param {*} sortColumn Cột click để sort
     * Description: Hàm thông báo cho component cha là vừa click vào tiêu đề (gửi kèm theo tên cột vừa click sort)
     */
    onClickColumnSort(sortColumn) {
      try {
        if (sortColumn) {
          if (this.sortParams.sortColumn !== sortColumn) {
            this.sortParams.sortColumn = sortColumn;
            this.sortParams.order = "asc";
          } else {
            if (this.sortParams.order === "asc") {
              this.sortParams.order = "desc";
            } else {
              this.sortParams.sortColumn = "";
              this.sortParams.order = null;
            }
          }
        }

        this.$emit("notifySortColumnClicked", this.sortParams);
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * Author: PNNHai
     * Date:
     * @param {string} columnName : Tên cột thực hiện filter
     * Description: Hàm thực hiện hiển thị/ẩn filter pop-up ứng với column chọn
     */
    handleShowFilterColumnPopup(columnName) {
      try {
        if (columnName) {
          // Với trường hợp pop-up chưa hiển thị -> hiển thị ứng với cột đó
          if (this.filterColumnPopup.isShow === false) {
            this.filterColumnPopup.columnName = columnName;
            this.filterColumnPopup.isShow = true;
          }
          // Với trường hợp pop-up đang hiển thị
          else {
            if (this.filterColumnPopup.columnName !== columnName) {
              this.filterColumnPopup.columnName = columnName;
              this.filterColumnPopup.isShow = true;
            } else {
              this.filterColumnPopup.columnName = null;
              this.filterColumnPopup.isShow = false;
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    },

    handleClickHyperlink(tableRow) {
      this.$emit("notifyClickedHyperLink", tableRow);
    },

    handleClickInterviewResult(id, status) {
      this.$emit("notifyResponsedInterviewResult", id, status);
    },

    onClickCancelColumnFilter() {
      alert(1);
    },

    onClickApplyColumnFilter() {
      alert(2);
    },
  },
};
</script>
<style lang="css">
@import "./table.css";
</style>
