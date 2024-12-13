import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // Redux 사용
import { useNavigate } from "react-router-dom"; // 페이지 이동
import challengeService from '../../services/challengeService'
import '../../pages/challenge/Challenge.css'; // CSS 파일 가져오기
import Navsidebar from "../../components/Navsidebar";


const Challenge = () => {
  const [challenges, setChallenges] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const currentUser = useSelector((state) => state.user); // 현재 로그인된 사용자 정보
  const navigate = useNavigate(); // 페이지 이동 함수


  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const data = await challengeService.getChallenges();
  
        // 필터링: 공개 글 또는 작성자가 현재 사용자와 동일한 비공개 글만 포함
        const filteredData = data.filter(
          (challenge) =>
            challenge.isPublic || (currentUser && currentUser.username === challenge.username)
        );
  
        setChallenges(filteredData); // 필터링된 데이터를 상태에 설정
      } catch (error) {
        setErrorMessage("챌린지를 불러오는 중 문제가 발생했습니다.");
        console.error(error);
      } finally {
        setLoading(false); // 로딩 상태 변경
      }
    };
  
    fetchChallenges();
  }, [currentUser]); // currentUser가 변경될 때만 useEffect 실행
  
  const calculateDaysLeft = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0; // 남은 날짜가 음수일 경우 0 반환
  };

  const isUserChallenge = (challenge) => {
    if (!currentUser || !challenge) {
      return false;
    }
    return currentUser.username === challenge.username;
  };

  const handleJournalClick = (challenge) => {
    if (!currentUser || !challenge) {
        console.error("사용자 정보 또는 챌린지 정보가 없습니다.");
        return;
    }

    // 게시글 작성자와 현재 로그인 사용자가 같은지 확인
    if (currentUser.username === challenge.username) {
        navigate(`/journal/${challenge.id}`); // Journal 페이지로 이동
    } else {
        alert("해당 챌린지에 기록을 작성할 권한이 없습니다."); // 권한 없음 메시지
    }
};
  const handleChallengeClick = (Id) => {
    navigate(`/challengeread/${Id}`); // ChallengeRead 페이지로 이동
  };

  const handleCommentClick = (challengeId) => {
    navigate(`/comment/${challengeId}`); // Comment 페이지로 이동
  };

  return (
    <div className="challenge-list-container">
      <Navsidebar />
      {loading && <p className="loading-message">챌린지를 불러오는 중입니다...</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {!loading && challenges.length === 0 && <p>등록된 챌린지가 없습니다.</p>}
      {challenges.map((challenge) => (
        <div
          key={challenge.id}
          className="challenge-container"
          onClick={() => handleChallengeClick(challenge.id)} // ChallengeRead로 이동
        >
          {/* 챌린지 헤더 */}
          <div className="challenge-header">
            <span className="challenge-user">
              <h4>{challenge.name}님의 <strong>onepointup</strong>!</h4>
            </span>
            <span className="challenge-title">제목:{challenge.title}</span>
             {/* 챌린지 설명 */}
          <div className="challenge-description">내용:{challenge.description}</div>
         {/* 진행률 바 및 달성률 */}
         <div className="challenge-progress">
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${challenge.progress || 0}%` }} // 기본값 0% 처리
            ></div>
          </div>
          <div className="progress-text">
            {challenge.progress !== undefined ? `${challenge.progress}% 달성` : "달성률 없음"}
          </div>
        </div>
        
        <span className="challenge-days">
          Day - {calculateDaysLeft(challenge.endDate)}
        </span>
      </div>

      {/* 챌린지 추가 버튼 */}
      <div className="challenge-actions">
        {isUserChallenge(challenge) && (
          <button
            className="record-button"
            onClick={(e) => {
              e.stopPropagation(); // 부모의 클릭 이벤트 막기
              handleJournalClick(challenge);
            }}
          >
            기록하기
          </button>
        )}
        <button
          className="cheer-button"
          onClick={(e) => {
            e.stopPropagation(); // 부모의 클릭 이벤트 막기
            handleCommentClick(challenge.id);
          }}
        >
          응원댓글남기기
        </button>
      </div>
    </div>
  ))}
</div>
  );
};

export default Challenge;
