import axios from "axios";
import { BASE_API_URL } from "../common/constants";
import { authHeader } from "./base.service";

const API_URL_COMMENT_REPORT = `${BASE_API_URL}/api/report`; // 댓글 신고

const API_URL_ADMIN_REPORT = `${BASE_API_URL}/api/admin/reports`;   // 관리자 신고 조회

class ReportService {

    // 신고 생성 (모달 형식)
    async createReport(commentId, reason) {
        try {
            const reportDTO = { 
                commentId, 
                reason 
            };
            const response = await axios.post(API_URL_COMMENT_REPORT, reportDTO, { headers: authHeader() });
            return response.data;
        } catch (error) {
            console.error("Failed to create report:", error);
            throw error;
        }
    }
    
    // 모든 신고 조회 (관리자용)
    async getAllReports() {
        try {
            const response = await axios.get(`${API_URL_ADMIN_REPORT}`, { headers: authHeader() });
            console.log("Received reports:", response.data); // 디버그 로그 추가
            return response.data;
        } catch (error) {
            console.error("Failed to get all reports:", error);
            throw error;
        }
    }
}

const reportService = new ReportService();
export default reportService;