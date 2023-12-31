import MisaEnums from "../helpers/enums";

const interviewApplyedStudent = {
  objectId: "activityCode",
  resources: [
    {
      title: "Mã hoạt động",
      columnKey: "activityCode",
      align: "left",
      width: 150,
      columnType: "text",
      filterType: MisaEnums.FILTER_COLUMN_TYPE.TEXT_TYPE,
    },
    {
      title: "Tên hoạt động",
      columnKey: "activityName",
      align: "left",
      width: 150,
      columnType: "text",
      filterType: MisaEnums.FILTER_COLUMN_TYPE.TEXT_TYPE,
    },
    {
      title: "Ngày bắt đầu",
      columnKey: "beginingDate",
      align: "left",
      width: 120,
      columnType: "text",
      formatType: MisaEnums.FORMAT_TYPE.DATE_FOR_FE,
      filterType: MisaEnums.FILTER_COLUMN_TYPE.TEXT_TYPE,
    },
    {
      title: "Người quản lý",
      columnKey: "manager",
      align: "left",
      width: 150,
      columnType: "text",
      filterType: MisaEnums.FILTER_COLUMN_TYPE.TEXT_TYPE,
    },
    {
      title: "Kinh phí hỗ trợ",
      columnKey: "supportMoney",
      width: 130,
      align: "left",
      columnType: "selection",
      filterType: MisaEnums.FILTER_COLUMN_TYPE.SELECTION,
    },
    {
      title: "Mô tả hoạt động",
      columnKey: "description",
      width: 180,
      align: "left",
      columnType: "selection",
      filterType: MisaEnums.FILTER_COLUMN_TYPE.SELECTION,
    },
    {
      title: "Số thành viên",
      columnKey: "numOfParticipant",
      width: 100,
      align: "left",
      columnType: "selection",
      filterType: MisaEnums.FILTER_COLUMN_TYPE.SELECTION,
    },
    {
      title: "Số sao",
      columnKey: "averageRating",
      width: 90,
      align: "left",
      columnType: "selection",
      filterType: MisaEnums.FILTER_COLUMN_TYPE.SELECTION,
    },
  ],
};

export default interviewApplyedStudent;
