import jwtDecode from "vue-jwt-decode";

export const isAccessTokenExpired = () => {
  try {
    const decodedToken = jwtDecode.decode(token);

    // Lấy ra thời gian hết hạn của token
    const expirationTime = new Date(decodedToken.exp);

    // Lấy ra thời gian hiện tại tính theo giây
    const currentTimestamp = Math.floor(Date.now() / 1000);

    return currentTimestamp >= expirationTime;
  } catch (error) {
    console.error(error);
  }
};
