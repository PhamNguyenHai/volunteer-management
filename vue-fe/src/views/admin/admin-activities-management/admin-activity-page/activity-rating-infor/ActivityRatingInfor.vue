<template lang="">
  <div class="admin-rating-infor-overlay">
    <div class="admin-rating-area">
      <h2 class="admin-rating-header">
        <div class="admin-rating-heading">Đánh giá họat động</div>
        <div
          class="admin-rating-form-close"
          @click.stop="handleCloseAdminRatingInfor"
        ></div>
      </h2>
      <div class="admin-rating-content">
        <div class="activity-infor-field">
          <span class="activity-rating-name activity-infor-titile"
            >Tên hoạt động:
          </span>
          {{ activityInfor.activityName }}
        </div>
        <div class="activity-infor-field">
          <span class="activity-begining-date activity-infor-titile"
            >Ngày bắt đầu:
          </span>
          {{ activityInfor.beginingDate }}
        </div>
        <div class="activity-infor-field">
          <span class="activity-average-rating activity-infor-titile"
            >Số sao trung bình:
          </span>
          {{ activityInfor.averageRating }}
        </div>
        <div class="activity-infor-field">
          <span class="activity-number-member activity-infor-titile"
            >Thành viên:
          </span>
          {{ activityInfor.numOfParticipant }}
        </div>
        <h3 class="activity-member-rating-title">
          Thành viên đánh giá ({{ ratingMemberNumber }}):
        </h3>
        <div class="activity-member-rating-list">
          <div
            class="activity-member-rating"
            v-for="rating in ratings"
            :key="rating.ratingCode"
          >
            <div class="member-rating-area">
              <div class="member-avatar"></div>
              <div class="member-rating">
                <h4 class="member-name">{{ rating.studentName }}</h4>
                <div class="admin-rating-star-area">
                  <div class="rating-star">
                    <span
                      v-for="star in 5"
                      :key="star"
                      :class="[
                        'rating-star',
                        { 'selected-star': star <= rating.ratingStar },
                      ]"
                    >
                      &#9733;
                    </span>
                  </div>
                </div>
                <div class="member-desctription">
                  Bình luận: {{ rating.description }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ratingService from "@/js/services/rating/ratingService";
export default {
  name: "AdminActivityRatingInforForm",

  props: {
    activityInfor: { type: Object, required: true },
  },

  data() {
    return {
      ratings: [],
      ratingMemberNumber: 0,
      filterParams: {
        page: 1,
        limit: 5,
        search: "",
        sort: "createdAt",
        order: "desc",
      },
    };
  },

  created() {
    this.loadAllRating();
  },

  methods: {
    async getAllRatingByActivityId() {
      try {
        this.$store.state.isLoading = true;
        const res = await ratingService.getAllRatingByActivityId_Admin(
          this.activityInfor.activityCode,
          this.filterParams
        );
        return res;
      } catch (err) {
        console.error(err);
      } finally {
        this.$store.state.isLoading = false;
      }
    },

    async loadAllRating() {
      try {
        const res = await this.getAllRatingByActivityId();
        if (res.success) {
          const data = res.data.data;
          this.ratings = data.listData;
          this.ratingMemberNumber = data.totalCount;
        }
      } catch (err) {
        console.error(err);
      }
    },

    handleCloseAdminRatingInfor() {
      this.$emit("notifyCloseAdminRatingInfor");
    },
  },
};
</script>
<style lang="css">
@import "./activity-rating-infor.css";
</style>
