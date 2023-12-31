<template lang="">
  <div :class="fieldClass">
    <label :for="dateInputId" :title="title" v-if="label">{{ label }}</label>
    <input
      :id="dateInputId"
      type="date"
      class="date-field"
      :class="dateInputClass"
      :title="inputTitle"
      v-model="inputValue"
      @change="onChangeData"
    />
  </div>
</template>
<script>
export default {
  name: "MisaDateField",

  props: {
    // Label cho date field
    label: { type: String, default: "" },

    // tooltips label
    title: { type: String, default: "" },

    // class cho toàn bộ field đó
    fieldClass: { required: false },

    // tooltips cho input
    inputTitle: { required: false },

    // Id của date field
    dateInputId: { type: String },

    // Class cho date field
    dateInputClass: { type: String, default: "" },

    // value cuar model dùng để binding 2 chiều cho component
    modelValue: { required: false },
  },

  data() {
    return {
      inputValue: null, // Dữ liệu đang được edit trong component
    };
  },

  watch: {
    // Theo dõi sự thay đổi của prop value của component đó nếu có thay đổi thì gán vào biến inputValue
    modelValue: {
      handler: function () {
        if (this.modelValue) {
          const date = new Date(this.modelValue);
          let day = String(date.getDate().toString()).padStart(2, "0");
          let month = String((date.getMonth() + 1).toString()).padStart(2, "0");
          const year = date.getFullYear();

          const dateString = `${year}-${month}-${day}`;

          this.inputValue = dateString;
        } else {
          this.inputValue = null;
        }
      },
      immediate: true,
    },
  },

  methods: {
    onChangeData() {
      try {
        // EMIT CHO BINDING 2 CHIỀU CỦA COMPONENT ĐỂ UPDATE LẠI ModelValue
        this.$emit("update:modelValue", this.inputValue);
        this.$emit("notifyChangeDate");
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>
<style lang="css">
@import "./date-field.css";
</style>
