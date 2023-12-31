import BaseService from "../BaseService";

class ActivityService extends BaseService {
  constructor() {
    super("/activities");
  }

  async getAll_Admin({ sort, order, page, limit, search }) {
    const res = await this.baseApiService.get(
      this.endpoint(
        `/admin?sort=${sort}&order=${order}&page=${page}&limit=${limit}&search=${search}`
      )
    );
    return res;
  }

  async getById_Admin(id) {
    const res = await this.baseApiService.get(this.endpoint(`/admin/${id}`));
    return res;
  }

  async getActivitiesByStudentId_Volunteer(
    studentId,
    { sort, order, page, limit, search }
  ) {
    const res = await this.baseApiService.get(
      this.endpoint(
        `/${studentId}?sort=${sort}&order=${order}&page=${page}&limit=${limit}&search=${search}`
      )
    );
    return res;
  }

  async create_Admin(insertData) {
    const res = await this.baseApiService.post(
      this.endpoint("/admin"),
      insertData
    );
    return res;
  }

  async update_Admin(id, updateData) {
    const res = await this.baseApiService.patch(
      this.endpoint(`/admin/${id}`),
      updateData
    );
    return res;
  }

  async delete_Admin(id) {
    const res = await this.baseApiService.delete(this.endpoint(`/admin/${id}`));
    return res;
  }

  async deleteMany_Admin(ids) {
    const res = await this.baseApiService.delete(this.endpoint("/admin"), {
      data: { activityCode: ids },
    });
    return res;
  }

  async chooseMembersForAnActivity_Admin(activityId, studentCodes) {
    const res = await this.baseApiService.post(
      this.endpoint(`/admin/${activityId}`),
      studentCodes
    );
    return res;
  }

  async getMembersOfAnActivityById_Admin(activityId) {
    const res = await this.baseApiService.get(
      this.endpoint(`/admin/${activityId}/selected-volunteer`)
    );
    return res;
  }
}

const activityService = new ActivityService();

export default activityService;
