import { CLEAR_CURRENT_USER, SET_CURRENT_USER } from "../types";


const userReducer=(state={}, action) => {
    switch (action?.type) {
        case SET_CURRENT_USER: //SET_CURRENT_USER => 로컬저장소에 유저정보(payload)를 저장하고 유저정보를 업데이트
            localStorage.setItem('currentUser',JSON.stringify(action?.payload));
            return action?.payload;
        case CLEAR_CURRENT_USER: //CLEAR_CURRENT_USER => 유저정보를 로컬저장소에서 제거하고 null 값으로 업데이트
            localStorage.removeItem("currentUser");
            return null;
        default: //액션타입의 값이 없을 경우 디폴트 => 로컬저장소에 저장된 유저정보를 가져옴(캐싱된 데이터)
            return JSON.parse(localStorage.getItem('currentUser'))
    }
};
export default userReducer;