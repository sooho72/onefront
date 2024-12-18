import React, { useEffect, useState } from 'react';
import UserService from "../../services/user.service";
import Role from '../../models/Role';
const Admin = () => {
    
  const [users, setUsers] = useState([]); // 모든 유저 리스트
  const [currentUser, setCurrentUser] = useState(null); // 현재 로그인 중인 유저
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 상태

  // 모든 유저와 현재 로그인 중인 유저 가져오기
  useEffect(() => {
      UserService.getAllUsers()
          .then(response => {
              setUsers(response.data.allUsers); // 모든 유저 리스트 설정
              setCurrentUser(response.data.currentUser); // 현재 로그인 유저 설정
          })
          .catch(error => {
              console.error('Error fetching users:', error);
              setErrorMessage('유저 데이터를 가져오는 중 에러가 발생했습니다.');
          });
  }, []);

  // 역할 변경 함수
  const changeRole = (username,newRole) => {
      UserService.changeRole(username, newRole) // UserService에서 ID와 새 역할 전달
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
      <div>
          <h1>관리자 페이지</h1>
          <h2>가입한 유저</h2>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <table>
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
                                  <button onClick={() => changeRole(user.username, 'ADMIN')}>Make Admin</button>
                              )}
                              {user.role !== 'USER' && (
                                  <button onClick={() => changeRole(user.username, 'USER')}>Make User</button>
                              )}
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
  );
};

export default Admin;