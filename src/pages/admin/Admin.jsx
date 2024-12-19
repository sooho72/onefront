import React, { useEffect, useState } from 'react';
import UserService from "../../services/user.service";
import reportService from '../../services/reportService';
import '../admin/Admin.css'
const Admin = () => {
    
    const [users, setUsers] = useState([]); // 모든 유저 리스트
    const [errorMessage, setErrorMessage] = useState(''); // 유저 관련 에러 메시지 상태
    const [reports, setReports] = useState([]); // 모든 신고 리스트
    const [reportsError, setReportsError] = useState(''); // 신고 관련 에러 메시지 상태
    const [loading, setLoading] = useState(true); // 로딩 상태

    // 모든 유저 가져오기
    useEffect(() => {
        UserService.getAllUsers()
            .then(response => {
                setUsers(response.data.allUsers); // 모든 유저 리스트 설정

            })
            .catch(error => {
                console.error('Error fetching users:', error);
                setErrorMessage('유저 데이터를 가져오는 중 에러가 발생했습니다.');
            });
    }, []);

    // 모든 신고 가져오기
    useEffect(() => {
        reportService.getAllReports()
            .then(data => {
                console.log("Received reports data:", data); // 디버그 로그
                if (Array.isArray(data)) {
                    setReports(data); // 모든 신고 리스트 설정
                } else {
                    console.error("Reports data is not an array:", data);
                    setReportsError('신고 데이터를 올바르게 받아오지 못했습니다.');
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching reports:', error);
                setReportsError('신고 데이터를 가져오는 중 에러가 발생했습니다.');
                setLoading(false);
            });
    }, []);


    // 역할 변경 함수
    const changeRole = (username, newRole) => {
        UserService.changeRole(username, newRole) // UserService에서 역할 변경 API 호출
            .then(() => {
                alert("역할이 성공적으로 변경되었습니다.");
                // 유저 목록 새로고침
                UserService.getAllUsers()
                    .then(response => {
                        setUsers(response.data.allUsers); // 변경된 유저 리스트 반영
                    });
            })
            .catch((err) => {
                console.error("Error changing role:", err);
                setErrorMessage("권한 변경 중 에러가 발생했습니다.");
            });
    };

    return (
        <div className="admin-container">
            <h1>관리자 페이지</h1>
            
            {/* 유저 관리 섹션 */}
            <section>
                <h2>가입한 유저</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.name}</td>
                                <td>{user.role}</td>
                                <td>
                                    {user.role !== 'ADMIN' && (
                                        <button className="btn btn-admin" onClick={() => changeRole(user.username, 'ADMIN')}>Make Admin</button>
                                    )}
                                    {user.role !== 'USER' && (
                                        <button className="btn btn-user" onClick={() => changeRole(user.username, 'USER')}>Make User</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* 신고 관리 섹션 */}
            <section>
                <h2>신고 목록</h2>
                {reportsError && <p className="error-message">{reportsError}</p>}
                {loading ? (
                    <p>Loading reports...</p>
                ) : (
                    <table className="report-table">
                        <thead>
                            <tr>
                                <th>Report ID</th>
                                <th>Reporter Username</th>
                                <th>Reporter Name</th>
                                <th>Comment ID</th>
                                <th>Reason</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.length === 0 ? (
                                <tr>
                                    <td colSpan="6">신고된 댓글이 없습니다.</td>
                                </tr>
                            ) : (
                                reports.map(report => (
                                    <tr key={report.id}>
                                        <td>{report.id}</td>
                                        <td>{report.username}</td>
                                        <td>{report.name}</td>
                                        <td>{report.commentId}</td>
                                        <td>{report.reason}</td>
                                        <td>{new Date(report.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );

};

export default Admin;