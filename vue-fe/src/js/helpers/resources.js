const MisaResources = {
  validateErrorMessages: {
    emptyValue: "Trường này không được phép để trống !",
    invalidEmail: "Email Không hợp lệ !",
    invalidEmployeeCode: "Mã nhân viên sai định dạng !",
    numberOnly: "Vui lòng chỉ nhập số !",
    invalidIdentityNumber: "Số CMND/CCCD không hợp lệ !",
    invalidPhoneNumber: "Số điện thoại không hợp lệ !",
    notMoreThanCurrentDate: "Ngày nhập vào không được lớn hơn ngày hiện tại !",
    notLessThanCurrentDate: "Ngày nhập vào không được nhỏ hơn ngày hiện tại !",
    maxLength: (max) => `Trường này chỉ được phép nhập tối đa ${max} kí tự`,
  },

  errorHandle: {
    invalidPostData: "Dữ liệu gửi lên không hợp lệ.",
    notFoundError: "Không tìm thấy tài nguyên.",
    serveError: "Có lỗi xảy ra, vui lòng liên hệ để được giúp đỡ !",
  },

  appText: {
    softwareName: "TÌNH NGUYỆN",
    headingTitle: "ĐỘI THANH NIÊN TÌNH NGUYỆN - KHOA CÔNG NGHỆ THÔNG TIN",
    currentUserName: "Phạm Nguyễn Nguyên Hải",
    selectedCount: "Đã chọn : ",
    totalCount: "Tổng số : ",
    records: "bản ghi",
    nextPage: "Sau",
    previousPage: "Trước",
    sidebarShrinkTitle: "Thu gọn",
    emptyDataImage: "Không có dữ liệu",

    activityPageText: {
      sidebarTitle: "Hoạt động",
      pageTitle: "Quản lý hoạt động",
    },

    purchasePageText: {
      sidebarTitle: "Mua hàng",
      pageTitle: "Trang Mua hàng",
    },

    salePageText: {
      sidebarTitle: "Bán hàng",
      pageTitle: "Trang Bán hàng",
    },

    managementPageText: {
      sidebarTitle: "Quản lý hóa đơn",
      pageTitle: "Trang Quản lý hóa đơn",
    },

    taxPageText: {
      sidebarTitle: "Thuế thu nhập",
      pageTitle: "Trang Thuế thu nhập",
    },
  },

  buttons: {
    unselectedAll: "Bỏ chọn",
    delete: "Xóa tất cả",
    addEmployee: "Thêm mới nhân viên",
    cancel: "Hủy",
    save: "Cất",
    saveAndAdd: "Cất và Thêm",
    no: "Không",
    yes: "Có",
    agree: "Đồng ý",
    close: "Đóng",
  },

  filterType: {
    textFilter: {
      startWith: "Bắt đầu với",
      endWith: "Kết thúc với",
      contain: "Chứa",
      notContain: "Không chứa",
      equals: "Bằng",
      notEquals: "Không bằng (Khác)",
    },
    comparisionFilter: {
      greater: "Lớn hơn ( > )",
      less: "Nhỏ hơn ( < )",
      greaterOrEquals: "Lớn hơn hoặc bằng ( ≥ )",
      lessOrEquals: "Nhỏ hơn hoặc bằng ( ≤ )",
      equals: "Bằng ( = )",
      notEquals: "Không bằng ( ≠ )",
    },
    selectionFilter: {
      equals: "Bằng",
      notEquals: "Không bằng (Khác)",
    },
  },

  filterPopup: {
    tooltipForFilterIcon: "Lọc dữ liệu",
    filterPopupHeading: "Điều kiện lọc",
    filterCancelButton: "Bỏ lọc",
    filterApplyButton: "Áp dụng",
    inputValue: "Nhập giá trị",
  },

  tableFunctions: {
    title: "Chức năng",
    edit: "Sửa",
    duplicate: "Nhân bản",
    delete: "Xóa",
    disable: "Ngưng sử dụng",
  },

  formText: {
    employeeForm: {
      addFormTitle: "Thêm mới nhân viên",
      editFormTitle: "Sửa thông tin nhân viên",
      isCustomer: "Là khách hàng",
      isProvider: "Là nhà cung cấp",
      employeeCode: "Mã",
      employeeName: "Tên",
      dateOfBirth: "Ngày sinh",
      gender: {
        genderTitle: "Giới tính",
        male: "Nam",
        female: "Nữ",
        other: "Khác",
      },
      department: "Đơn vị",
      position: "Chức danh",
      identityNumber: {
        title: "Số CCCD",
        tooltip: "Số căn cước công dân",
      },
      identityIssuedDate: "Ngày cấp",
      identityIssuedPlace: "Nơi cấp",
      address: "Địa chỉ",
      phoneNumber: {
        title: "ĐT di động",
        tooltip: "Điện thoại di động",
      },
      landlinePhone: {
        title: "ĐT cố định",
        tooltip: "Điện thoại cố định",
      },
      email: "Email",
      bankNumber: "Tài khoản ngân hàng",
      bankName: "Tên ngân hàng",
      bankBranch: "Chi nhánh",
    },
  },

  dialogText: {
    heading: {
      notify: "Thông báo",
      warning: "Cảnh báo",
      confirm: "Xác nhận",
    },
  },

  toastTitle: {
    success: "Thành công !",
    warning: "Cảnh báo !",
    infor: "Thông tin !",
    error: "Lỗi !",
  },

  datePicker: {
    weekdays: {
      monday: "T2",
      tuesday: "T3",
      wednesday: "T4",
      thursday: "T5",
      friday: "T6",
      saturday: "T7",
      sunday: "CN",
    },
    months: {
      january: "Tháng 1",
      february: "Tháng 2",
      march: "Tháng 3",
      april: "Tháng 4",
      may: "Tháng 5",
      june: "Tháng 6",
      july: "Tháng 7",
      august: "Tháng 8",
      september: "Tháng 9",
      october: "Tháng 10",
      november: "Tháng 11",
      december: "Tháng 12",
    },
    today: "Hôm nay",
  },

  dataFormat: {
    gender: {
      male: "Nam",
      female: "Nữ",
      another: "Khác",
    },
  },
};

export default MisaResources;
