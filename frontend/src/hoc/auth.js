import Axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action";
export default function (SpecificComponent, option, adminRoute = null) {
  function AuthenticationCheck(props) {
    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(auth()).then((res) => {
        // option
        //null => 아무나 출입 가능
        //true => 로그인 한 사람만 출입 가능
        // false => 로그인한 사람 출입 불가
        console.log(res.payload);
        if (!res.payload.isAuth) {
          // 로그인 되지 않은 사람
          if (option) {
            // 로그인 필요 페이지 접근 시도
            props.history.push("/login");
          }
        } else {
          if (adminRoute && !res.payload.isAdmin) {
            props.history.push("/");
          } else {
            if (option === false) {
              console.log(res.payload.isAuth, option);
              props.history.push("/");
            }
          }
        }
      });
    }, []);
    return <SpecificComponent />;
  }
  return AuthenticationCheck;
}
