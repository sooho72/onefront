// src/pages/challenge/ChallengeRead.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Redux로 사용자 정보 가져오기
import challengeService from "../../services/challengeService";
import Modal from "react-bootstrap/Modal"; // React-Bootstrap 모달
import Button from "react-bootstrap/Button";
import './ChallengeRead.css'; // 스타일 시트 추가
import journalService from "../../services/journalService";


const ChallengeRead = () => {
  const { challengeId } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [journals, setJournals] = useState([]); // 저널 상태 추가
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!challengeId) {
      setErrorMessage("유효하지 않은 챌린지 ID입니다.");
      setLoading(false);
      return;
    }

    // 챌린지 데이터 가져오기
    challengeService
      .getChallengeById(challengeId)
      .then((response) => {
        setChallenge(response);
      })
      .catch((err) => {
        setErrorMessage("챌린지 정보를 불러오는 중 에러가 발생했습니다.");
        console.error(err);
      });

    // 저널 데이터 가져오기
    journalService
      .getJournalsByChallengeId(challengeId)
      .then((response) => {
        setJournals(response); // 저널 상태 업데이트
      })
      .catch((err) => {
        console.error(`저널 데이터를 가져오는 중 오류 발생: ${err}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [challengeId]);

  if (loading) {
    return <p>로딩 중...</p>;
  }

  if (errorMessage) {
    return <p className="alert alert-danger">{errorMessage}</p>;
  }

  if (!challenge) {
    return <p>챌린지 정보를 찾을 수 없습니다.</p>;
  }

  const isOwner =
    currentUser && challenge && currentUser.username === challenge.username;

  const confirmEdit = () => {
    if (!isOwner) {
      alert("수정 권한이 없습니다.");
      return;
    }
    setShowEditModal(false);
    navigate(`/challenge/edit/${challengeId}`);
  };

  const confirmDelete = () => {
    if (!isOwner) {
      alert("삭제 권한이 없습니다.");
      return;
    }
    setShowDeleteModal(false);
    challengeService
      .deleteChallenge(challengeId)
      .then(() => {
        alert("챌린지가 삭제되었습니다.");
        navigate("/challenge");
      })
      .catch((err) => {
        alert("삭제 중 에러가 발생했습니다.");
        console.error(err);
      });
  };

  return (
    <div className="challenge-read-container">
      <div className="challenge-content">
        <div className="card">
          <div className="card-header">
            <h3>{challenge.title}</h3>
          </div>
          <div className="card-body">
            {/* 챌린지 정보 테이블 */}
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th scope="row">작성자</th>
                  <td>{challenge.name || "알 수 없음"}님</td>
                </tr>
                <tr>
                  <th scope="row">내용</th>
                  <td>{challenge.description}</td>
                </tr>
                <tr>
                  <th scope="row">시작일</th>
                  <td>{new Date(challenge.startDate).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <th scope="row">마지막일</th>
                  <td>{new Date(challenge.endDate).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <th scope="row">달성률</th>
                  <td>{challenge.progress}%</td>
                </tr>
                <tr>
                  <th scope="row">완료여부</th>
                  <td>{challenge.isCompleted ? "Yes" : "No"}</td>
                </tr>
              </tbody>
            </table>

            {/* 저널 목록 */}
            <h4>저널 목록</h4>
            {journals.length > 0 ? (
              <ul className="list-group">
                {journals.map((journal) => (
                  <li key={journal.id} className="list-group-item">
                    <strong>{new Date(journal.createdAt).toLocaleDateString()}</strong>: {journal.content}
                  </li>
                ))}
              </ul>
            ) : (
              <p>등록된 저널이 없습니다.</p>
            )}
          </div>
        </div>

        {/* 작성자만 버튼 표시 */}
        {isOwner && (
          <div className="footer-section">
            <div className="owner-buttons">
              <button
                className="btn btn-outline-warning record-button"
                onClick={() => navigate(`/journal/${challenge.id}`)}
              >
                기록하기
              </button>
              <div className="action-buttons">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setShowEditModal(true)}
                >
                  수정하기
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => setShowDeleteModal(true)}
                >
                  삭제하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 수정 모달 */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>수정 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>이 챌린지를 수정하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            취소
          </Button>
          <Button variant="primary" onClick={confirmEdit}>
            수정하기
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 삭제 모달 */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>삭제 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>정말로 이 챌린지를 삭제하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            취소
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            삭제하기
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ChallengeRead;