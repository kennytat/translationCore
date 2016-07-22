module.exports = {
  CHANGE_UPLOAD_MODAL_VISIBILITY: "CHANGE_UPLOAD_MODAL_VISIBILITY",
  CHANGE_LOGIN_MODAL_VISIBILITY:"CHANGE_LOGIN_MODAL_VISIBILITY",
  ADD_TO_TEXT: "ADD_TO_TEXT",
  SETTINGS_VIEW: "SETTINGS_VIEW",
  ACCOUNT_LOGIN: "ACCOUNT_LOGIN",
  CHANGE_BUTTTON_STATUS: "CHANGE_BUTTTON_STATUS",
  CREATE_PROJECT: "CREATE_PROJECT",
  CHANGE_CREATE_PROJECT_TEXT: "CHANGE_CREATE_PROJECT_TEXT",
  SEND_FETCH_DATA: "SEND_FETCH_DATA",
  SEND_PROGRESS_FOR_KEY: "SEND_PROGRESS_FOR_KEY",
  DONE_LOADING: "DONE_LOADING",
  CHANGE_LOGOUT_VISIBILITY: "CHANGE_LOGOUT_VISIBILITY",
  CHANGE_PROFILE_VISIBILITY:"CHANGE_PROFILE_VISIBILITY"
};

/**
Object that maps words to consts for use in actions
For example, in a register callback in a Store, it is recommended
that when you check the action type, you do it in the following manner:
var consts = require("CoreActionConsts.js");
...
if (action == consts.ADD_CHECK)
rather than
if (action == "ADD_CHECK")

*/
