import BaseService from "../BaseService";

class VolunteerService extends BaseService {
  constructor() {
    super("/volunteers");
  }

  async getAllVolunteers_Admin({ sort, order, page, limit, search }) {
    const res = await this.baseApiService.get(
      this.endpoint(
        `/admin?sort=${sort}&order=${order}&page=${page}&limit=${limit}&search=${search}`
      )
    );
    return res;
  }

  async deleteMany_Admin(ids) {
    const res = await this.baseApiService.delete(this.endpoint("/admin"), {
      data: { studentCode: ids },
    });
    return res;
  }
}

const volunteerService = new VolunteerService();

export default volunteerService;
