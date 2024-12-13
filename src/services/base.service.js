import axios from "axios";
import { clearCurrentUser } from "../store/actions/user";
import store from "../store/configStore";

const authHeader = () => {
    const currentUser = store.getState().user;

    if (!currentUser || !currentUser.token) {
        console.warn("No current user or token found in the store.");
        return {
            'Content-Type': 'application/json',
        };
    }

    return {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + currentUser.token, // 사용자 토큰 추가
    };
};

// 유효하지 않은 토큰이 있으면 로그아웃 처리 로직 추가 가능
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error("Unauthorized request, clearing user...");
            store.dispatch(clearCurrentUser());
        }
        return Promise.reject(error);
    }
);

export { authHeader };
