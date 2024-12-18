import axios from "axios";
import { BASE_API_URL } from "../common/constants";
import { authHeader } from "./base.service";

const API_URL = BASE_API_URL + "/api/users";

class UserService {
    // 역할 변경
    changeRole(role) {
        return axios.put(`${API_URL}/change/${role}`, {}, { headers: authHeader() });
    }
    //이름 변경
    updateUserName(username, newName) {
        return axios.put(
            `${API_URL}/update-name`, 
            { username, name: newName }, 
            { headers: authHeader() }
        );
    }

    // 프로필 이미지 업로드
    uploadProfileImage(username, file) {
        const formData = new FormData();
        formData.append("username", username); // 백엔드에서 username 필요
        formData.append("file", file); // 업로드할 파일

        return axios.put(`${API_URL}/profile-image`, formData, {
            headers: {
                ...authHeader(),
                "Content-Type": "multipart/form-data", // 파일 업로드
            },
        });
    }

    // 사용자 정보 가져오기
    getUserInfo(username) {
        return axios.get(`${API_URL}/profile`, { headers: authHeader() });
    }

    // 프로필 이미지 가져오기
    getProfileImage(username) {
        return axios.get(`${API_URL}/profile-image/${username}`, {
            headers: authHeader(),
            responseType: "blob", // 바이너리 데이터 처리
        });
    }
}

const userService = new UserService();
export default userService;
