import { CLEAR_CURRENT_USER,SET_CURRENT_USER } from "../types";

const setCurrentUser = (user) =>{
    return {
        type: SET_CURRENT_USER,
        payload:user 
    }
}
const clearCurrentUser = () =>{
    return {
        type: CLEAR_CURRENT_USER
    }
}
export {setCurrentUser,clearCurrentUser}