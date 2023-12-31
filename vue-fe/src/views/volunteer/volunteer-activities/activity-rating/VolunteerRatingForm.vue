<template lang="">
  <div class="rating-area">
    <form action="" class="rating-form">
      <div class="rating-header">
        <h3 class="rating-form-heading">ĐÁNH GIÁ HOẠT ĐỘNG</h3>
        <div
          class="rating-form-close"
          @click.stop="handleCloseRatingForm"
        ></div>
      </div>
      <div class="rating-infor">
        <label class="activity-rating-title">Hoạt động: </label>
        <span class="activity-rating-name">{{
          activityInfor.activityName
        }}</span>
        <div class="rating-star-area">
          <label>Số sao </label>
          <div class="rating-star">
            <span
              v-for="star in 5"
              :key="star"
              :class="[
                'rating-star',
                { 'selected-star': star <= ratingInfor.ratingStar },
              ]"
              @click="selectStars(star)"
            >
              &#9733;
            </span>
          </div>
          <div class="rating-feeling" v-if="ratingInfor.ratingStar">
            {{ ratingFeeling }}
          </div>
        </div>
        <misa-text-field
          label="Phản hồi"
          fieldClass="rating-field"
          textFieldId="username"
          textFieldClass="size-xl"
          v-model="ratingInfor.description"
        />
      </div>

      <div class="rating-form-footer">
        <misa-button
          buttonName="Hủy"
          buttonClass="button normal-button"
          @click.stop="handleCloseRatingForm"
        />
        <misa-button
          buttonName="Đánh giá"
          buttonClass="button primary-button"
          @click.stop="handleRatingActivity"
        />
      </div>
    </form>
  </div>
</template>
<script>
import ratingService from "@/js/services/rating/ratingService";
export default {
  name: "VolunteerRatingForm",

  props: {
    activityInfor: { type: Object, required: true },
  },

  emits: ["notifyCloseRatingForm"],

  data() {
    return {
      ratingInfor: {
        ratingStar: 0,
        description: "",
      },

      studentCode: this.$store.state.loginStatus.loginedStudentCode,
    };
  },

  computed: {
    ratingFeeling() {
      if (this.ratingInfor.ratingStar === 1) {
        return "Rất tệ !";
      } else if (this.ratingInfor.ratingStar === 2) {
        return "Tệ !";
      } else if (this.ratingInfor.ratingStar === 3) {
        return "Bình thường !";
      } else if (this.ratingInfor.ratingStar === 4) {
        return "Tốt !";
      } else {
        return "Rất tốt !";
      }
    },
  },

  methods: {
    selectStars(stars) {
      try {
        this.ratingInfor.ratingStar = stars;
      } catch (error) {
        console.log(error);
      }
    },

    handleCloseRatingForm() {
      this.$emit("notifyCloseRatingForm");
    },

    async ratingAnActivity() {
      try {
        this.$store.state.isLoading = true;

        const res = await ratingService.rating_Volunteer(
          this.activityInfor.activityCode,
          this.studentCode,
          this.ratingInfor
        );
        return res;
      } catch (err) {
        console.error(err);
      } finally {
        this.$store.state.isLoading = false;
      }
    },

    async handleRatingActivity() {
      try {
        const res = await this.ratingAnActivity();
        if (res.success) {
          this.$store.commit("addToast", {
            type: "success",
            message: "Đánh giá thành công 1 bản ghi",
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
<style lang="css">
@import "./volunteer-rating-form.css";
</style>
