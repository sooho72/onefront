import React, { useEffect, useState } from "react";
import Navsidebar from "../../components/Navsidebar"; // 사이드바 추가
import "./ChallengeRegister.css";
import Challenge from "../../models/Challenge"; // Challenge 모델 가져오기
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { challengeRegisterService } from "../../services/challengeRegisterService";


const ChallengeRegister = () => {
  const [title, setTitle] = useState(""); // 챌린지 제목
  const [description, setDescription] = useState(""); // 챌린지 설명
  const [startDate, setStartDate] = useState(""); // 시작 날짜
  const [endDate, setEndDate] = useState(""); // 종료 날짜
  const [isPublic, setIsPublic] = useState("public"); // 공개 여부
  const [errorMessage, setErrorMessage] = useState("");
  const currentUser = useSelector((state) => state.user); // Redux에서 현재 사용자 정보 가져오기
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || !currentUser.id) {
      setErrorMessage("로그인이 필요합니다. 로그인 후 다시 시도하세요.");
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !startDate || !endDate) {
      setErrorMessage("모든 필드를 입력해야 합니다.");
      return;
    }

    const challengeData = {
      user: { id: currentUser.id }, // 유저 ID를 포함해 백엔드로 전달
      title,
      description,
      startDate,
      endDate,
      isPublic: isPublic === "public",
      isCompleted: false, 
    };

    try {
      await challengeRegisterService.createChallenge(challengeData); // Updated method call
      navigate("/challenge");
    } catch (error) {
      console.error("Error creating challenge:", error);
      setErrorMessage("챌린지 등록 중 문제가 발생했습니다.");
    }
  };

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setIsPublic("public");
    setErrorMessage("");
  };

  return (
    <div className="challenge-page-side">
      <Navsidebar />
      <div className="challenge-form-side">
        <h1>챌린지 작성</h1>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group-side">
            <label>타이틀 입력</label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="챌린지 제목을 입력하세요"
              required
            />
          </div>
          <div className="input-group-side">
            <label>챌린지 내용 입력</label>
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="챌린지 내용을 입력하세요"
              required
            ></textarea>
          </div>
          <div className="input-group-side">
            <label>시작일 / 종료일</label>
            <input
              type="date"
              name="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <input
              type="date"
              name="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div className="input-group-side">
            <label>공개 / 비공개</label>
            <select
              name="isPublic"
              value={isPublic}
              onChange={(e) => setIsPublic(e.target.value)}
            >
              <option value="public">공개</option>
              <option value="private">비공개</option>
            </select>
          </div>
          <div className="button-group-side">
            <button
              type="button"
              className="cancel-button-side"
              onClick={handleReset}
            >
              작성 취소
            </button>
            <button type="submit" className="submit-button-side">
              작성 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChallengeRegister;
