import axios from "axios";
import { BASE_API_URL } from "../common/constants";
import { authHeader } from "./base.service";

const API_URL = `${BASE_API_URL}/api/challenges/register`;


const createChallenge = async (challengeData) => {
  try {
    const response = await axios.post(API_URL, challengeData, {
      headers: {
        ...authHeader(),
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("챌린지 생성 중 오류 발생:", error);
    throw error;
  }
};



export const challengeRegisterService = {
  createChallenge,
};
