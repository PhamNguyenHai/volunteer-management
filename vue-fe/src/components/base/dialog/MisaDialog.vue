<template lang="">
  <div class="dialog-overlay">
    <div class="dialog" :class="'dialog--' + dialogType">
      <div class="dialog__header">
        <h3 class="dialog__heading">{{ dialogHeading }}</h3>
        <div class="dialog__close" @click.stop="onClickCloseDialog"></div>
      </div>
      <div class="dialog__content">
        <div class="dialog__icon"></div>
        <p class="dialog__message">
          {{ dialogText }}
        </p>
      </div>

      <div
        class="dialog__footer justify--right"
        v-if="numberOfButton === $_MisaEnums.DIALOG_TYPE_BUTTON.ONE_BUTTON"
      >
        <button class="button primary-button" @click.stop="onClickCloseDialog">
          {{ $_MisaResources.buttons.agree }}
        </button>
      </div>

      <div
        class="dialog__footer"
        v-else-if="
          numberOfButton === $_MisaEnums.DIALOG_TYPE_BUTTON.TWO_BUTTONS
        "
      >
        <button
          class="button normal-button"
          @click.stop="handleDialogResponded($_MisaEnums.DIALOG_RESPONSE.NO)"
        >
          {{ $_MisaResources.buttons.no }}
        </button>
        <button
          class="button primary-button"
          @click.stop="handleDialogResponded($_MisaEnums.DIALOG_RESPONSE.YES)"
        >
          {{ $_MisaResources.buttons.yes }}
        </button>
      </div>

      <div
        class="dialog__footer"
        v-else-if="
          numberOfButton === $_MisaEnums.DIALOG_TYPE_BUTTON.THREE_BUTTONS
        "
      >
        <div class="dialog-footer--left">
          <button class="button normal-button" @click.stop="onClickCloseDialog">
            {{ $_MisaResources.buttons.cancel }}
          </button>
        </div>
        <div class="dialog-footer--right">
          <button
            class="button normal-button"
            @click.stop="handleDialogResponded($_MisaEnums.DIALOG_RESPONSE.NO)"
          >
            {{ $_MisaResources.buttons.no }}
          </button>
          <button
            class="button primary-button"
            @click.stop="handleDialogResponded($_MisaEnums.DIALOG_RESPONSE.YES)"
          >
            {{ $_MisaResources.buttons.yes }}
          </button>
        </div>
      </div>

      <div class="dialog__footer justify--center" v-else>
        <button class="button primary-button" @click.stop="onClickCloseDialog">
          {{ $_MisaResources.buttons.close }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "MisaDialog",
  props: {
    dialogType: { type: String, required: true },
    dialogText: { type: String, required: true },
    numberOfButton: { type: Number, required: true },
  },

  emits: ["notifyCloseDialog", "notifyDialogResponded"],

  computed: {
    dialogHeading() {
      if (this.dialogType === "notify")
        return this.$_MisaResources.dialogText.heading.notify;
      else if (this.dialogType === "confirm")
        return this.$_MisaResources.dialogText.heading.confirm;
      return this.$_MisaResources.dialogText.heading.warning;
    },
  },

  methods: {
    onClickCloseDialog() {
      this.$emit("notifyCloseDialog");
    },

    handleDialogResponded(response) {
      this.$emit("notifyDialogResponded", response);
    },
  },
};
</script>
<style lang="css" scoped>
@import "./dialog.css";
</style>
