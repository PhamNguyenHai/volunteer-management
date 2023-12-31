import baseAxios from "./baseAxios";

class BaseService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.baseApiService = baseAxios;
  }

  endpoint(url) {
    return this.baseUrl + url;
  }

  async get() {
    const res = await this.baseApiService.get(this.baseUrl);
    return res;
  }

  async post(dataAdd) {
    const res = await this.baseApiService.post(this.baseUrl, dataAdd);
    return res;
  }

  async patch(id, dataUpdate) {
    const res = await this.baseApiService.patch(
      this.baseUrl + `/${id}`,
      dataUpdate
    );
    return res;
  }

  async delete(id) {
    const res = await this.baseApiService.delete(this.baseUrl + `/${id}`);
    return res;
  }

  async exportExcel_Admin() {
    const res = await this.baseApiService.get(this.endpoint("/admin/export"), {
      responseType: "blob", // Yêu cầu dữ liệu trả về dưới dạng blob
    });
    return res;
  }
}
export default BaseService;
