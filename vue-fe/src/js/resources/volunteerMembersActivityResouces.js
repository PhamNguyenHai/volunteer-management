import MisaEnums from "../helpers/enums";

const volunteerMembersActivityResources = {
  objectId: "studentCode",
  resources: [
    {
      title: "Mã SV",
      columnKey: "studentCode",
      align: "left",
      width: 120,
      columnType: "text",
      filterType: MisaEnums.FILTER_COLUMN_TYPE.TEXT_TYPE,
    },
    {
      title: "Họ tên",
      columnKey: "studentName",
      align: "left",
      width: 220,
      columnType: "text",
      filterType: MisaEnums.FILTER_COLUMN_TYPE.TEXT_TYPE,
    },
    {
      title: "Lớp",
      columnKey: "className",
      width: 130,
      align: "left",
      columnType: "text",
      filterType: MisaEnums.FILTER_COLUMN_TYPE.TEXT_TYPE,
    },
    {
      title: "SĐT",
      columnKey: "phoneNumber",
      width: 150,
      align: "left",
      columnType: "text",
      filterType: MisaEnums.FILTER_COLUMN_TYPE.TEXT_TYPE,
    },
    {
      title: "Email",
      columnKey: "email",
      width: 150,
      align: "left",
      columnType: "text",
      filterType: MisaEnums.FILTER_COLUMN_TYPE.TEXT_TYPE,
    },
  ],
};

export default volunteerMembersActivityResources;
