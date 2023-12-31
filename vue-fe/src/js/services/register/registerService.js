import BaseService from "../BaseService";

class RegisterService extends BaseService {
  constructor() {
    super("/student_interview");
  }

  async applyForAnInterview({ studentCode, interviewCode }) {
    const res = await this.baseApiService.post(this.baseUrl, {
      studentCode,
      interviewCode,
    });
    return res;
  }

  async getAllRegisters_Admin({ studentCode, interviewCode }) {
    const res = await this.baseApiService.post(this.baseUrl, {
      studentCode,
      interviewCode,
    });
    return res;
  }

  async geStudentsApplyedByInterviewId_Admin(
    id,
    { sort, order, page, limit, search }
  ) {
    const res = await this.baseApiService.get(
      this.endpoint(
        `/admin/${id}?sort=${sort}&order=${order}&page=${page}&limit=${limit}&search=${search}`
      )
    );
    return res;
  }

  async updateInterviewResult_Admin(id, resultInterview) {
    const res = await this.baseApiService.patch(
      this.endpoint(`/admin/${id}`),
      resultInterview
    );
    return res;
  }
}

const registerService = new RegisterService();

export default registerService;
