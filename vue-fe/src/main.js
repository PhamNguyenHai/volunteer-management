import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router/router.js";
import emitter from "tiny-emitter/instance";
import MisaEnums from "./js/helpers/enums.js";
import MisaResources from "./js/helpers/resources.js";
import store from "./js/store";

// import các component
import MisaTable from "@/components/base/table/MisaTable.vue";
import MisaButton from "@/components/base/button/MisaButton.vue";
import MisaDialog from "@/components/base/dialog/MisaDialog.vue";
import MisaCombobox from "@/components/base/auto-combobox/MisaCombobox.vue";
import MisaTextField from "@/components/base/text-field/MisaTextField.vue";
import MisaNumberField from "@/components/base/number-field/MisaNumberField.vue";
import MisaDateField from "@/components/base/date-field/MisaDateField.vue";
import MisaRadioField from "@/components/base/radio-field/MisaRadioField.vue";
import MisaCheckboxField from "@/components/base/checkbox-field/MisaCheckboxField.vue";
import MisaPagingNavigation from "@/components/base/paging-navigation/MisaPagingNavigation.vue";

const app = createApp(App);

// Khai baó các component toàn cục
app.component("MisaTable", MisaTable);
app.component("MisaButton", MisaButton);
app.component("MisaDialog", MisaDialog);
app.component("MisaCombobox", MisaCombobox);
app.component("MisaTextField", MisaTextField);
app.component("MisaNumberField", MisaNumberField);
app.component("MisaDateField", MisaDateField);
app.component("MisaRadioField", MisaRadioField);
app.component("MisaCheckboxField", MisaCheckboxField);
app.component("MisaPagingNavigation", MisaPagingNavigation);

// Sử dụng các thư viện
app.use(router).use(store);

// Sử dụng các biến global
app.config.globalProperties.$_emitter = emitter;
app.config.globalProperties.$_MisaEnums = MisaEnums;
app.config.globalProperties.$_MisaResources = MisaResources;

app.mount("#app");
