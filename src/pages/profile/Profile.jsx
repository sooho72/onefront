import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import userService from "../../services/user.service";
import '../profile/Profile.css'
import Role from "../../models/Role"; 
import { clearCurrentUser } from "../../store/actions/user";

const Profile = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const currentUser = useSelector((state) => state.user);
    const dispatch = useDispatch();

    // 사용자 정보 및 프로필 이미지 불러오기
    useEffect(() => {
        // 사용자 정보 불러오기
        userService.getUserInfo(currentUser.username)
            .then((response) => {
                setUserInfo(response.data);
            })
            .catch((error) => {
                console.error("사용자 정보 불러오기 오류:", error);
                setErrorMessage("사용자 정보를 불러오는 중 오류가 발생했습니다.");
            });

        // 프로필 이미지 불러오기
        userService.getProfileImage(currentUser.username)
            .then((response) => {
                const url = URL.createObjectURL(response.data);
                setImageUrl(url);
            })
            .catch((error) => {
                console.error("프로필 이미지 불러오기 오류:", error);
                setImageUrl(null);
            });
    }, [currentUser.username]);

    // 파일 선택 핸들러
    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const validTypes = ["image/jpeg", "image/png"];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!validTypes.includes(file.type)) {
                setErrorMessage("JPEG 또는 PNG 형식의 파일만 업로드 가능합니다.");
                setSelectedFile(null);
                return;
            }

            if (file.size > maxSize) {
                setErrorMessage("파일 크기는 5MB를 초과할 수 없습니다.");
                setSelectedFile(null);
                return;
            }

            setSelectedFile(file);
            setErrorMessage("");
            setSuccessMessage("");
        }
    };

    // 파일 업로드 핸들러
    const handleUpload = async () => {
        if (!selectedFile) {
            setErrorMessage("업로드할 파일을 선택해주세요.");
            return;
        }

        try {
            await userService.uploadProfileImage(currentUser.username, selectedFile);
            setErrorMessage("");
            setSuccessMessage("프로필 이미지 업로드가 완료되었습니다.");
            const url = URL.createObjectURL(selectedFile);
            setImageUrl(url);
            setSelectedFile(null);
        } catch (error) {
            console.error("프로필 이미지 업로드 중 오류 발생:", error);
            setErrorMessage("업로드 중 오류가 발생했습니다.");
            setSuccessMessage("");
        }
    };

    return (
        <div className="profile-container">
            <h1>내 프로필</h1>

            {/* 에러 및 성공 메시지 */}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            <div className="profile-card">
                {/* 프로필 이미지 섹션 */}
                <div className="profile-image-section">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="프로필 이미지"
                            className="profile-image"
                        />
                    ) : (
                        <div className="no-image">프로필 이미지가 없습니다.</div>
                    )}
                    <div className="upload-section">
                        <input
                            type="file"
                            accept="image/jpeg, image/png"
                            onChange={handleFileChange}
                            className="form-control"
                        />
                        <button
                            onClick={handleUpload}
                            className="btn btn-upload mt-2"
                            disabled={!selectedFile}
                        >
                            업로드
                        </button>
                    </div>
                </div>

                {/* 사용자 정보 섹션 */}
                {userInfo && (
                    <div className="user-info-section">
                        <h4>사용자 정보</h4>
                        <table className="table table-bordered">
                            <tbody>
                                <tr>
                                    <th>이름</th>
                                    <td>{userInfo.name}</td>
                                </tr>
                                <tr>
                                    <th>유저네임</th>
                                    <td>{userInfo.username}</td>
                                </tr>
                                <tr>
                                    <th>가입일자</th>
                                    <td>{new Date(userInfo.createdAt).toLocaleDateString()}</td>
                                </tr>
                                <tr>
                                    <th>권한</th>
                                    <td>{currentUser.role}</td>
                                </tr>
                            </tbody>
                        </table>
                        {/* 권한 변경 버튼 (선택 사항) */}
                        {/* 
                        <button onClick={changeRole} className="btn btn-primary">
                            권한 변경
                        </button> 
                        */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;