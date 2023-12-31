import BaseService from "../BaseService";

class RatingService extends BaseService {
  constructor() {
    super("/rating");
  }

  async rating_Volunteer(activityId, studentId, { ratingStar, description }) {
    const res = await this.baseApiService.post(
      this.endpoint(`/${activityId}/${studentId}`),
      { ratingStar, description }
    );
    return res;
  }

  async getAllRatingByActivityId_Admin(
    activityId,
    { sort, order, page, limit, search }
  ) {
    const res = await this.baseApiService.get(
      this.endpoint(
        `/admin/${activityId}?sort=${sort}&order=${order}&page=${page}&limit=${limit}&search=${search}`
      )
    );
    return res;
  }
}

const ratingService = new RatingService();

export default ratingService;
