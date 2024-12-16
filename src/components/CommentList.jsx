// src/components/CommentList.jsx

import React, { useState, useEffect } from "react";
import CommentService from "../services/commentService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Spinner } from 'react-bootstrap';
import "./CommentList.css"; // 스타일링을 위한 CSS 파일

const CommentList = ({ challengeId, currentUser, refresh }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!challengeId) {
            setError("챌린지 ID가 없습니다.");
            setLoading(false);
            return;
        }

        const fetchComments = async () => {
            setLoading(true);
            try {
                const response = await CommentService.getCommentsByChallengeId(challengeId);
                setComments(response.data);
            } catch (err) {
                console.error("댓글을 불러오는 중 오류 발생:", err);
                setError("댓글을 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [challengeId, refresh]); // refresh가 변경될 때마다 댓글을 다시 불러옵니다.

    // 날짜 및 시간 포맷팅 함수
    const formatDateTime = (isoString) => {
        if (!isoString) return "";

        const date = new Date(isoString);

        // 옵션을 설정하여 원하는 형식으로 포맷팅
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        };

        return date.toLocaleString('ko-KR', options).replace(',', '');
    };

    // 댓글 삭제 핸들러
    const handleDelete = async (commentId) => {
        const confirmDelete = window.confirm("정말로 이 댓글을 삭제하시겠습니까?");
        if (!confirmDelete) return;

        try {
            await CommentService.deleteComment(commentId);
            alert("댓글이 성공적으로 삭제되었습니다.");
            // 댓글 목록 갱신을 위해 refresh 상태를 변경하거나, 로컬 상태 업데이트
            setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
        } catch (error) {
            console.error("댓글 삭제 중 오류 발생:", error);
            alert("댓글 삭제에 실패했습니다.");
        }
    };

    if (loading) return (
        <div className="loading-spinner">
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    );
    if (error) return <p className="error-message">{error}</p>;
    if (comments.length === 0) return <p>댓글이 없습니다.</p>;

    return (
        <div className="comment-list-container">
            <h3>댓글 목록</h3>
            <ul className="comment-list">
                {comments.map(comment => (
                    <li key={comment.id} className="comment-item">
                        <div className="comment-header">
                            <span className="comment-date">{formatDateTime(comment.createdAt)}</span>
                           <strong className="comment-username">{comment.name}님</strong>
                            {/* 본인이 작성한 댓글에만 삭제 버튼 표시 */}
                            {currentUser && comment.username === currentUser.username && (
                                <button
                                    className="delete-button"
                                    onClick={() => handleDelete(comment.id)}
                                    aria-label={`댓글 삭제: ${comment.username}`}
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </button>
                            )}
                        </div>
                        <div className="comment-content">{comment.content}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CommentList;
