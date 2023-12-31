import MisaEnums from "./enums";
import MisaResources from "./resources";

export const convertDateForFE = (inputDate) => {
  if (inputDate) {
    const date = new Date(inputDate);
    let day = String(date.getDate()).padStart(2, "0");
    let month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
  return "";
};

export const convertDateForBE = (inputDate) => {
  if (inputDate) {
    const date = new Date(inputDate);
    let day = String(date.getDate()).padStart(2, "0");
    let month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }
  return "";
};

export const convertGender = (genderValue) => {
  if (genderValue == MisaEnums.GENDER.MALE)
    return MisaResources.dataFormat.gender.male;
  else if (genderValue == MisaEnums.GENDER.FEMALE)
    return MisaResources.dataFormat.gender.female;
  else return MisaResources.dataFormat.gender.another;
};

export const converSoftDeleteStatus = (value) => {
  if (value) {
    return "Đã ngưng sử dụng";
  } else {
    return "Đang sử dụng";
  }
};

export const converStudentVolunteerStatus = (value) => {
  if (value) {
    return "Là sinh viên tình nguyện";
  } else {
    return "Chưa là sinh viên tình nguyện";
  }
};

export const converInterviewReponsedResult = (value) => {
  if (value === null) {
    return "Đang chờ phỏng vấn";
  }
  if (value === true) {
    return "Đã trở thành sinh viên tình nguyện";
  } else {
    return "Phỏng vấn trượt";
  }
};

export const converRated = (value) => {
  if (value) {
    return "Đã đánh giá";
  }
  return "Chưa đánh giá";
};
