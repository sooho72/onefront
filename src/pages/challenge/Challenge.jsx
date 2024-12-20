// src/components/Challenge.jsx

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // Redux 사용
import { useNavigate } from "react-router-dom"; // 페이지 이동
import challengeService from '../../services/challengeService';
import '../../pages/challenge/Challenge.css'; // CSS 파일 가져오기
import Navsidebar from "../../components/Navsidebar";
import CommentModal from "../../components/CommentModal"; // CommentModal 임포트

const Challenge = () => {
    const [challenges, setChallenges] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true); // 로딩 상태 추가
    const currentUser = useSelector((state) => state.user); // 현재 로그인된 사용자 정보
    const navigate = useNavigate(); // 페이지 이동 함수

    // 댓글 모달 제어를 위한 상태
    const [showCommentModal, setShowCommentModal] = useState(false);
    // 현재 선택된 챌린지 ID
    const [selectedChallengeId, setSelectedChallengeId] = useState(null);
    // 댓글 목록 갱신을 위한 상태
    const [commentRefresh, setCommentRefresh] = useState(0);

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const data = await challengeService.getChallenges();

                // 필터링: 공개 글 또는 작성자가 현재 사용자와 동일한 비공개 글만 포함
                const filteredData = data.filter(
                    (challenge) =>
                        challenge.isPublic || (currentUser && currentUser.username === challenge.username)
                );

                // 생성일 기준으로 내림차순 정렬 (최신순)
                const sortedData = filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                setChallenges(sortedData); // 필터링 및 정렬된 데이터를 상태에 설정
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
        setSelectedChallengeId(challengeId); // 현재 선택된 챌린지 ID 설정
        setShowCommentModal(true); // 댓글 모달 열기
    };

    const handleCommentAdded = () => {
        // 댓글이 추가된 후 CommentList를 갱신하기 위해 refresh 상태 업데이트
        setCommentRefresh(prev => prev + 1);
    };

    return (
        <div className="challenge-list-container">
            <Navsidebar />

            {/* 로딩 상태 */}
            {loading && <p className="loading-message">챌린지를 불러오는 중입니다...</p>}

            {/* 에러 메시지 */}
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            {/* 챌린지 없을 때 메시지 */}
            {!loading && challenges.length === 0 && <p>등록된 챌린지가 없습니다.</p>}

            {/* 챌린지 목록 */}
            <div className="challenges-wrapper">
                {challenges.map((challenge) => (
                    <div
                        key={challenge.id}
                        className={`challenge-container ${challenge.progress === 100 ? 'completed' : ''}`}
                        onClick={() => handleChallengeClick(challenge.id)} // ChallengeRead로 이동
                    >
                        {/* 생성일 표시 */}
                        <div className="challenge-date">
                            생성일: {new Date(challenge.createdAt).toLocaleDateString()}
                        </div>
                        <span className="challenge-days">
                            Day - {calculateDaysLeft(challenge.endDate)}
                        </span>

                        {/* 챌린지 헤더 */}
                        <div className="challenge-header">
                            <span className="challenge-user">
                                <h4>{challenge.name}님의 <strong>onepointup</strong>!</h4>
                            </span>
                            <span className="challenge-title">제목: {challenge.title}</span>
                        </div>

                        {/* 챌린지 설명 */}
                        <div className="challenge-description">내용: {challenge.description}</div>

                        {/* 진행률 바 및 달성률 */}
                        <div className="challenge-progress">
                <div className="progress-bar">
                        <div
                 className={`progress-bar-fill ${challenge.progress === 100 ? 'completed' : ''}`}
                style={{
        width: `${challenge.progress || 0}%`,
        backgroundColor: challenge.progress >= 100 ? '#ff9f43' : '#28a745', // 주황색
                     }}
                    ></div>
                 </div>
            <div
                    className={`progress-text ${challenge.progress === 100 ? 'completed' : ''}`}
                    style={{
                    color: challenge.progress === 100 ? '#ff9f43' : '#333', // 텍스트 색상
                    }}
                >
                    {challenge.progress === 100 ? (
                    <>
                        <span className="icon">🏆</span> 달성 완료
                        </>
                        ) : (
                        challenge.progress !== undefined ? `${challenge.progress}% 달성` : "달성률 없음"
                        )}
                        </div>
                        </div>
                        {/* 챌린지 추가 버튼 */}
                        <div className="challenge-actions">
                            {isUserChallenge(challenge) && (
                                <button
                                    className="record-button btn btn-outline-warning"
                                    onClick={(e) => {
                                        e.stopPropagation(); // 부모의 클릭 이벤트 막기
                                        handleJournalClick(challenge);
                                    }}
                                >
                                    기록하기
                                </button>
                            )}
                            {/* "응원댓글 남기기" 버튼을 조건부로 렌더링 (로그인한 사용자만) */}
                            {!isUserChallenge(challenge) && (
                                currentUser ? (
                                    <button
                                        className="cheer-button btn btn-outline-primary"
                                        onClick={(e) => {
                                            e.stopPropagation(); // 부모의 클릭 이벤트 막기
                                            handleCommentClick(challenge.id);
                                        }}
                                    >
                                        응원댓글 
                                    </button>
                                ) : (
                                    <button
                                        className="cheer-button btn btn-outline-secondary"
                                        onClick={(e) => {
                                            e.stopPropagation(); // 부모의 클릭 이벤트 막기
                                            alert("응원댓글을 남기려면 로그인해야 합니다.");
                                            navigate("/login"); // 로그인 페이지로 이동
                                        }}
                                    >
                                        응원댓글
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* 댓글 모달 */}
            <CommentModal
                show={showCommentModal}
                handleClose={() => {
                    setShowCommentModal(false);
                    setSelectedChallengeId(null); // 모달 닫을 때 선택된 챌린지 ID 초기화
                }}
                challengeId={selectedChallengeId} // 현재 선택된 챌린지 ID 전달
                currentUser={currentUser}
                onCommentAdded={handleCommentAdded} // 댓글 추가 후 처리 함수
            />
        </div>
    );
};

export default Challenge;
