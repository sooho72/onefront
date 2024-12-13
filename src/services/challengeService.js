import axios from "axios";
import { BASE_API_URL } from "../common/constants";

const API_URL = `${BASE_API_URL}/api/challenges`;

class ChallengeService {
  
  async getChallengesForUser(username) {
    try {
      if (!username) throw new Error("Username is required");
      const url = `${API_URL}/user/${username}`;
      console.log("Fetching challenges for user:", username); // 디버깅 로그
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(`Error fetching challenges for user ${username}:`, error);
      throw error;
    }
  }
  
  async getChallenges() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching challenges:", error);
      throw error;
    }
  }

  async getChallengeById(challengeId) {
    try {
      const response = await axios.get(`${API_URL}/${challengeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching challenge with ID ${challengeId}:`, error);
      throw error;
    }
  }
  
  async getChallengeById(challengeId) {
    console.log(challengeId);
    try {

      if (!challengeId) throw new Error("Challenge ID is required");
      const url = `${API_URL}/${challengeId}`;
      console.log("Fetching challenge from URL:", url); // 디버깅 로그
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching challenge by ID:", error);
      throw error;
    }
  }
  // 삭제하기
  async deleteChallenge(challengeId) {
    try {
      if (!challengeId) throw new Error("Challenge ID is required");
      const url = `${API_URL}/${challengeId}`;
      console.log("Deleting challenge from URL:", url); // 디버깅 로그
      const response = await axios.delete(url);
      console.log("Challenge deleted successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error deleting challenge with ID ${challengeId}:`, error);
      throw error;
    }
  }

  // 수정하기
  async updateChallenge(challengeId, updatedChallenge) {
    try {
      if (!challengeId) throw new Error("Challenge ID is required");
      if (!updatedChallenge) throw new Error("Updated challenge data is required");
      const url = `${API_URL}/${challengeId}`;
      console.log("Updating challenge at URL:", url, updatedChallenge); // 디버깅 로그
      const response = await axios.put(url, updatedChallenge);
      console.log("Challenge updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating challenge with ID ${challengeId}:`, error);
      throw error;
    }
  }
  async getMyChallenges(username) {
    try {
      const response = await axios.get(API_URL);
      // 현재 사용자의 챌린지만 필터링
      const myChallenges = response.data.filter((challenge) => challenge.username === username);
      return myChallenges;
    } catch (error) {
      console.error(`Error fetching challenges for user ${username}:`, error);
      throw error;
    }
  }
}

const challengeService = new ChallengeService();
export default challengeService;