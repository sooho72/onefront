import React, { useEffect, useState } from "react";
import "./Navsidebar.css";
import { useDispatch, useSelector } from 'react-redux';
import { clearCurrentUser } from '../store/actions/user';
const Navsidebar = ({ name, profilePicUrl }) => {
  const [currentTime, setCurrentTime] = useState("");
  const currentUser=useSelector((state) => state.user);

  useEffect(() => {
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

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDate = today.getDate();

  return (
    <div className="navbar-side">
      <div className="profile-section-side">
        <div className="profile-pic-side">
          <img src={profilePicUrl} alt="프로필" className="profile-image-side" />
        </div>
        <div className="welcome-text-side">{currentUser.name}님 반갑습니다</div>
        <div className="time-side">{currentTime}</div>
        <div className="calendar-side">
          <div className="calendar-header-side">
            <span>{currentYear}</span>년 <span>{currentMonth}</span>월 <span>{currentDate}</span>일
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navsidebar;
