import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Redux로 사용자 정보 가져오기
import challengeService from "../../services/challengeService";
import Modal from "react-bootstrap/Modal"; // React-Bootstrap 모달
import Button from "react-bootstrap/Button";
import './ChallengeRead.css'; // 스타일 시트 추가

const ChallengeRead = () => {
  const { challengeId } = useParams(); // URL에서 challengeId 가져오기
  const [challenge, setChallenge] = useState(null); // 초기값 null
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector((state) => state.user); // 현재 로그인된 사용자
  const navigate = useNavigate();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!challengeId) {
      setErrorMessage("유효하지 않은 챌린지 ID입니다.");
      setLoading(false);
      return;
    }

    // 특정 챌린지 가져오기
    challengeService
      .getChallengeById(challengeId)
      .then((response) => {
        setChallenge(response);
      })
      .catch((err) => {
        setErrorMessage("챌린지 정보를 불러오는 중 에러가 발생했습니다.");
        console.error(err);
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

 // 현재 로그인 사용자가 챌린지 작성자인지 확인
const isOwner = currentUser && challenge && currentUser.username === challenge.username;

const confirmEdit = () => {
  // 현재 사용자가 작성자인 경우에만 동작
  if (!isOwner) {
    alert("수정 권한이 없습니다.");
    return;
  }

  setShowEditModal(false);
  navigate(`/challenge/edit/${challengeId}`); // 수정 페이지로 이동
};

const confirmDelete = () => {
  // 현재 사용자가 작성자인 경우에만 동작
  if (!isOwner) {
    alert("삭제 권한이 없습니다.");
    return;
  }

  setShowDeleteModal(false);
  challengeService
    .deleteChallenge(challengeId)
    .then(() => {
      alert("챌린지가 삭제되었습니다.");
      navigate("/challenge"); // 목록 페이지로 이동
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
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th scope="row">작성자</th>
                  <td>{challenge.name|| "알 수 없음"}님</td>
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
          </div>
        </div>
        {/* 작성자만 버튼 표시 */}
        {currentUser && challenge && isOwner && (
  <div className="footer-section">
    <div className="owner-buttons">
      <button className="btn btn-outline-warning" onClick={confirmEdit}>
        수정하기
      </button>
      <button className="btn btn-danger" onClick={confirmDelete}>
        삭제하기
      </button>
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
