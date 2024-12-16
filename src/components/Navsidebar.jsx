import React, { useEffect, useState } from "react";
import "./Navsidebar.css";
import { useDispatch, useSelector } from "react-redux";
import userService from "../services/user.service";

const Navsidebar = () => {
  const [currentTime, setCurrentTime] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState("/default-profile.png"); // 기본 이미지 URL
  const currentUser = useSelector((state) => state.user);

  useEffect(() => {
    // 현재 시간 업데이트
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
    // 프로필 이미지 불러오기
    if (currentUser?.username) {
      userService
        .getProfileImage(currentUser.username)
        .then((response) => {
          const url = URL.createObjectURL(response.data);
          setProfilePicUrl(url);
        })
        .catch((error) => {
          console.error("프로필 이미지 불러오기 오류:", error);
          setProfilePicUrl("/default-profile.png"); // 오류 발생 시 기본 이미지 사용
        });
    }
  }, [currentUser?.username]);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDate = today.getDate();

  return (
    <div className="navbar-side">
      <div className="profile-section-side">
        <div className="profile-pic-side">
          <img
            src={profilePicUrl}
            alt="프로필 이미지"
            className="profile-image-side"
          />
        </div>
        <div className="welcome-text-side">
          {currentUser?.name
            ? `${currentUser.name}님 반갑습니다`
            : "방문자님 반갑습니다"}
        </div>
        <div className="time-side">{currentTime}</div>
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