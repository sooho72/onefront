import React from "react";
import Navsidebar from "../../components/Navsidebar"; // 사이드바 추가
import "./ChallengeRegister.css";

const ChallengeRegister = () => {
  return (
    <div className="challenge-page-side">
      <Navsidebar />
      <div className="challenge-form-side">
        <h1>챌린지 작성</h1>
        <form>
          <div className="input-group-side">
            <label>타이틀 입력</label>
            <input type="text" placeholder="챌린지 제목을 입력하세요" />
          </div>
          <div className="input-group-side">
            <label>챌린지 내용 입력</label>
            <textarea placeholder="챌린지 내용을 입력하세요"></textarea>
          </div>
          <div className="input-group-side">
            <label>시작일 / 종료일</label>
            <input type="date" />
            <input type="date" />
          </div>
          <div className="input-group-side">
            <label>공개 / 비공개</label>
            <select>
              <option value="public">공개</option>
              <option value="private">비공개</option>
            </select>
          </div>
          <div className="button-group-side">
            <button className="cancel-button-side">작성 취소</button>
            <button className="submit-button-side">작성 완료</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChallengeRegister;
