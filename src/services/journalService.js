import axios from "axios";
import { BASE_API_URL } from "../common/constants";
import { authHeader } from "./base.service";

const API_URL = `${BASE_API_URL}/api/journals`;

class JournalService {
  // Journal 생성
  async createJournal(journalData) {
    console.log(journalData)
    console.log("Auth Header:", authHeader());
    try {
      const response = await axios.post(API_URL, journalData, { headers: authHeader() });
      console.log("Journal created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating journal:", error);
      throw error;
    }
  }

  // 특정 Challenge의 Journal 목록 가져오기
  async getJournalsByChallengeId(challengeId) {
    try {
      const response = await axios.get(`${API_URL}/challenge/${challengeId}`, { headers: authHeader() });
      console.log("Journals fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching journals for challenge ID ${challengeId}:`, error);
      throw error;
    }
  }

  // Journal ID로 특정 Journal 가져오기
  async getJournalById(journalId) {
    try {
      const response = await axios.get(`${API_URL}/${journalId}`, { headers: authHeader() });
      console.log("Journal fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching journal with ID ${journalId}:`, error);
      throw error;
    }
  }

  // Journal 삭제
  async deleteJournal(journalId) {
    try {
      const response = await axios.delete(`${API_URL}/${journalId}`, { headers: authHeader() });
      console.log("Journal deleted successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error deleting journal with ID ${journalId}:`, error);
      throw error;
    }
  }
}

const journalService = new JournalService();
export default journalService;
