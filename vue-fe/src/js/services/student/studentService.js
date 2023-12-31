import BaseService from "../BaseService";

class StudentService extends BaseService {
  constructor() {
    super("/students");
  }

  async get_Admin() {
    const res = await this.baseApiService.get(this.endpoint("/admin"));
    return res;
  }

  async getAll_Admin({ sort, order, page, limit, search }) {
    const res = await this.baseApiService.get(
      this.endpoint(
        `/admin?sort=${sort}&order=${order}&page=${page}&limit=${limit}&search=${search}`
      )
    );
    return res;
  }

  async getById(id) {
    const res = await this.baseApiService.get(this.endpoint(`/${id}`));
    return res;
  }

  async search({ studentCode, studentName, className }) {
    const res = await this.baseApiService.post(this.endpoint("/search"), {
      studentCode,
      studentName,
      className,
    });
    return res;
  }
}

const studentService = new StudentService();

export default studentService;
