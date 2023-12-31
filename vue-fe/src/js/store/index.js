import Vuex from "vuex";
import { findArrayIndexByAttribute, generateGuid } from "@/js/common/common.js";

const storeData = {
  state: {
    loginStatus: {
      loginedAccountRole: null,
      loginedStudentCode: null,
      logginedUserName: null,
    },

    isLoading: false,

    toast: [],

    dialogNotify: {
      isShow: false,
      type: "warning",
      text: "",
    },
  },
  mutations: {
    updateLoginStatus(state, { accountRole, studentCode, userName }) {
      state.loginStatus.loginedAccountRole = accountRole;
      state.loginStatus.loginedStudentCode = studentCode;
      state.loginStatus.logginedUserName = userName;
    },

    logout(state) {
      state.loginStatus.loginedAccountRole = null;
      state.loginStatus.loginedStudentCode = null;
      state.loginStatus.logginedUserName = null;
    },

    addToast(state, { type, message }) {
      const id = generateGuid();
      const newToast = {
        id: id,
        type: type,
        message: message,
      };

      state.toast.push(newToast);

      setTimeout(() => {
        const toastIndex = findArrayIndexByAttribute(state.toast, "id", id);
        if (toastIndex !== -1) {
          state.toast.splice(toastIndex, 1);
        }
      }, 5000); // Ẩn Toast sau 5 giây
    },

    closeToast(state, toastId) {
      const toastIndex = findArrayIndexByAttribute(state.toast, "id", toastId);
      if (toastIndex !== -1) {
        state.toast.splice(toastIndex, 1);
      }
    },
  },
};

const store = new Vuex.Store(storeData);
export default store;
