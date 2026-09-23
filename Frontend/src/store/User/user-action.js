import {userActions} from "./user-slice";
import {axiosInstance} from "../../utils/axios";

//signup
export const getSignup = (user) => async(dispatch)=>{
    try{
        dispatch(userActions.getSignupRequest());
        const {data} = await axiosInstance.post("/v1/rent/user/signup", user);
        dispatch(userActions.getSignupDetails(data.user))
    }catch(error){
     dispatch(userActions.getError(error.response?.data?.message || error.message))
    }
}

//login
export const getLogin=(user) => async(dispatch) =>{
    try{
    dispatch(userActions.getLoginRequest());
    const {data} = await axiosInstance.post("/v1/rent/user/login", user);
    dispatch(userActions.getLoginDetails(data.user))
    }catch(error){
      dispatch(userActions.getError(error.response?.data?.message || error.message))
    }
}

export const currentUser =() => async(dispatch) =>{
    try{
     dispatch(userActions.getCurrentRequest());
     const {data} = await axiosInstance.get("/v1/rent/user/me");
     dispatch(userActions.getCurrentUser(data.user))
    }catch{
        dispatch(userActions.getLogout(null));
    }
}

export const updateUser = (updateUser) => async(dispatch)=>{
    try{
    dispatch(userActions.getUpdateUserRequest());
    const response = await axiosInstance.patch("/v1/rent/user/updateMe", updateUser);
    console.log(response)
    const {data} = await axiosInstance.get("/v1/rent/user/me")
    dispatch(userActions.getCurrentUser(data.user));
    }catch(error){
       dispatch(userActions.getError(error.response?.data?.message || error.message))
    }
}

export const forgotPassword = (email) => async (dispatch) => {
  try {
    const { data } = await axiosInstance.post("/v1/rent/user/forgotPassword", { email });
    return data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Unable to send reset email";
    dispatch(userActions.getError(message));
    throw error;
  }
}

export const resetPassword = (repassword, token) => async (dispatch) => {
  try {
    const { data } = await axiosInstance.patch(
      `/v1/rent/user/resetPassword/${token}`,
      repassword
    );
    return data;
  } catch (error) {
    const message = error.response?.data?.message || error.response?.data?.error || error.message || "Unable to reset password";
    dispatch(userActions.getError(message));
    throw error;
  }
}

export const updatePassword =(passwords) => async (dispatch)=>{
    try{
        dispatch(userActions.getPasswordRequest());
        await axiosInstance.patch("/v1/rent/user/updateMyPassword",passwords)
         dispatch(userActions.getPasswordSuccess(true))
    }catch(error){
         dispatch(userActions.getError(error.response?.data?.message || error.message))
    }
}

export const logout =()=> async(dispatch)=>{
    try{
     await axiosInstance.get("/v1/rent/user/logout")
     dispatch(userActions.getLogout(null));
    }catch(error){
         dispatch(userActions.getError(error.response?.data?.message || error.message))
    }
};