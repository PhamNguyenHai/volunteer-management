import MisaEnums from "../helpers/enums";

const interviewApplyedStudent = {
  objectId: "studentCode",
  resources: [
    {
      title: "Mã sinh viên",
      columnKey: "studentCode",
      align: "left",
      width: 150,
      columnType: "text",
      filterType: MisaEnums.FILTER_COLUMN_TYPE.TEXT_TYPE,
    },
    {
      title: "Tên sinh viên",
      columnKey: "studentName",
      align: "left",
      width: 200,
      columnType: "text",
      filterType: MisaEnums.FILTER_COLUMN_TYPE.TEXT_TYPE,
    },
    {
      title: "Lớp",
      columnKey: "className",
      align: "left",
      width: 150,
      columnType: "text",
      filterType: MisaEnums.FILTER_COLUMN_TYPE.TEXT_TYPE,
    },
    {
      title: "SĐT",
      columnKey: "phoneNumber",
      width: 150,
      align: "left",
      columnType: "selection",
      filterType: MisaEnums.FILTER_COLUMN_TYPE.SELECTION,
    },
    {
      title: "Email",
      columnKey: "email",
      width: 180,
      align: "left",
      columnType: "selection",
      filterType: MisaEnums.FILTER_COLUMN_TYPE.SELECTION,
    },
    {
      title: "Trạng thái",
      columnKey: "resultInterview",
      width: 150,
      align: "left",
      columnType: "selection",
      formatType: MisaEnums.FORMAT_TYPE.INTERVIEW_RESULT,
      filterType: MisaEnums.FILTER_COLUMN_TYPE.SELECTION,
    },
  ],
};

export default interviewApplyedStudent;
