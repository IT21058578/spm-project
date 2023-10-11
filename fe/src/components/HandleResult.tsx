// import React, { useEffect } from "react";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import {setItem} from "../Utils/Generals";
// import { useNavigate } from "react-router-dom";
// import RoutePaths from "../config";

// export const HandleResult = ({result} : {result : any}) => {

//     const navigate = useNavigate()

//     useEffect(() => {

//         result.isError && toast.error((result.error as any).data?.message);

//         if(result.isSuccess) {

//             if (RoutePaths.token in result.data?.data) {

//                 setItem(RoutePaths.token, result.data?.data._token);
//                 setItem('user', result.data?.data.user);
//                 navigate(result.data?.data.user.admin ? RoutePaths.admin : RoutePaths.userAccount);
//             }
//             toast.success(result.data?.message);
//         }

//     }, [result]);

//     let content : React.ReactNode = null;

//     if (result.isError && result.error?.data) {
//         content = <div>
//             {result.error.data?.errors.map((err : string) => (
//                 <div key={err} className='fw-bold'>
//                     <i className='bi bi-x text-danger'>{err}</i>
//                 </div>
//             ))}
//         </div>

//     }

//     return <><ToastContainer />{content}</>;
// }

import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setItem } from "../Utils/Generals";
import { useNavigate } from "react-router-dom";
import RoutePaths from "../config";
import { useAppDispatch } from "../hooks/redux-hooks";
import { setUser } from "../store/userSlice";

export const HandleResult = ({ result }: { result: any }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

  useEffect(() => {
    if (result.isError) {
      // Handle error response
      toast.error(result.error.message || "An error occurred.");
    } else if (result.isSuccess) {
      // Handle success response
      const responseData = result.data;

      if (responseData.tokens && responseData.user) {
        // Assuming responseData.tokens.accessToken contains the access token
        setItem(RoutePaths.token, responseData.tokens.accessToken);

        // Assuming responseData.user contains the user data
          setItem("user", responseData.user);
          dispatch(setUser(responseData.user));

        // Redirect to the appropriate route based on user data
        navigate(
          responseData.user.roles.includes("ADMIN")
            ? RoutePaths.admin
            : RoutePaths.userAccount
        );
      } else {
        // Handle invalid response data
        toast.error("Invalid response data.");
      }

      toast.success(responseData.message || "Login successful.");
    }
  }, [result]);

  return (
    <>
      <ToastContainer />
    </>
  );
};
