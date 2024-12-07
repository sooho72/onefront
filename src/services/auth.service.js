import axios from "axios";
import { BASE_API_URL } from "../common/constants";

const BASE_URL = BASE_API_URL + '/api/authentication';
// 로그인는 누구나 들어갈수있기에
const loginService = (user) => {
    return axios.post (BASE_URL + '/sign-in', user);
} 
//회원가입요청 
const registerService =(user)=>{
    return axios.post (BASE_URL + '/sign-up', user);
}
//외부에 쓸수있도로 export 두가지이상은 {1,2}
export {loginService, registerService}
