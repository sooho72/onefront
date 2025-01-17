import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import userService from "../services/user.service";
import challengeService from "../services/challengeService";
import "./Navsidebar.css";

const Navsidebar = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState(null); // Start as null
  const currentUser = useSelector((state) => state.user);
  const [inProgressChallenges, setInProgressChallenges] = useState([]);

  useEffect(() => {
    // Update current time every second
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setCurrentTime(formattedTime);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Fetch profile picture and in-progress challenges
    if (currentUser?.username) {
      userService
        .getProfileImage(currentUser.username)
        .then((response) => {
          const url = URL.createObjectURL(response.data);
          setProfilePicUrl(url);
        })
        .catch((error) => {
          console.error("Failed to fetch profile image:", error);
          setProfilePicUrl(null); // Use FontAwesomeIcon if failed
        });

      challengeService
        .getInProgressChallenges(currentUser.username)
        .then(setInProgressChallenges)
        .catch((error) => console.error("Error fetching in-progress challenges:", error));
    }
  }, [currentUser?.username]);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDate = today.getDate();

  // Render Navsidebar only if user is logged in
  if (!currentUser) {
    return null;
  }

  return (
    <div className="navbar-side">
      <div className="profile-section-side">
        <div className="profile-pic-side">
          {profilePicUrl ? (
            <img
              src={profilePicUrl}
              alt="프로필 이미지"
              className="profile-image-side"
            />
          ) : (
            <FontAwesomeIcon icon={faUserCircle} className="user-icon" />
          )}
        </div>
        <div className="welcome-text-side">
          {currentUser?.name
            ? `${currentUser.name}님 반갑습니다`
            : "방문자님 반갑습니다"}
        </div>
        <div className="time-side">시간: {currentTime}</div>
        <div>
          <NavLink to="/challengeme" className="nav-link">
            나의 챌린지
          </NavLink>
          <p className="ch-font">챌린지 진행 중</p>
          {inProgressChallenges.length > 0 ? (
            <ul>
              {inProgressChallenges.map((challenge) => (
                <li key={challenge.id}>
                  <p className="ch-font">{challenge.title}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="ch-font">"진행중 인 챌린지가 없습니다."</p>
          )}
        </div>
        <div className="calendar-side">
          <div className="calendar-header-side">
            <span>{currentYear}</span>년 <span>{currentMonth}</span>월{" "}
            <span>{currentDate}</span>일
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navsidebar;
