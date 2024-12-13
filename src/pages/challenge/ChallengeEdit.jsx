import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // URL 파라미터 및 페이지 이동
import challengeService from '../../services/challengeService'; // 서비스 모듈
import '../../pages/challenge/ChallengeEdit.css'; // 스타일 파일 추가

const ChallengeEdit = () => {
  const { id } = useParams(); // URL에서 챌린지 ID 가져오기
  const navigate = useNavigate(); // 페이지 이동 함수

  const [challenge, setChallenge] = useState({
    title: "",
    description: "",
    endDate: "",
    progress: 0,
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const data = await challengeService.getChallengeById(id);
        setChallenge(data);
      } catch (error) {
        setErrorMessage("챌린지 정보를 불러오는 중 문제가 발생했습니다.");
      }
    };

    fetchChallenge();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChallenge((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await challengeService.updateChallenge(id, challenge);
      navigate(`/challengeread/${id}`);
    } catch (error) {
      setErrorMessage("챌린지를 수정하는 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="challenge-edit-container">
      <h2>챌린지 수정하기</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="challenge-edit-form">
        <div className="form-group">
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            name="title"
            value={challenge.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">내용</label>
          <textarea
            id="description"
            name="description"
            value={challenge.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="endDate">종료 날짜</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={challenge.endDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="progress">진행률 (%)</label>
          <input
            type="number"
            id="progress"
            name="progress"
            value={challenge.progress}
            onChange={handleChange}
            min="0"
            max="100"
          />
        </div>
        <button type="submit" className="submit-button">수정 완료</button>
        <button
          type="button"
          className="cancel-button"
          onClick={() => navigate(`/challengeread/${id}`)}
        >
          취소
        </button>
      </form>
    </div>
  );
};

export default ChallengeEdit;
