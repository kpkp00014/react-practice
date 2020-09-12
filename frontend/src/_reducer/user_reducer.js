import { AUTH_USER, LOGIN_USER, REGISTER_USER } from "../_actions/types";

export default function (prev = {}, action) {
  switch (action.type) {
    case LOGIN_USER:
      return { ...prev, loginSuccess: action.payload };
    case REGISTER_USER:
      return { ...prev, register: action.payload };
    case AUTH_USER:
      return { ...prev, userData: action.payload };
    default:
      return prev;
  }
}
