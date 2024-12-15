import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import challengeService from "../../services/challengeService";
import CommentModal from "../../components/CommentModal";
import "../challenge/ChallengeMe.css"

const ChallengeMe = () => {
  const [myChallenges, setMyChallenges] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedChallengeId, setSelectedChallengeId] = useState(null); // 선택된 챌린지 ID
  const [showModal, setShowModal] = useState(false); // 모달 상태
  const currentUser = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyChallenges = async () => {
      try {
        if (currentUser?.username) {
          const data = await challengeService.getMyChallenges(currentUser.username);
          setMyChallenges(data);
        } else {
          setErrorMessage("로그인이 필요합니다.");
        }
      } catch (error) {
        setErrorMessage("챌린지를 불러오는 중 문제가 발생했습니다.");
        console.error(error);
      }
    };

    fetchMyChallenges();
  }, [currentUser]);

  const handleChallengeClick = (id) => {
    navigate(`/challengeread/${id}`);
  };

  // 댓글 버튼 클릭 시
  const handleCommentClick = (challengeId) => {
    setSelectedChallengeId(challengeId);
    setShowModal(true);
  };

  return (
    <div className="challenge-me-container">
      <div className="challenge-me-header">
        <h1>나의 챌린지</h1>
      </div>
      {errorMessage && <div className="challenge-me-alert">{errorMessage}</div>}
      {myChallenges.length === 0 && !errorMessage && (
        <p className="challenge-me-empty">등록된 챌린지가 없습니다.</p>
      )}
      <div className="challenge-me-list-container">
        <ul className="challenge-me-list">
          {myChallenges.map((challenge) => (
            <li key={challenge.id} className="challenge-me-item">
              <div onClick={() => handleChallengeClick(challenge.id)}>
                <strong>제목:</strong> {challenge.title} <br />
                <strong>내용:</strong> {challenge.description} <br />
                <strong>달성률:</strong> {challenge.progress}% <br />
                <strong>공개 여부:</strong> {challenge.isPublic ? "공개" : "비공개"} <br />
                <strong>기간:</strong>{" "}
                {new Date(challenge.startDate).toLocaleDateString()} ~{" "}
                {new Date(challenge.endDate).toLocaleDateString()}
              </div>
              <button
                className="comment-button"
                onClick={() => handleCommentClick(challenge.id)}
              >
                응원댓글
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 댓글 모달 */}
      <CommentModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        challengeId={selectedChallengeId}
        currentUser={currentUser}
        onCommentAdded={() => console.log("댓글이 추가되었습니다.")}
      />
    </div>
  );
};

export default ChallengeMe;
