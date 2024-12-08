import React from "react";
import "./Challenge.css";
import Challenge from "../../models/Challenge"; // Challenge 클래스 가져오기
import Navsidebar from "../../components/Navsidebar";

const ChallengeComponent = () => {
  // Challenge 클래스 인스턴스 생성
  const challenge = new Challenge(
    1, // id
    { username: "이지은" }, // user
    "한달동안 30분씩 책읽기", // title
    "매일 30분씩 책을 읽고 목표를 달성하세요!", // description
    "2024-12-01", // startDate
    "2024-12-31", // endDate
    50, // progress (진행률 %)
    false, // isCompleted (완료 여부)
    true // isPublic (공개 여부)
  );

  return (
    <div className="challenge-container">
      {/* 챌린지 헤더 */}
      <div className="challenge-header">
        <span className="challenge-user">
          {challenge.user.username}님의 <strong>onepointup</strong> →
        </span>
        <span className="challenge-title">{challenge.title}</span>
        <div className="challenge-progress">
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${challenge.progress}%` }}
            ></div>
          </div>
          <span className="challenge-days">
            {calculateDaysLeft(challenge.endDate)}일 남음
          </span>
        </div>
      </div>

      {/* 챌린지 설명 */}
      <div className="challenge-description">{challenge.description}</div>

      {/* 챌린지 추가 버튼 */}
      <div className="challenge-actions">
        <button className="record-button">참여하기</button>
        <button className="cheer-button">격려글쓰기</button>
      </div>
    </div>
  );
};

// 남은 날짜 계산 함수
const calculateDaysLeft = (endDate) => {
  const today = new Date();
  const end = new Date(endDate);
  const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0; // 남은 날짜가 음수일 경우 0 반환
};

export default ChallengeComponent;
