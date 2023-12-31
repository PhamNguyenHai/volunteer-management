import BaseService from "../BaseService";

class InterviewService extends BaseService {
  constructor() {
    super("/interviews");
  }

  async get_Admin({ sort, order, page, limit, search }) {
    const res = await this.baseApiService.get(
      this.endpoint(
        `/admin?sort=${sort}&order=${order}&page=${page}&limit=${limit}&search=${search}`
      )
    );
    return res;
  }

  async get_Anonymous({ sort, order, page, limit, search }) {
    const res = await this.baseApiService.get(
      this.endpoint(
        `?sort=${sort}&order=${order}&page=${page}&limit=${limit}&search=${search}`
      )
    );
    return res;
  }

  async insert_Admin(insertData) {
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
      data: { interviewCode: ids },
    });
    return res;
  }
}

const interviewService = new InterviewService();

export default interviewService;
