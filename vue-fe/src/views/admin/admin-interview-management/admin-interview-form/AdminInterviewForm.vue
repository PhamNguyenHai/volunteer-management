<template lang="">
  <div class="form-overlay">
    <form class="form">
      <div class="form-header">
        <div class="form-header-left">
          <h3 class="form-title">
            {{ formTitle }}
          </h3>
        </div>
        <div class="form-header-right">
          <div class="form-support-icon"></div>
          <div
            class="form-close-icon"
            @click.stop="onClickHideFormButton"
          ></div>
        </div>
      </div>

      <div class="form-main">
        <misa-date-field
          label="Ngày phỏng vấn"
          :fieldClass="[
            { invalid: errorMessages.interviewDate },
            'form-field-area',
            'required',
          ]"
          :inputTitle="errorMessages.interviewDate"
          dateInputId="interviewDate"
          dateInputClass="size-xl"
          v-model="formData.interviewDate"
          @notifyChangeDate="validateField('interviewDate')"
        />

        <misa-number-field
          label="Số lượng"
          :fieldClass="[
            { invalid: errorMessages.quantityMax },
            'form-field-area',
            'required',
          ]"
          :inputTitle="errorMessages.quantityMax"
          textFieldId="quantityMax"
          textFieldClass="size-xl"
          v-model="formData.quantityMax"
          @notifyInputText="validateField('quantityMax')"
          @notifyBlurInput="validateField('quantityMax')"
        />

        <misa-text-field
          label="Phòng phỏng vấn"
          :fieldClass="[
            { invalid: errorMessages.interviewRoom },
            'form-field-area',
            'required',
          ]"
          :inputTitle="errorMessages.interviewRoom"
          textFieldId="interviewRoom"
          textFieldClass="size-xl"
          v-model="formData.interviewRoom"
          @notifyInputText="validateField('interviewRoom')"
          @notifyBlurInput="validateField('interviewRoom')"
        />
      </div>

      <div class="form-footer">
        <div class="form-footer--left">
          <misa-button
            :buttonName="$_MisaResources.buttons.cancel"
            buttonClass="button normal-button"
            @click.stop="onClickHideFormButton"
          />
        </div>
        <div class="form-footer--right">
          <misa-button
            :buttonName="$_MisaResources.buttons.save"
            buttonClass="button normal-button"
            @click.stop="onClickSaveButton"
          />
          <misa-button
            :buttonName="$_MisaResources.buttons.saveAndAdd"
            buttonClass="button primary-button"
            @click.stop="onClickSaveAndAddButton"
          />
        </div>
      </div>
    </form>
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

<style lang="css" scoped>
@import "./admin-interview-form.css";
</style>

<script>
import getFieldInvalidError from "@/js/helpers/validate.js";
import interviewService from "@/js/services/interview/interviewService.js";

export default {
  name: "AdminInterviewForm",
  props: {
    //Id của nhân viên cần sửa nếu ko có thì là xóa
    interviewInfor: { type: Object, default: null },

    // loại form (thêm / sửa)
    formDataType: { type: Number, required: true },
  },

  emits: ["notifyHideForm", "notifySubmittedForm"],

  data() {
    return {
      activeRow: "0",
      formData: {
        interviewDate: null,
        interviewRoom: null,
        quantityMax: null,
      },

      validateFormRules: {
        interviewDate: ["required", "noLessThanCurrentDate"],
        interviewRoom: ["required", "maxLength_255"],
        quantityMax: ["required", "maxLength_255"],
      },

      errorMessages: {
        interviewDate: "",
        interviewRoom: "",
        quantityMax: "",
      },

      formMode: null,

      copyFormData: {},

      dialog: {
        isShow: false,
        type: null,
        text: null,
        numberOfButton: null,
      },
    };
  },

  /**
   * Author : PNNHai
   * Date:
   * Description: Trong created sẽ
   */
  created() {
    // Gán formMode = props formDataType
    this.formMode = this.formDataType;
    this.bindingDataToForm(this.formMode);
  },

  computed: {
    // Hàm để thực hiện hiển thị form title theo formMode
    formTitle() {
      // Đối với trường hợp thêm mới và nhân bản
      if (
        this.formMode === this.$_MisaEnums.FORM_MODE.ADD ||
        this.formMode === this.$_MisaEnums.FORM_MODE.DUPLICATE
      ) {
        return "Thêm mới phỏng vấn";
      }
      // Đối với trường hợp cập nhật
      else {
        return "Cập nhật phỏng vấn";
      }
    },

    /**
     * Author: PNNHai
     * Date:
     * Description: So sánh giá trị của biến ban đầu và biến copy có khác nhau không
     */
    isFormChanged() {
      // So sánh giá trị hiện tại với giá trị ban đầu
      // Chuyển về JSON để so sánh
      return (
        JSON.stringify(this.formData) !== JSON.stringify(this.copyFormData)
      );
    },
  },

  methods: {
    // ======================   2 HÀM DƯỚI ĐỂ VALIDATE FIELD & FORM ============================
    /**
     * Author : PNNHai
     * Date:
     * @param {String} fieldName : tên trường thực hiện validate
     * Description: Hàm để validate cho từng field trong form
     */
    validateField(fieldName) {
      try {
        // Lấy ra toàn bộ validate rules của field ở obj validateFormRules khi truyền field name
        const fieldRules = this.validateFormRules[fieldName];

        // Nếu validate rules được đăng kí tại obj validateFormRules và tồn tại thì mới kiểm tra
        if (fieldRules) {
          // Với trường hợp trong validate rules ko có required thì chỉ validate
          // các trường còn lại khi field đó có giá trị
          if (!fieldRules.includes("required")) {
            // Kiểm tra xem nếu field đó có giá trị thì mới validate các trường còn lại
            // Nếu có giá trị thì thực hiện từng rule functions ứng với các rules có trong field đó
            if (this.formData[fieldName]) {
              // Thực hiện gán errorMessage của field tương ứng
              this.errorMessages[fieldName] = getFieldInvalidError(
                fieldRules,
                this.formData[fieldName]
              );
            }
            // Với trường hợp trong validate rules có required thì sẽ validate tất cả rules
          } else {
            // Thực hiện gán errorMessage của field tương ứng
            this.errorMessages[fieldName] = getFieldInvalidError(
              fieldRules,
              this.formData[fieldName]
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * Author : PNNHai
     * Date:
     * Description: Hàm để validate toàn bộ form
     */
    validateForm() {
      try {
        // Kiểm tra lỗi trước khi submit
        // Validate với các field có đăng kí validate ở obj validateFormRules
        let isOk = true;
        for (let field in this.errorMessages) {
          // validate field tương ứng
          this.validateField(field);

          // Kiểm tra nếu errorMessages ứng với trường đó có nội dung thì isOk = false
          if (this.errorMessages[field] !== "") {
            isOk = false;
          }
        }
        return isOk;
      } catch (error) {
        console.log(error);
      }
    },
    // ==================================================================================================================

    /**
     * Author: PNNHai
     * Date:
     * Description: Hàm để ẩn dialog
     */
    handleCloseDialog() {
      this.dialog.isShow = false;
    },

    /**
     * Author: PNNHai
     * Date:
     * Description: Hàm để ẩn form
     */
    handleNotifyCloseForm() {
      this.$emit("notifyHideForm");
    },

    /**
     * Author : PNNHai
     * Date :
     * Description : Hàm để xử lý tắt form khi click vào nút tắt
     * +/ Nếu form chưa có gì thay đổi => tắt luôn
     * +/ Nếu form đã thay đổi : Hiển thị confirm cất dữ liệu hay không ?
     *    + Hủy : Tắt dialog và tiếp tục tác vụ
     *    + Không : không cất dl
     *    + Có : Cất dl
     */
    onClickHideFormButton() {
      try {
        const formChanged = this.isFormChanged;

        if (formChanged) {
          this.dialog.isShow = true;
          this.dialog.type = "confirm";
          this.dialog.numberOfButton =
            this.$_MisaEnums.DIALOG_TYPE_BUTTON.THREE_BUTTONS;
          this.dialog.text = "Dữ liệu đã bị thay đổi. Bạn có muốn cất không ?";
        } else {
          this.handleNotifyCloseForm();
        }
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * Author: PNNHai
     * Date:
     * @param {Enum(Number)} responseStatus : Kết quả phản hồi của người dùng (NO(0) / YES(1) )
     * Description: Hàm để xử lý khi nhận được thông báo từ dialog đã được phản hồi
     */
    async handleDialogResponded(responseStatus) {
      try {
        await this.handleConfirmCloseChangedForm(responseStatus);

        // Close dialog
        this.handleCloseDialog();
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * Author: PNNHai
     * Date:
     * @param {Enum(Number)} response : Kết quả người dùng từ dialog (NO(0) / YES(1) )
     * Description: Hàm để xử lý khi người dùng xác nhận cất dữ liệu hay không khi tắt form lúc form đã thay đổi dữ liệu
     * +/ Nếu người dùng chọn NO -> Thông báo tắt form ra ngoài
     * +/ Nếu người dùng chọn có -> bắt vào sự kiện onClickSaveButton để thực hiện
     */
    async handleConfirmCloseChangedForm(response) {
      try {
        // Nếu response = NO -> Tắt form
        if (response === this.$_MisaEnums.DIALOG_RESPONSE.NO) {
          this.handleNotifyCloseForm();
        } else {
          await this.onClickSaveButton();
        }
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * Author : PNNHai
     * Date :
     * Description : Hàm xóa các error của các trường. Để reset form
     */
    resetTextFieldError() {
      try {
        for (let keyAttr in this.errorMessages) {
          this.errorMessages[keyAttr] = "";
        }
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * Author : PNNHai
     * Date :
     * Description : Hàm xóa dữ liệu của các trường. Để reset form
     */
    resetFieldData() {
      try {
        for (let keyAttr in this.formData) {
          this.formData[keyAttr] = null;
        }
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * Author : PNNHai
     * Date :
     * @param {Enum(Number)} formMode : chế độ hiện tại của form (ADD (0) /EDIT (1) / DUPLICATE(2) )
     * Description: Hàm để binding data lên form với từng trường hợp form
     * +/ Với form ADD : Lấy Code mới và truyền lên
     * +/ Với form EDIT: Lấy thông tin của nhân viên và truyền lên
     * +/ Với form DUPLICATE: Lấy thông tin của nhân viên truyền lên và thay thế mã bằng mã mới
     * (DUPLICATE: bản chất là ADD)
     *
     * -- SAU KHI BINDING XONG THÌ LẤY GÁN GIÁ TRỊ CHO BIẾN COPY ĐỂ THEO DÕI CÓ THAY ĐỔI KHÔNG
     */
    bindingDataToForm(formMode) {
      try {
        this.resetFieldData();
        this.resetTextFieldError();
        // Đối với trường hợp edit => binding dữ liệu lên form
        if (
          formMode === this.$_MisaEnums.FORM_MODE.EDIT ||
          formMode === this.$_MisaEnums.FORM_MODE.DUPLICATE
        ) {
          if (this.interviewInfor) {
            this.formData = {
              interviewRoom: this.interviewInfor.interviewRoom,
              interviewDate: this.interviewInfor.interviewDate,
              quantityMax: this.interviewInfor.quantityMax,
            };
          }
        }
        // Với trường hợp thêm thì chỉ hiển thị form trống
        // Coppy formData ban đầu ra một object mới để kiểm tra có thay đổi không
        this.copyFormData = { ...this.formData };
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * Author: PNNHai
     * Date:
     * @param {Object} interview : interview muốn thêm mới
     * Description: Hàm thêm mới interview gọi API
     */
    async addNewInterview(interview) {
      try {
        this.$store.state.isLoading = true;
        const res = await interviewService.insert_Admin(interview);
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
     * @param {String(Guid)} id : Id của nhân viên muốn update
     * @param {*} interview : Thông tin nhân viên để update
     * Description: Hàm cập nhật thông tin nhân viên gọi API
     */
    async updateInterview(id, interview) {
      try {
        this.$store.state.isLoading = true;
        const res = await interviewService.update_Admin(id, interview);
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
     * Description: Submit form với add/update/duplicate(bản chất là add)
     */
    async submitForm() {
      try {
        // Với trường hợp form thêm mới / nhân bản
        let res = {};
        if (
          this.formMode === this.$_MisaEnums.FORM_MODE.ADD ||
          this.formMode === this.$_MisaEnums.FORM_MODE.DUPLICATE
        ) {
          res = await this.addNewInterview(this.formData);
        }
        // Với trường hợp form update
        else {
          res = await this.updateInterview(
            this.interviewInfor.interviewCode,
            this.formData
          );
        }

        // Thông báo lưu thông tin thành công
        // Kiểm tra res.success thành công = true -> add Toast
        if (res?.success) {
          this.$store.commit("addToast", {
            type: "success",
            message: "Lưu thông tin thành công.",
          });
          return true;
        }
        return false;
      } catch (err) {
        console.log(err);
      }
    },

    /**
     * Author : PNNHai
     * Date :
     * Description : Hàm xử lý khi click vào nút lưu
     * Sẽ thông báo ra bên ngoài Sẽ thông báo ra bên ngoài để refres lại bảng và ẩn form đi
     */
    async onClickSaveButton() {
      try {
        // Validate và submit form
        // Nếu validate ok => submit form
        if (this.validateForm() === true) {
          // Gọi hàm submit form
          const isSuccess = await this.submitForm();

          if (isSuccess) {
            // Thông báo ra bên ngoài đã submit thành công để load lại bảng
            // Với save => ẩn form
            this.$emit(
              "notifySubmittedForm",
              this.$_MisaEnums.FORM_SUBMIT_MODE.SAVE
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * Author : PNNHai
     * Date :
     * Description : Hàm xử lý khi click vào nút lưu và thêm mới
     * Sẽ thông báo ra bên ngoài để refres lại bảng nhưng không ẩn form mà tự động tăng mã lên
     */
    async onClickSaveAndAddButton() {
      try {
        // Validate và submit form
        if (this.validateForm() === true) {
          // Gọi hàm submit form
          const isSuccess = await this.submitForm();
          if (isSuccess) {
            // Thông báo ra bên ngoài EmployeePage đã submit thành công để load lại bảng
            // Với save => ẩn form
            // Với save_add => reset thông tin -> tiếp tục thêm được
            this.$emit(
              "notifySubmittedForm",
              this.$_MisaEnums.FORM_SUBMIT_MODE.SAVE_ADD
            );

            // Sau khi click nút lưu và thêm => chuyển mode -> add (nếu mode hiện tại đg là add => ko đổi)
            // nhưng nếu mode đg là update => add
            this.formMode = this.$_MisaEnums.FORM_MODE.ADD;
            this.bindingDataToForm(this.formMode);
            console.log(this.formData);
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
