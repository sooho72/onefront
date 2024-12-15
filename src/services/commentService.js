// src/services/commentService.js

import axios from "axios";
import { BASE_API_URL } from "../common/constants";
import { authHeader } from "./base.service"; // authHeader 가져오기

// API_URL을 '/api/comments'로 설정
const API_URL = `${BASE_API_URL}/api/comments`;

class CommentService {
    /**
     * 특정 챌린지에 속한 모든 댓글을 가져옵니다.
     * @param {number} challengeId - 댓글을 가져올 챌린지의 ID
     * @returns {Promise} - Axios 응답 프로미스
     */
    getCommentsByChallengeId(challengeId) {
        // API_URL을 사용하여 요청 URL 구성
        return axios.get(`${API_URL}/challenge/${challengeId}`, {
            headers: authHeader()
        });
    }

    /**
     * 새로운 댓글을 추가합니다.
     * @param {Object} commentData - 추가할 댓글의 데이터
     * @param {number} commentData.challengeId - 댓글이 속할 챌린지의 ID
     * @param {string} commentData.content - 댓글 내용
     * @returns {Promise} - Axios 응답 프로미스
     */
    addComment(commentData) {
        // API_URL을 사용하여 요청 URL 구성
        return axios.post(`${API_URL}`, commentData, {
            headers: {
                ...authHeader(),
                "Content-Type": "application/json", // JSON 데이터 전송
            },
        });
    }

    /**
     * 특정 댓글을 삭제합니다.
     * @param {number} commentId - 삭제할 댓글의 ID
     * @returns {Promise} - Axios 응답 프로미스
     */
    deleteComment(commentId) {
        // API_URL을 사용하여 요청 URL 구성
        return axios.delete(`${API_URL}/${commentId}`, {
            headers: authHeader()
        });
    }
}

// 서비스의 인스턴스를 생성하여 export
export default new CommentService();
