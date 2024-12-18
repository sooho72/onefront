import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import userService from "../../services/user.service";
import Role from "../../models/Role"; 
import { clearCurrentUser } from "../../store/actions/user";

const Profile = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const currentUser = useSelector((state) => state.user);

    // 사용자 정보 및 프로필 이미지 불러오기
    useEffect(() => {
        // 사용자 정보 불러오기
        userService.getUserInfo(currentUser.username)
            .then((response) => {
                setUserInfo(response.data);
            })
            .catch((error) => {
                console.error("사용자 정보 불러오기 오류:", error);
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

    // 권한 변경
    // const changeRole = () => {
    //     const newRole = currentUser.role === Role.ADMIN ? Role.USER : Role.ADMIN;

    //     userService.changeRole(newRole)
    //         .then(() => {
    //             dispatch(clearCurrentUser());
    //             window.location.href = "/login";
    //         })
    //         .catch((err) => {
    //             setErrorMessage("예기치 않은 에러가 발생했습니다.");
    //             console.log(err);
    //         });
    // };

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
            setErrorMessage("프로필 이미지 업로드 완료.");
            const url = URL.createObjectURL(selectedFile);
            setImageUrl(url);
        } catch (error) {
            console.error("프로필 이미지 업로드 중 오류 발생:", error);
            setErrorMessage("업로드 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="mt-5">
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <div className="card">
                <div className="card-header">
                    <div className="row">
                        <h3>{currentUser?.username}님의 프로필</h3>
                    </div>
                        현재 유저의 권한은 <strong>{currentUser?.role}</strong>입니다.
                        {/* <button onClick={changeRole} className="btn btn-primary ms-3">
                            권한 변경
                        </button> */}
                    </div>
                
                <div className="card-body">
                    {/* 프로필 이미지 */}
                    <div className="text-center">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt="프로필 이미지"
                                width="200"
                                className="rounded-circle"
                            />
                        ) : (
                            <p>프로필 이미지가 없습니다.</p>
                        )}
                        <div className="mt-3">
                            <input
                                type="file"
                                accept="image/jpeg, image/png"
                                onChange={handleFileChange}
                            />
                            <button
                                onClick={handleUpload}
                                className="btn btn-secondary mt-2"
                                disabled={!selectedFile}
                            >
                                업로드
                            </button>
                        </div>
                    </div>

                    {/* 사용자 정보 */}
                    {userInfo && (
                        <div className="mt-5">
                            <h4>사용자 정보</h4>
                            <table className="table">
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
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
