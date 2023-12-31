import { createRouter, createWebHistory } from "vue-router";
import MisaEnums from "@/js/helpers/enums";

// PAGE
import HomePage from "@/views/common/index/HomePage.vue";
import LoginPage from "@/views/common/login/LoginPage.vue";
import VolunteerRegisterPage from "@/views/common/volunteer-register/register-form/VolunteerRegisterPage.vue";
import InformationPage from "@/views/common/information/InformationPage.vue";

// ADMIN
import AdminHomePage from "@/views/admin/admin-home/AdminHomePage.vue";
import AdminActivitiesManagementPage from "@/views/admin/admin-activities-management/admin-activity-page/activity-page/AdminActivitiesManagementPage.vue";
import AdminInterviewManagementPage from "@/views/admin/admin-interview-management/admin-interview-page/interview-page/AdminInterviewManagementPage";
import AdminStatisticalPage from "@/views/admin/admin-statistical/AdminStatisticalPage.vue";
import AdminVolunteerManagementPage from "@/views/admin/admin-volunteer-management/AdminVolunteerManagementPage.vue";
import AdminStudentManagementPage from "@/views/admin/admin-student-management/AdminStudentManagementPage.vue";

// VOLUNTEER
import VolunteerHomePage from "@/views/volunteer/volunteer-home/VolunteerHomePage.vue";
import VolunteerActivitiesPage from "@/views/volunteer/volunteer-activities/activity-page/VolunteerActivitiesPage.vue";
import VolunteerInformation from "@/views/volunteer/volunteer-information/VolunteerInformation.vue";

import store from "@/js/store";

const routers = [
  // /
  {
    path: "/",
    name: "HomePage",
    component: HomePage,
  },
  // /volunteer-register
  {
    path: "/volunteer-register",
    name: "VolunteerRegisterPage",
    component: VolunteerRegisterPage,
  },
  // /login
  {
    path: "/login",
    name: "LoginPage",
    component: LoginPage,
  },
  // /information
  {
    path: "/information",
    name: "InformationPage",
    component: InformationPage,
  },
  // /admin
  {
    path: "/admin",
    name: "AdminHomePage",
    component: AdminHomePage,
    meta: { requiresAuth: true, adminOnly: true },
  },
  // /admin/admin-activities-management
  {
    path: "/admin/admin-activities-management",
    name: "AdminActivitiesManagementPage",
    component: AdminActivitiesManagementPage,
    meta: { requiresAuth: true, adminOnly: true },
  },
  // /admin/admin-interview-management
  {
    path: "/admin/admin-interview-management",
    name: "AdminInterviewManagementPage",
    component: AdminInterviewManagementPage,
    meta: { requiresAuth: true, adminOnly: true },
  },
  // /admin/admin-statistical
  {
    path: "/admin/admin-statistical",
    name: "AdminStatisticalPage",
    component: AdminStatisticalPage,
    meta: { requiresAuth: true, adminOnly: true },
  },
  // /admin/admin-volunteer-management
  {
    path: "/admin/admin-volunteer-management",
    name: "AdminVolunteerManagementPage",
    component: AdminVolunteerManagementPage,
    meta: { requiresAuth: true, adminOnly: true },
  },
  // /admin/admin-volunteer-management
  {
    path: "/admin/admin-student-management",
    name: "AdminStudentManagementPage",
    component: AdminStudentManagementPage,
    meta: { requiresAuth: true, adminOnly: true },
  },
  // /volunteer
  {
    path: "/volunteer",
    name: "VolunteerHomePage",
    component: VolunteerHomePage,
    meta: { requiresAuth: true, volunteerOnly: true },
  },
  // /volunteer/information
  {
    path: "/volunteer/information",
    name: "VolunteerInformation",
    component: VolunteerInformation,
    meta: { requiresAuth: true, volunteerOnly: true },
  },
  // /volunteer/volunteer-activities
  {
    path: "/volunteer/volunteer-activities",
    name: "VolunteerActivitiesPage",
    component: VolunteerActivitiesPage,
    meta: { requiresAuth: true, volunteerOnly: true },
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes: routers,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((route) => route.meta.requiresAuth)) {
    const roleType = store.state.loginStatus.loginedAccountRole;
    if (roleType === MisaEnums.LOGIN_ROLE.ADMIN) {
      if (to.matched.some((route) => route.meta.adminOnly)) {
        next();
      } else {
        next("/admin"); // Chuyển hướng đến trang user nếu admin cố gắng truy cập vào trang user
      }
    } else if (roleType === MisaEnums.LOGIN_ROLE.VOLUNTEER) {
      if (to.matched.some((route) => route.meta.volunteerOnly)) {
        next();
      } else {
        next("/volunteer"); // Chuyển hướng đến trang admin nếu user cố gắng truy cập vào trang admin
      }
    } else {
      next("/login"); // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
    }
  } else {
    next();
  }
});

export default router;
