import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import challengeService from "../../services/challengeService";
import '../../pages/challengeMe.css'

const ChallengeMe = () => {
  const [myChallenges, setMyChallenges] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
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

  return (
    <div>
      <div className="container mt-5">
        <h1>나의 챌린지</h1>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        {myChallenges.length === 0 && !errorMessage && <p>등록된 챌린지가 없습니다.</p>}
        <div className="card mt-3">
          <div className="card-body">
            <ul className="list-group">
              {myChallenges.map((challenge) => (
                <li
                  key={challenge.id}
                  className="list-group-item"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleChallengeClick(challenge.id)} // 클릭 시 이동
                >
                  <strong>제목:</strong> {challenge.title} <br />
                  <strong>내용:</strong> {challenge.description} <br />
                  <strong>달성률:</strong> {challenge.progress}% <br />
                  <strong>기간:</strong>{" "}
                  {new Date(challenge.startDate).toLocaleDateString()} ~{" "}
                  {new Date(challenge.endDate).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeMe;
