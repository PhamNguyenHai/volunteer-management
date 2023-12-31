import MisaEnums from "../helpers/enums";

const volunteerResources = {
  objectId: "studentCode",
  resources: [
    {
      title: "Mã SV",
      columnKey: "studentCode",
      align: "left",
      width: 230,
      columnType: "text",
      filterType: MisaEnums.FILTER_COLUMN_TYPE.TEXT_TYPE,
    },
    {
      title: "Họ tên",
      columnKey: "studentName",
      align: "left",
      width: 250,
      columnType: "text",
      filterType: MisaEnums.FILTER_COLUMN_TYPE.TEXT_TYPE,
    },
    {
      title: "Lớp",
      columnKey: "className",
      width: 220,
      align: "left",
      columnType: "text",
      filterType: MisaEnums.FILTER_COLUMN_TYPE.TEXT_TYPE,
    },
    {
      title: "SĐT",
      columnKey: "phoneNumber",
      width: 250,
      align: "left",
      columnType: "text",
      filterType: MisaEnums.FILTER_COLUMN_TYPE.TEXT_TYPE,
    },
    {
      title: "Email",
      columnKey: "email",
      width: 300,
      align: "left",
      columnType: "text",
      filterType: MisaEnums.FILTER_COLUMN_TYPE.TEXT_TYPE,
    },
  ],
};

export default volunteerResources;
