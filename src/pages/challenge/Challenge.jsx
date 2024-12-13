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
  
        // 필터링: 공개 글 + 비공개 글(작성자만)
        // const filteredData = data.filter(
          // (challenge) =>
            // challenge.isPublic || (currentUser && currentUser.username === challenge.username)
        //   challenge.isPublic  (currentUser && currentUser.username === challenge.username)
        // );
  
        setChallenges(data);
      } catch (error) {
        setErrorMessage("챌린지를 불러오는 중 문제가 발생했습니다.");
      } finally {
        setLoading(); // 반드시 호출
      }
    };
  
    fetchChallenges();
  }, []);

  const calculateDaysLeft = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0; // 남은 날짜가 음수일 경우 0 반환
  };

  const isUserChallenge = (challenge) => {
    console.log(currentUser.username,challenge.username);
    return currentUser?.username === challenge?.username; // 현재 사용자와 챌린지 작성자 비교
  };

  const handleJournalClick = (challengeId) => {
    navigate("/journal/"+challengeId); // Journal 페이지로 이동
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
              <h4>{challenge.username}님의 <strong>onepointup</strong>!</h4>
            </span>
            <span className="challenge-title">제목:{challenge.title}</span>
             {/* 챌린지 설명 */}
          <div className="challenge-description">내용:{challenge.description}</div>
            <div className="challenge-progress">
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${challenge.progress || 0}%` }}
                ></div>달성률%
              </div>
              <span className="challenge-days">
               Day - {calculateDaysLeft(challenge.endDate)}
              </span>
            </div>
          </div>
          
         

          {/* 챌린지 추가 버튼 */}
          <div className="challenge-actions">
            {isUserChallenge(challenge) && (
              <button
                className="record-button"
                onClick={(e) => {
                  e.stopPropagation(); // 부모의 클릭 이벤트 막기
                  handleJournalClick(challenge.id);
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
