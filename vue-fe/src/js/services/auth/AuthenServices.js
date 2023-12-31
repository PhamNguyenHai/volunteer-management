import BaseService from "../BaseService";

class AuthService extends BaseService {
  constructor() {
    super("/auth");
  }

  async login(username, password) {
    const res = await this.baseApiService.post(this.endpoint("/login"), {
      username,
      password,
    });
    return res;
  }

  async logout() {
    const res = await this.baseApiService.post(this.endpoint("/logout"));
    return res;
  }

  async refresh() {
    const res = await this.baseApiService.post(this.endpoint("/refresh"));
    return res;
  }
}

const authenService = new AuthService();

export default authenService;
