<template>
  <div class="charts-wrapper">
    <misa-chart
      :chartTitle="studentData.chartTitle"
      :chartSize="studentData.chartSize"
      :chartType="studentData.chartType"
      :dataForChart="studentData.dataForChart"
    />

    <misa-chart
      :chartTitle="activityCostData.chartTitle"
      :chartSize="activityCostData.chartSize"
      :chartType="activityCostData.chartType"
      :dataForChart="activityCostData.dataForChart"
    />

    <misa-chart
      :chartTitle="activityNumberOfMemberData.chartTitle"
      :chartSize="activityNumberOfMemberData.chartSize"
      :chartType="activityNumberOfMemberData.chartType"
      :dataForChart="activityNumberOfMemberData.dataForChart"
    />
  </div>
</template>

<script>
import MisaChart from "@/components/base/chart/MisaChart.vue";
import studentService from "@/js/services/student/studentService";
import activityService from "@/js/services/acitvity/activityServices";
import { countfieldData } from "@/js/common/common";
export default {
  name: "AdminStatisticalPage",
  components: {
    MisaChart,
  },
  data() {
    return {
      studentData: {
        chartTitle: "Thống kê sinh viên từ các lớp",
        dataForChart: {
          labels: [],
          data: [],
        },
        chartType: "doughnut",
        chartSize: { width: 400, height: 400 },
      },

      activityCostData: {
        chartTitle: "Thống kê kinh phí cho hoạt động",
        dataForChart: {
          labels: [],
          data: [],
        },
        chartType: "line",
        chartSize: { width: 400, height: 400 },
      },

      activityNumberOfMemberData: {
        chartTitle: "Thống kê số lượng người tham gia hoạt động",
        dataForChart: {
          labels: [],
          data: [],
        },
        chartType: "bar",
        chartSize: { width: 400, height: 400 },
      },
    };
  },

  created() {
    this.studentClassStatustical();
    this.activityCostStatustical();
    this.activityActivityMemberStatustical();
  },

  methods: {
    async getAllStudents() {
      try {
        this.$store.state.isLoading = true;
        const res = await studentService.get_Admin();
        return res;
      } catch (error) {
        console.log(error);
      } finally {
        this.$store.state.isLoading = false;
      }
    },

    async getActivities() {
      try {
        this.$store.state.isLoading = true;
        const res = await activityService.getAll_Admin({
          sort: "beginingDate",
          order: "asc",
          page: "",
          limit: "",
          search: "",
        });
        return res;
      } catch (error) {
        console.log(error);
      } finally {
        this.$store.state.isLoading = false;
      }
    },

    async studentClassStatustical() {
      const res = await this.getAllStudents();
      if (res.success) {
        const data = res.data.data.listData;
        const countFields = countfieldData("className", data);
        countFields.sort((a, b) => b.data - a.data);
        const statisticalData = {};

        statisticalData.labels = countFields.map((item) => item.label);
        statisticalData.data = countFields.map((item) => item.data);

        this.studentData.dataForChart = statisticalData;
      }
    },

    async activityCostStatustical() {
      const res = await this.getActivities();
      if (res.success) {
        const data = res.data.data.listData;
        const statisticalData = {};

        statisticalData.labels = data.map((item) => item.activityName);
        statisticalData.data = data.map((item) => item.supportMoney);

        this.activityCostData.dataForChart = statisticalData;
      }
    },

    async activityActivityMemberStatustical() {
      const res = await this.getActivities();
      if (res.success) {
        const data = res.data.data.listData;
        const statisticalData = {};

        statisticalData.labels = data.map((item) => item.activityName);
        statisticalData.data = data.map((item) => item.numOfParticipant);

        this.activityNumberOfMemberData.dataForChart = statisticalData;
      }
    },
  },
};
</script>
<style lang="css" scoped>
@import "./admin-statistical.css";
</style>
