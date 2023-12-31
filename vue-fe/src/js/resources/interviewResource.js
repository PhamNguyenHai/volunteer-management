import MisaEnums from "../helpers/enums";

const interviewResources = {
  objectId: "interviewCode",
  resources: [
    {
      title: "Mã phỏng vấn",
      columnKey: "interviewCode",
      align: "left",
      width: 150,
      columnType: "text",
      filterType: MisaEnums.FILTER_COLUMN_TYPE.TEXT_TYPE,
    },
    {
      title: "Ngày phỏng vấn",
      columnKey: "interviewDate",
      align: "left",
      width: 200,
      columnType: "date",
      formatType: MisaEnums.FORMAT_TYPE.DATE_FOR_FE,
      filterType: MisaEnums.FILTER_COLUMN_TYPE.TEXT_TYPE,
    },
    {
      title: "Phòng",
      columnKey: "interviewRoom",
      align: "left",
      width: 200,
      columnType: "text",
      filterType: MisaEnums.FILTER_COLUMN_TYPE.TEXT_TYPE,
    },
    {
      title: "Số lượng",
      columnKey: "quantityMax",
      width: 150,
      align: "left",
      columnType: "selection",
      filterType: MisaEnums.FILTER_COLUMN_TYPE.SELECTION,
    },
    {
      title: "Đã đăng ký",
      columnKey: "quantity",
      width: 150,
      align: "left",
      columnType: "selection",
      filterType: MisaEnums.FILTER_COLUMN_TYPE.SELECTION,
    },
    {
      title: "Trạng thái",
      columnKey: "deletedAt",
      width: 230,
      align: "left",
      columnType: "selection",
      formatType: MisaEnums.FORMAT_TYPE.SOFT_DELETE,
      filterType: MisaEnums.FILTER_COLUMN_TYPE.SELECTION,
    },
  ],
};

export default interviewResources;
