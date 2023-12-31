const MisaEnums = {
  SORT_TYPE: {
    ASC: 1,
    DESC: 2,
  },
  FORM_MODE: {
    ADD: 0,
    EDIT: 1,
    DUPLICATE: 2,
  },
  FORM_SUBMIT_MODE: {
    SAVE: 0,
    SAVE_ADD: 1,
  },
  ROW_MODE: {
    EDIT: 0,
    DUPLICATE: 1,
    DELETE: 2,
    RATING: 3,
    REUSING: 4,
  },
  GENDER: {
    MALE: 0,
    FEMALE: 1,
    ORTHER: 2,
  },
  PAGE_TYPE: {
    PREVIOUS: 0,
    PAGE_NUMBER: 1,
    NEXT: 2,
  },
  FORMAT_TYPE: {
    GENDER: 0,
    DATE_FOR_FE: 1,
    SOFT_DELETE: 2,
    STUDENT_VOLUNTEER_STATUS: 3,
    INTERVIEW_RESULT: 4,
    VOLUNTEER_RATING: 5,
  },
  DIALOG_TYPE_BUTTON: {
    NOTIFY: 0,
    ONE_BUTTON: 1,
    TWO_BUTTONS: 2,
    THREE_BUTTONS: 3,
  },
  DIALOG_RESPONSE: {
    NO: 0,
    YES: 1,
  },
  CONFIRM_ACTION: {
    CLOSE: 0,
    DELETE: 1,
    DELETE_MANY: 2,
  },
  FILTER_COLUMN_TYPE: {
    TEXT_TYPE: 0,
    COMPARABLE_TYPE: 1,
    SELECTION: 2,
  },
  TEXT_FILTER_OPTION: {
    START_WITH: 0,
    END_WITH: 1,
    CONTAIN: 2,
    NOT_CONTAIN: 3,
    EQUALS: 4,
    NOT_EQUALS: 5,
  },
  COMPARISON_FILTER_OPTION: {
    GREATER: 0,
    LESS: 1,
    GREATER_OR_EQUALS: 2,
    LESS_OR_EQUALS: 3,
    EQUALS: 4,
    NOT_EQUALS: 5,
  },
  SELECTION_FILTER_OPTION: {
    EQUALS: 0,
    NOT_EQUALS: 1,
  },

  SHORT_KEY: {
    ARROW_UP: 38,
    ARROW_DOWN: 40,
    ENTER: 13,
    S_KEY: 229,
  },

  LOGIN_ROLE: {
    ADMIN: 0,
    VOLUNTEER: 1,
  },

  TABLE_TYPE: {
    MANY_ROW_SELECTION: 0,
    ONE_ROW_SELECTION: 1,
    CUSTOM: 2,
  },
};

export default MisaEnums;
