import MisaEnums from "../helpers/enums";

const interviewRegisterResources = {
  objectId: "interviewCode",
  resources: [
    {
      title: "Ngày phỏng vấn",
      columnKey: "interviewDate",
      align: "left",
      width: 260,
      columnType: "date",
      formatType: MisaEnums.FORMAT_TYPE.DATE_FOR_FE,
      filterType: MisaEnums.FILTER_COLUMN_TYPE.TEXT_TYPE,
    },
    {
      title: "Phòng",
      columnKey: "interviewRoom",
      align: "left",
      width: 210,
      columnType: "text",
      filterType: MisaEnums.FILTER_COLUMN_TYPE.TEXT_TYPE,
    },
    {
      title: "Số lượng",
      columnKey: "quantityMax",
      width: 170,
      align: "left",
      columnType: "selection",
      filterType: MisaEnums.FILTER_COLUMN_TYPE.SELECTION,
    },
    {
      title: "Trạng thái",
      columnKey: "quantity",
      width: 200,
      align: "left",
      columnType: "selection",
      filterType: MisaEnums.FILTER_COLUMN_TYPE.SELECTION,
    },
  ],
};

export default interviewRegisterResources;
