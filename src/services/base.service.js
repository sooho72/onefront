import axios from "axios";
import { clearCurrentUser } from "../store/actions/user";
import store from "../store/configStore"

const authHeader=()=> {
    const currentUser=store.getState().user;
    return {
        'Content-Type':'application/json',
        'authorization':'Bearer '+currentUser?.token, //관리자가  물건등록할때 토큰백앤드로 줄때
    }
}
export {authHeader};